# tools

`render.mjs` renders one kb page (.svx) to a standalone HTML file — the page as the desk will see it.

```
node render.mjs <project-root> <route-under-src/routes> <output-file>
node render.mjs .. kb/incidents/4471-split ../rendered/4471-split.html
```

Needs `vite`, `@sveltejs/vite-plugin-svelte`, `mdsvex` and `svelte` installed where Node can resolve them from the project root.
