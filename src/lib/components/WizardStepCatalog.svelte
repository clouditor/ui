<script lang="ts">
  import type { Catalog, TargetOfEvaluation } from '$lib/api/orchestrator';
  import type { WizardData } from './Wizard.svelte';

  export let data: WizardData;
  export let catalogs: Catalog[];

  $: selected = new Map(
    catalogs.map((catalog) => [
      catalog.id,
      data.toes.find((toe) => toe.catalogId == catalog.id) !== undefined
    ])
  );

  function toggle(catalog: Catalog) {
    // Check, if catalog already exists in the ToE
    if (!selected.get(catalog.id)) {
      // Does not exist yet -> create new ToE
      const toe: TargetOfEvaluation = {
        catalogId: catalog.id,
        // This will not be the final ID, since we do not know it at this point.
        // This needs to be set by the caller of save()
        cloudServiceId: data.service.id
      };

      // TODO: make this selectable
      if (catalog.assuranceLevels.length > 0) {
        toe.assuranceLevel = catalog.assuranceLevels[0];
      }

      data.toes = [...data.toes, toe];
      console.log('adding');
    } else {
      console.log('removing');
      // Already exists -> remove it from the ToE list
      data.toes = data.toes.filter((toe) => toe.catalogId != catalog.id);
    }
  }
</script>

<ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
  {#each catalogs as catalog, idx}
    <li class="col-span-1 flex rounded-md shadow-sm">
      <button
        on:click={() => toggle(catalog)}
        class="{selected.get(catalog.id) ? 'bg-[' + catalog.color + ']' : 'bg-gray-400'}
         flex w-[4.5rem] flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
      >
        {catalog.shortName}
      </button>
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
