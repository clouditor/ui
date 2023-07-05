<script lang="ts">
  import { createTargetOfEvaluation, type TargetOfEvaluation } from '$lib/api/orchestrator';
  import CatalogComplianceItem from '$lib/components/CatalogComplianceItem.svelte';
  import EnableCatalogButton from '$lib/components/EnableCatalogButton.svelte';
  import type { PageData } from './$types';

  $: enabledItems = data.catalogs.flatMap((catalog) => {
    let toe = data.targets.find((toe) => toe.catalogId == catalog.id);
    if (toe === undefined) {
      return [];
    }

    return [{ catalog, toe }];
  });

  export let data: PageData;

  async function enable(e: CustomEvent<TargetOfEvaluation>) {
    await createTargetOfEvaluation(e.detail);
  }
</script>

<ul class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
  {#each enabledItems as item, i (item.catalog.id)}
    <CatalogComplianceItem {...item} on:enable={enable} />
  {/each}
  {#if data.leftOverCatalogs.length > 0}
    <li>
      <a href="./new">
        <EnableCatalogButton />
      </a>
    </li>
  {/if}
</ul>
