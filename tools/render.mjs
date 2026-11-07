// Render one kb page (.svx) to a standalone HTML file, the way the desk would see it.
// Usage: node render.mjs <project-root> <route-under-src/routes> <output-file>
// Example: node render.mjs .. kb/incidents/4471-split ../rendered/4471-split.html
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { render } from 'svelte/server';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)); // where node_modules lives
const app = path.resolve(process.argv[2]); // kb project root (the repo root here)
const routePath = process.argv[3]; // e.g. kb/incidents/4471-split
const out = path.resolve(process.argv[4]);

const server = await createServer({
  root: app,
  configFile: false,
  mode: 'production',
  logLevel: 'warn',
  plugins: [
    svelte({
      extensions: ['.svelte', '.svx'],
      compilerOptions: { dev: false },
      preprocess: [
        mdsvex({
          extensions: ['.svx'],
          layout: { runbook: path.join(app, 'src/lib/layouts/runbook.svelte') },
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '#lib': path.join(app, 'src/lib'),
    },
  },
  optimizeDeps: { noDiscovery: true, include: [] },
  ssr: { noExternal: true, resolve: { externalConditions: ['svelte'] } },
  server: { middlewareMode: true, fs: { strict: false } },
  appType: 'custom',
});

try {
  const mod = await server.ssrLoadModule(`/src/routes/${routePath}/+page.svx`);
  const { body, head } = render(mod.default, { props: {} });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}</head><body>${body}</body></html>`;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('rendered', html.length, 'bytes ->', out);
} catch (e) {
  console.error('ERR', e);
  process.exitCode = 1;
}
await server.close();
