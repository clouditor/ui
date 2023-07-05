<script lang="ts">
  import type { Catalog, CloudService, TargetOfEvaluation } from '$lib/api/orchestrator';
  import { createEventDispatcher } from 'svelte';
  import AssuranceLevelPopover from './AssuranceLevelPopover.svelte';
  import ComplianceChart from './ComplianceChart.svelte';

  export let catalog: Catalog;
  export let service: CloudService;
  export let toe: TargetOfEvaluation | undefined;

  const dispatch = createEventDispatcher<{ enable: TargetOfEvaluation }>();

  function enable(e: CustomEvent<TargetOfEvaluation>) {
    dispatch('enable', e.detail);
  }
</script>

<li class="overflow-hidden rounded-xl border border-gray-200">
  <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
    <div class="text-sm font-medium leading-6 text-gray-900">{catalog.name}</div>
  </div>
  <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
    <div class="flex justify-between gap-x-4 py-3">
      <dt class="text-gray-500">Description</dt>
      <dd class="flex items-start gap-x-2">
        <div class="font-medium text-gray-900">{catalog.description}</div>
      </dd>
    </div>
    {#if toe}
      <ComplianceChart {toe} />
    {:else}
      <div>
        {#if catalog.assuranceLevels.length > 0}
          <AssuranceLevelPopover {catalog} {service} on:select={enable}>
            <button
              type="button"
              class="relative block h-96 w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                />
              </svg>
              <span class="mt-2 block text-sm font-semibold text-gray-900">Enable Catalog</span>
            </button>
          </AssuranceLevelPopover>
        {:else}
          <button
            type="button"
            class="relative block h-96 w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            on:click={() => {
              dispatch('enable', {
                catalogId: catalog.id,
                cloudServiceId: service.id
              });
            }}
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              />
            </svg>
            <span class="mt-2 block text-sm font-semibold text-gray-900">Enable Catalog</span>
          </button>
        {/if}
      </div>
    {/if}
  </dl>
</li>
