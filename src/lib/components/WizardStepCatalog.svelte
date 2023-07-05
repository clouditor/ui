<script lang="ts">
  import type { Catalog, TargetOfEvaluation } from '$lib/api/orchestrator';
  import AssuranceLevelPopover from './AssuranceLevelPopover.svelte';
  import type { WizardData } from './Wizard.svelte';

  export let data: WizardData;
  export let catalogs: Catalog[];

  // Reactive property for the selection status of all catalogs
  $: selected = new Map(
    catalogs.map((catalog) => [
      catalog.id,
      data.toes.find((toe) => toe.catalogId == catalog.id) !== undefined
    ])
  );

  function assuranceLevelSelected(e: CustomEvent<{ catalog: Catalog; assuranceLevel: string }>) {
    toggle(e.detail.catalog, e.detail.assuranceLevel);
  }

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
        <AssuranceLevelPopover
          {catalog}
          on:select={assuranceLevelSelected}
          selected={selected.get(catalog.id) == true}
        />
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
