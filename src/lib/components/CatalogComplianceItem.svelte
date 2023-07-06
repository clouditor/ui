<script lang="ts">
  import type { Catalog, TargetOfEvaluation } from '$lib/api/orchestrator';
  import ComplianceChart from './ComplianceChart.svelte';

  export let catalog: Catalog;
  export let toe: TargetOfEvaluation;
  export let compliance: Map<string, boolean>;
</script>

<li class="overflow-hidden rounded-xl border border-gray-200">
  <a href={'/cloud/' + toe.cloudServiceId + '/compliance/' + catalog.id}>
    <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
      <div class="text-sm font-medium leading-6 text-gray-900">{catalog.name}</div>
    </div>
  </a>
  <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
    <div class="flex justify-between gap-x-4 py-3">
      <dt class="text-gray-500">Description</dt>
      <dd class="flex items-start gap-x-2">
        <div class="font-medium text-gray-900">{catalog.description}</div>
      </dd>
    </div>
    <ComplianceChart {compliance} {toe} />
    <div class="flex justify-between gap-x-4 py-3">
      <dt class="text-gray-500">Controls in Scope</dt>
      <dd class="flex items-start gap-x-2">
        <div class="font-medium text-gray-900">{toe.controlsInScope?.length}</div>
      </dd>
    </div>
    <div class="flex justify-between gap-x-4 py-3">
      <dt class="text-gray-500">Assurance Level</dt>
      <dd class="flex items-start gap-x-2">
        <div class="font-medium text-gray-900">
          {toe.assuranceLevel ?? '-'}
        </div>
      </dd>
    </div>
  </dl>
</li>
