<script lang="ts">
  import type { EvaluationResult } from '$lib/api/evaluation';
  import type { Control } from '$lib/api/orchestrator';
  import { DisclosureButton } from '@rgossiaux/svelte-headlessui';
  import { CheckCircle, EllipsisHorizontalCircle, XCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { createEventDispatcher } from 'svelte';

  export let result: EvaluationResult;
  export let control: Control | undefined;

  const dispatch = createEventDispatcher<{ addResult: { control: Control } }>();

  function addResult() {
    if (control !== undefined) {
      dispatch('addResult', { control: control });
    }
  }
</script>

<div class="flex">
  <div class="mr-4 flex-shrink-0">
    {#if result.status == 'EVALUATION_STATUS_COMPLIANT'}
      <Icon src={CheckCircle} theme="solid" class="w-8 h-8 text-green-800" />
    {:else if result.status == 'EVALUATION_STATUS_COMPLIANT_MANUALLY'}
      <Icon src={CheckCircle} theme="solid" class="w-8 h-8 text-clouditor" />
    {:else if result.status == 'EVALUATION_STATUS_PENDING'}
      <button on:click={addResult}>
        <Icon src={EllipsisHorizontalCircle} theme="solid" class="w-8 h-8 text-gray-400" />
      </button>
    {:else}
      <a href="../../assessments/?filterIds={result.failingAssessmentResultIds.join(',')}">
        <Icon src={XCircle} theme="solid" class="w-8 h-8 text-red-800" />
      </a>
    {/if}
  </div>
  <div>
    <h4 class="text-base font-semibold">
      {#if control?.parentControlId === undefined}
        <DisclosureButton>
          {result.controlId}{#if control?.name !== undefined && control.name != ''}: {control.name}{/if}
        </DisclosureButton>
      {:else}
        {result.controlId}{#if control?.name !== undefined && control.name != ''}: {control.name}{/if}
      {/if}
    </h4>
    <p class="mt-1 text-sm text-gray-500">
      {control?.description}
    </p>
  </div>
</div>
