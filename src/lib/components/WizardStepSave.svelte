<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import type { WizardData } from './Wizard.svelte';

  export let data: WizardData;

  const dispatch = createEventDispatcher<{ save: WizardData; cancel: {} }>();

  function save() {
    dispatch('save', data);
  }

  function cancel() {
    dispatch('cancel');
  }
</script>

<div class="text-sm mb-5">
  {#if data.service.name.length == 0}
    Please provide at least a name for the new cloud service.
  {:else}
    {#if data.mode == 'create'}
      This will create a new cloud service called <b>{data.service.name}</b> with
    {:else}
      This will change the cloud service called <b>{data.service.name}</b> with
    {/if}
    {#if data.toes.length > 0}
      the following targets of evaluation:
      <ul class="list-disc mt-1 ml-4">
        {#each data.toes as toe}
          <li>
            {toe.catalogId}
            {#if toe.assuranceLevel !== undefined}
              ({toe.assuranceLevel})
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      no configured target of evaluation.
    {/if}
  {/if}
</div>

<Button on:click={save} disabled={data.service.name.length == 0}>
  {#if data.mode == 'create'}
    Create
  {:else}
    Save
  {/if}
</Button>
<Button on:click={cancel} class="bg-red-800 hover:bg-red-700 ml-2">Cancel</Button>
