<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const rows = reports as Report[];
  const unique = uniqueById(rows);
  const merged = unique.filter((report) => report.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const repeatedRows = rows.length - unique.length;
</script>

<p class="summary">
  <strong>{merged.length}</strong> unique reports in <strong>{groups.length}</strong> causes
  · {repeatedRows} repeated export rows counted once by report ID
</p>

<div class="causes">
  {#each groups as group (group.cause)}
    {@const oneDayMoves = group.reports.filter((report) => notes.oneDayMove.includes(report.id)).length}
    <article class="cause">
      <h3>{group.cause} · {group.reports.length} reports</h3>
      {#if group.cause === 'parser'}
        <p>The shared parser reads month first, flipping dates for tenants whose locale writes day first.</p>
      {:else if group.cause === 'hint'}
        <p>The booking-v3 form's month-first date hint conflicts with day-first tenants' date conventions.</p>
      {:else}
        <p>These reports need a cause review.</p>
      {/if}
      <p class="detail">
        {group.tenants} tenants · {group.firstSeen} to {group.lastSeen}
      </p>
      {#if oneDayMoves > 0}
        <p class="note">
          Includes {oneDayMoves} desk-noted one-day-move reports. They remain in this cause group; they are not a third problem.
        </p>
      {/if}
    </article>
  {/each}
</div>

<style>
  .summary { font-size: 1.1rem; }
  .summary strong { color: var(--accent); }
  .causes { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); }
  .cause { border: 1px solid var(--line); border-radius: 0.8rem; padding: 1.1rem; background: var(--bg); }
  .cause h3 { margin-top: 0; }
  .detail, .note { color: var(--muted); font-size: 0.9rem; }
  .note { border-left: 3px solid var(--accent); padding-left: 0.75rem; }
</style>