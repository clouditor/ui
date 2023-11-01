<script lang="ts">
  import type { AssessmentResult } from '$lib/api/assessment';
  import { CheckCircle, XCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let result: AssessmentResult;
</script>

{#if result.compliant}
  <Icon src={CheckCircle} theme="solid" class="h-5 w-5 mr-2 text-green-800" />
{:else}
  <Icon src={XCircle} theme="solid" class="h-5 w-5 mr-2 text-red-800" />
{/if}
