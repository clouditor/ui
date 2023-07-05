<script lang="ts">
  import type { Catalog, CloudService, TargetOfEvaluation } from '$lib/api/orchestrator';
  import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
  import { createPopperActions } from 'svelte-popperjs';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    select: TargetOfEvaluation;
  }>();

  const [popperRef, popperContent] = createPopperActions();
  const popperOptions = {
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
  };

  function select(level: string) {
    dispatch('select', {
      cloudServiceId: service.id,
      catalogId: catalog.id,
      assuranceLevel: level
    });
  }

  export let service: CloudService;
  export let catalog: Catalog;
</script>

<Popover class="z-10">
  <PopoverButton as="div" use={[popperRef]} class="w-full h-full">
    <slot />
  </PopoverButton>

  <PopoverPanel use={[[popperContent, popperOptions]]}>
    <div
      class="w-screen max-w-sm flex-auto rounded-3xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5"
    >
      <div class="ml-4 mt-4 mr-4">
        <p class="text-gray-900 font-medium">Please choose an assurance level</p>
        <p class="text-gray-500">
          The selected catalog requires the selection of an assurance level.
        </p>
      </div>

      {#each catalog.assuranceLevels as level}
        <div class="relative rounded-lg p-4 hover:bg-gray-50">
          <button on:click={() => select(level)} class="font-semibold text-gray-900">
            {level}
            <span class="absolute inset-0" />
          </button>
        </div>
      {/each}
    </div>
  </PopoverPanel>
</Popover>
