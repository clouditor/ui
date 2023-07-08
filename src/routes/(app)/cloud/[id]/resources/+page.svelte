<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import { Squares2x2, Clipboard, Check } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import type { Resource } from '$lib/api/discovery';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let data: PageData;

  let currentPage = 1;
  let rowsPerPage = 8;
  let totalPages = Math.ceil(data.resources.length / rowsPerPage);
  let currentData: Resource[] = [];
  let copyingId: string | null = null;

  onMount(() => {
    updateCurrentData();
  });

  function updateCurrentData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    currentData = data.resources.slice(startIndex, endIndex);
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updateCurrentData();
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      updateCurrentData();
    }
  }

  async function copyId(id: string) {
    if (copyingId !== null) return;
    copyingId = id;
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      navigator.clipboard.writeText(id);
    } catch (error) {
      console.error(error);
    } finally {
      copyingId = null;
    }
  }
</script>

{#if data.resources.length == 0}
  <StarterHint type="discovered resources" icon={Squares2x2}>
    <span slot="component">
      Clouditor Discovery with with the cloud service ID <pre>{data.service.id}</pre>
    </span>
  </StarterHint>
{:else}
  <main>
    <table class="min-w-full divide-y divide-gray-200 table-fixed">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
          >
            ID
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider uppercase w-50"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
          >
            Type
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each currentData as resource}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                on:click={() => copyId(resource.id)}
                title={resource.id}
                disabled={copyingId !== null}
              >
                {#if copyingId === resource.id}
                  <Icon src={Check} class="h-5 w-5 mr-2" />
                {:else}
                  <Icon src={Clipboard} class="h-5 w-5 mr-2" />
                {/if}
                Copy
              </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{resource.properties.name}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{resource.resourceType.split(',')[0]}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="mt-4">
      <button
        class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
        on:click={prevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span class="mx-2 text-gray-500">{currentPage}</span>
      <button
        class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
        on:click={nextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </main>
{/if}
