<script lang="ts">
  import type { EvaluationResult } from '$lib/api/evaluation';
  import type { Control } from '$lib/api/orchestrator';
  import { DisclosureButton } from '@rgossiaux/svelte-headlessui';
  import { CheckCircle, EllipsisHorizontalCircle, XCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import AddEvaluationResultDialog from './AddEvaluationResultDialog.svelte';

  export let result: EvaluationResult;
  export let control: Control | undefined;

  function addResult() {
    open = true;
  }

  let open = false;
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

<AddEvaluationResultDialog bind:open on:addResult />
