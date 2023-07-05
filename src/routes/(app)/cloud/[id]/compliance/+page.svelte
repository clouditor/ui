<script lang="ts">
  import {
    createTargetOfEvaluation,
    type Catalog,
    type TargetOfEvaluation
  } from '$lib/api/orchestrator';
  import CatalogComplianceItem from '$lib/components/CatalogComplianceItem.svelte';
  import type { PageData } from './$types';

  $: toeMap = new Map(
    data.targets.map((t) => {
      return [t.catalogId, t];
    })
  );

  export let data: PageData;

  async function enable(e: CustomEvent<TargetOfEvaluation>) {
    await createTargetOfEvaluation(e.detail);
  }
</script>

<ul class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
  {#each data.catalogs as catalog, i (catalog.id)}
    <CatalogComplianceItem
      {catalog}
      service={data.service}
      toe={toeMap.get(catalog.id)}
      on:enable={enable}
    />
  {/each}
</ul>
