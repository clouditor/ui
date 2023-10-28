<script lang="ts">
  import type { AssessmentResult, Metric } from '$lib/api/assessment';
  import type { Resource } from '$lib/api/discovery';
  import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
  import { CircleStack, CodeBracket, CpuChip, Trash } from '@steeze-ui/heroicons';
  import Fa from 'svelte-fa';
  import AssessmentIcon from './AssessmentIcon.svelte';
  import {
    faDatabase,
    faGenderless,
    faMicrochip,
    faNetworkWired,
    faObjectGroup,
    faServer,
    faWarehouse
  } from '@fortawesome/free-solid-svg-icons';

  export let selected: Resource;
  export let results: AssessmentResult[];
  // TODO(oxisto): convert this to a store?!
  export let metrics: Map<string, Metric>;

  function name(id: string) {
    let rr = id.split('/');
    return rr[rr.length - 1];
  }

  function icon(type: string): IconDefinition {
    switch (type) {
      case 'Networking':
        return faNetworkWired;
      case 'NetworkService':
        return faServer;
      case 'Compute':
        return faMicrochip;
      case 'Storage':
        return faDatabase;
      case 'StorageService':
        return faWarehouse;
      case 'ObjectStorageService':
        return faWarehouse;
      case 'ObjectStorage':
        return faDatabase;
      case 'ResourceGroup':
        return faObjectGroup;
      default:
        return faGenderless;
    }
  }
</script>

<div class="flex flex-col bg-white shadow-xl">
  <div class="bg-clouditor px-4 py-6 sm:px-6">
    <div class="flex items-center justify-between">
      <div class="text-base font-semibold leading-6 text-white truncate ...">
        {name(selected.id)}
      </div>
    </div>
    <div class="mt-1">
      <p class="text-sm text-gray-300">
        This resource is of type
        <i>
          {selected.resourceType.split(',')[0]}
        </i>
        and has <i>{results.length}</i> assessment results associated to it.
      </p>
    </div>
  </div>
  <div class="flex-1 px-4 sm:px-6">
    <div class="space-y-6 pb-5 pt-6">
      <div>
        <h3 class="text-sm font-medium leading-6 text-gray-900">Resource Types</h3>
        <div class="mt-2">
          <div class="flex space-x-2">
            {#each selected.resourceType.split(',').filter((r) => r != 'Resource') as type (type)}
              <div
                class="flex rounded-full h-8 w-8 hover:opacity-75 bg-gray-200 align-middle"
                title={type}
              >
                <Fa class="inline-block h-full mt-2 w-8 align-middle" icon={icon(type)} />
              </div>
            {/each}
          </div>
        </div>
      </div>
      <div>
        {#if results.length > 0}
          <div class="text-sm font-medium leading-6 text-gray-900">Assessment Results</div>
          <div class="mt-2 space-y-4">
            {#each results as result}
              <div class="relative flex items-start">
                <div class="absolute flex h-6 items-center">
                  <AssessmentIcon {result} />
                </div>
                <div class="pl-7 text-sm leading-6">
                  <label for="privacy-public" class="font-medium text-gray-900">
                    {metrics.get(result.metricId)?.name}
                  </label>
                  <p id="privacy-public-description" class="text-gray-500">
                    {metrics.get(result.metricId)?.description}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
