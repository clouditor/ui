<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import { Squares2x2 } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#if data.resources.length == 0}
  <StarterHint type="discovered resources" icon={Squares2x2}>
    <span slot="component">
      Clouditor Discovery with with the cloud service ID <pre>{data.service.id}</pre>
    </span>
  </StarterHint>
{:else}
  A list of resources will magically appear here

  <ul class="list-disc">
    {#each data.resources as resource}
      <li>{resource.properties.name}</li>
    {/each}
  </ul>
{/if}
