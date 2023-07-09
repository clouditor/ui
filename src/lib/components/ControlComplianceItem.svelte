<script lang="ts">
  import type { EvaluationResult } from '$lib/api/evaluation';
  import type { Control } from '$lib/api/orchestrator';
  import { CheckCircle, PauseCircle, ExclamationCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let result: EvaluationResult;
  export let control: Control | undefined;
</script>

<div class="flex">
  <div class="mr-4 flex-shrink-0">
    {#if result.status == 'EVALUATION_STATUS_COMPLIANT'}
      <Icon src={CheckCircle} theme="solid" class="w-8 h-8 text-green-800" />
    {:else if result.status == 'EVALUATION_STATUS_PENDING'}
      <Icon src={PauseCircle} theme="solid" class="w-8 h-8 text-gray-400" />
    {:else}
      <Icon src={ExclamationCircle} theme="solid" class="w-8 h-8 text-red-800" />
    {/if}
  </div>
  <div>
    <h4 class="text-base font-semibold">
      {result.controlId}{#if control?.name !== undefined && control.name != ''}: {control.name}{/if}
    </h4>
    <p class="mt-1 text-sm text-gray-500">
      {control?.description}
    </p>
  </div>
</div>
