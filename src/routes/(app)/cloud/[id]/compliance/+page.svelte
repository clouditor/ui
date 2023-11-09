<script lang="ts">
  import { invalidate } from '$app/navigation';
  import {
    stopEvaluation,
    type ComplianceStatus,
    type EvaluationResult
  } from '$lib/api/evaluation';
  import { removeTargetOfEvaluation, type TargetOfEvaluation } from '$lib/api/orchestrator';
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

  // TODO: This should be done in the backend
  $: compliance = buildCompliance(data.topControlResults);

  function buildCompliance(
    evaluations: EvaluationResult[]
  ): Map<string, Map<string, ComplianceStatus>> {
    let all = new Map();
    let compliance: Map<string, ComplianceStatus>;
    for (let result of evaluations) {
      compliance = all.get(result.controlCatalogId);
      if (compliance === undefined) {
        compliance = new Map();
        all.set(result.controlCatalogId, compliance);
      }

      compliance.set(result.controlId, result.status);
    }

    console.log(all);

    return all;
  }

  async function remove(e: CustomEvent<{ toe: TargetOfEvaluation }>) {
    let really = confirm('Do you really want to remove this target of evaluation?');

    if (!really) {
      return;
    }

    await stopEvaluation(e.detail.toe);
    await removeTargetOfEvaluation(e.detail.toe);

    // refresh our ToEs
    invalidate((url) => url.pathname == `/v1/orchestrator/cloud_services/${data.service.id}/toes`);
  }
</script>

<ul class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
  {#each enabledItems as item, i (item.catalog.id)}
    <CatalogComplianceItem
      {...item}
      on:remove={remove}
      compliance={compliance.get(item.catalog.id) ?? new Map()}
    />
  {/each}
  {#if data.leftOverCatalogs.length > 0}
    <li>
      <a href="/cloud/{data.service.id}/compliance/new">
        <EnableCatalogButton />
      </a>
    </li>
  {/if}
</ul>
