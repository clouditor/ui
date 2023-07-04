<script lang="ts">
  import Chart, { type ChartConfiguration } from 'chart.js/auto';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import CatalogComplianceItem from '$lib/components/CatalogComplianceItem.svelte';

  $: toeMap = new Map(
    data.targets.map((t) => {
      return [t.catalogId, t];
    })
  );

  export let data: PageData;
</script>

{JSON.stringify(data.evaluations)}

<ul class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
  {#each data.catalogs as catalog, i (catalog.id)}
    <CatalogComplianceItem {catalog} toe={toeMap.get(catalog.id)} />
  {/each}
</ul>
