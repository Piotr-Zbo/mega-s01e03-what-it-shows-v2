<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  // Counts come from the desk's own classifier (causes.ts) at render time.
  // The one-day reports are a subset of `parser`, never a group of their own.
  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const oneDay = $derived(merged.filter((r) => notes.oneDayMove.includes(r.id)).length);
  const total = $derived(groups.reduce((s, g) => s + g.reports.length, 0));
</script>

<table>
  <thead><tr><th>cause</th><th>reports</th><th>note</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const sub = g.reports.filter((r) => notes.oneDayMove.includes(r.id)).length}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{sub ? `includes ${sub} reports that read as a one-day move (a subset, not extra)` : ''}</td>
      </tr>
    {/each}
    <tr><td><b>total (unique reports in #{ticket})</b></td><td><b>{total}</b></td><td>{oneDay} one-day reports are inside this total</td></tr>
  </tbody>
</table>
