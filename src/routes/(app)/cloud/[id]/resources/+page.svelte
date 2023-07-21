<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import {
    Squares2x2,
    Clipboard,
    Check,
    MagnifyingGlass,
    ChevronUp,
    ChevronDown
  } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import type { Resource, ResourceProperties } from '$lib/api/discovery';
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

  let searchString = '';
  let filteredData = data.resources;

  function filter() {
    const query = searchString.toLowerCase();
    filteredData = data.resources.filter((resource) => {
      return (
        resource.properties.name.toLowerCase().includes(query) ||
        resource.resourceType.toLowerCase().includes(query)
      );
    });
    updateCurrentData();
  }

  let sortAscending = false;

  function sort(sortBy: string) {
    sortAscending = !sortAscending;

    switch (sortBy) {
      case 'name':
        filteredData.sort((a, b) => {
          if (sortAscending) return a.properties['name'].localeCompare(b.properties.name);
          else return b.properties['name'].localeCompare(a.properties.name);
        });
        break;
      case 'type':
        filteredData.sort((a, b) => {
          if (sortAscending) return a.resourceType.localeCompare(b.resourceType);
          else return b.resourceType.localeCompare(a.resourceType);
        });
        break;
    }

    updateCurrentData();
  }

  function updateCurrentData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    currentData = filteredData.slice(startIndex, endIndex);
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

<div>
  <div class="relative mt-2 rounded-md shadow-sm">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-400" />
    </div>
    <input
      name="search"
      id="search"
      class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      placeholder="Search Resources"
      bind:value={searchString}
      on:input={filter}
    />
  </div>
</div>

{#if data.resources.length == 0}
  <StarterHint type="discovered resources" icon={Squares2x2}>
    <span slot="component">
      Clouditor Discovery with with the cloud service ID <pre>{data.service.id}</pre>
    </span>
  </StarterHint>
{:else}
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
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
                class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0"
              >
                <a href="#" class="group inline-flex" on:click={() => sort('name')}>
                  Name
                  <span
                    class="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                  >
                    <Icon src={sortAscending ? ChevronDown : ChevronUp} class="h-4 w-4" />
                  </span>
                </a>
              </th>
              <th
                scope="col"
                class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0"
              >
                <a href="#" class="group inline-flex" on:click={() => sort('type')}>
                  Type
                  <span
                    class="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                  >
                    <Icon src={sortAscending ? ChevronDown : ChevronUp} class="h-4 w-4" />
                  </span>
                </a>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
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
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                  <span class="text-sm text-gray-900">{resource.properties.name}</span>
                </td>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
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
      </div>
    </div>
  </div>
{/if}
