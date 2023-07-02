<script lang="ts">
  import type { Catalog, TargetOfEvaluation } from '$lib/api/orchestrator';
  import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
  import { createPopperActions } from 'svelte-popperjs';
  import type { WizardData } from './Wizard.svelte';

  export let data: WizardData;
  export let catalogs: Catalog[];

  const [popperRef, popperContent] = createPopperActions();
  const popperOptions = {
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
  };

  // Reactive property for the selection status of all catalogs
  $: selected = new Map(
    catalogs.map((catalog) => [
      catalog.id,
      data.toes.find((toe) => toe.catalogId == catalog.id) !== undefined
    ])
  );

  /**
   * This function selects a catalog if its not already selected or de-selects
   * an already selected catalog.
   *
   * If the catalog needs an assurance level, this must be specified as an extra
   * parameter.
   *
   * @param catalog the catalog to (de)-select
   * @param assuranceLevel the assurance level, if the catalog needs it
   */
  function toggle(catalog: Catalog, assuranceLevel?: string) {
    // Check, if catalog already exists in the ToE
    if (!selected.get(catalog.id)) {
      // Does not exist yet -> create new ToE
      const toe: TargetOfEvaluation = {
        catalogId: catalog.id,
        // This will not be the final ID, since we do not know it at this point.
        // This needs to be set by the caller of save()
        cloudServiceId: data.service.id,
        assuranceLevel: assuranceLevel
      };

      data.toes = [...data.toes, toe];
    } else {
      // Already exists -> remove it from the ToE list
      data.toes = data.toes.filter((toe) => toe.catalogId != catalog.id);
    }
  }
</script>

<ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
  {#each catalogs as catalog, idx}
    <li class="col-span-1 flex rounded-md shadow-sm">
      {#if catalog.assuranceLevels.length > 0 && !selected.get(catalog.id)}
        <Popover
          class="{selected.get(catalog.id) ? '' : 'bg-gray-400'}
        flex w-[4.5rem] z-10 flex-shrink-0 items-center justify-center rounded-l-md text-sm text-white"
          style={selected.get(catalog.id) ? 'background-color: ' + catalog.color : ''}
        >
          <PopoverButton use={[popperRef]} class="h-full w-full">
            {catalog.shortName}
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
                  <button
                    on:click={() => toggle(catalog, level)}
                    class="font-semibold text-gray-900"
                  >
                    {level}
                    <span class="absolute inset-0" />
                  </button>
                </div>
              {/each}
            </div>
          </PopoverPanel>
        </Popover>
      {:else}
        <button
          on:click={() => toggle(catalog)}
          class="{selected.get(catalog.id) ? '' : 'bg-gray-400'}
       flex w-[4.5rem] flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
          style={selected.get(catalog.id) ? 'background-color: ' + catalog.color : ''}
        >
          {catalog.shortName}
        </button>
      {/if}
      <div
        class="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white"
      >
        <div class="flex-1 truncate px-4 py-2 text-sm">
          <p class="font-medium text-gray-900 hover:text-gray-600">
            {catalog.name}
          </p>
          <p class="text-xs text-gray-500 whitespace-normal">
            {catalog.description}
          </p>
        </div>
      </div>
    </li>
  {/each}
</ul>
