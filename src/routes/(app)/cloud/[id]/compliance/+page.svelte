<script lang="ts">
  import CatalogComplianceItem from '$lib/components/CatalogComplianceItem.svelte';
  import type { PageData } from './$types';

  $: toeMap = new Map(
    data.targets.map((t) => {
      return [t.catalogId, t];
    })
  );

  export let data: PageData;
</script>

<ul class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
  {#each data.catalogs as catalog, i (catalog.id)}
    <CatalogComplianceItem {catalog} toe={toeMap.get(catalog.id)} />
  {/each}
</ul>
