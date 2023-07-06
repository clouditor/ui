<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  $: results = new Map(
    data.evaluations.map((result) => {
      return [result.controlId, 2];
    })
  );
</script>

Something

<ul>
  {#each data.evaluations as result}
    <li>{result.id} | {result.controlId} | {result.status}</li>
  {/each}
</ul>
