<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import { QueueList } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#if data.results.length == 0}
  <StarterHint type="assessment results" icon={QueueList}>
    <span slot="component">Clouditor Assessment component</span>
  </StarterHint>
{:else}
  Here assessment results will appear
{/if}
