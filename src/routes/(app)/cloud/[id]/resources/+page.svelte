<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import {
    Squares2x2,
    Clipboard,
    Check,
    MagnifyingGlass,
    ChevronUp,
    ChevronDown,
    XCircle,
    Funnel
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

  let searchActivated = false;

  let filterOptions: String[] = [];

  function filter() {
    const query = searchString.toLowerCase();
    filteredData = data.resources.filter((resource) => {
      return (
        resource.properties.name.toLowerCase().includes(query) &&
        (filterOptions.includes(resource.resourceType.split(',')[0]) || filterOptions.length == 0)
      );
    });
    updateCurrentData();
  }

  function toggleSearch() {
    searchActivated = !searchActivated;
    if (!searchActivated) {
      searchString = '';
      filteredData = data.resources;
      updateCurrentData();
    }
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

  let types: Set<String> = new Set();
  let typeArray: String[] = [];

  function updateCurrentData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    currentData = filteredData.slice(startIndex, endIndex);
    types = data.resources.reduce((acc, resource) => {
      acc.add(resource.resourceType.split(',')[0]);
      return acc;
    }, new Set<String>());
    typeArray = Array.from(types);
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

  let filterOptionsVisible = false;

  function toggleFilterOptions() {
    filterOptionsVisible = !filterOptionsVisible;
  }
</script>

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
                class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
              >
                ID
              </th>
              <th
                scope="col"
                class="py-3 px-3 flex text-left text-xs font-medium text-gray-500 uppercase sm:pl-0"
              >
                <div class="group flex items-center my-1">
                  <button
                    type="button"
                    class="inline-flex uppercase align-middle inset-y-0 left-0"
                    on:click={() => sort('name')}
                  >
                    Name
                    <span
                      class="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                    >
                      <Icon src={sortAscending ? ChevronDown : ChevronUp} class="h-4 w-4" />
                    </span>
                  </button>
                  <button
                    type="button"
                    class="inline-flex uppercase align-middle inset-y-0 left-0 items-center group-hover:visible group-focus:visible"
                    on:click={() => toggleSearch()}
                  >
                    <span
                      class="invisible ml-2 rounded text-gray-400 group-hover:visible group-focus:visible"
                    >
                      <Icon
                        src={searchActivated ? XCircle : MagnifyingGlass}
                        class="h-5 w-5 text-gray-400"
                      />
                    </span>
                  </button>
                  {#if searchActivated}
                    <div>
                      <div class="relative rounded-md shadow-sm">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <Icon src={MagnifyingGlass} class="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          name="search"
                          id="search"
                          class="block w-full rounded-md border-0 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Search Resources"
                          bind:value={searchString}
                          on:input={filter}
                        />
                      </div>
                    </div>
                  {/if}
                </div>
              </th>
              <th
                scope="col"
                class=" py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase sm:pl-0"
              >
                <div class="flex items-center my-1">
                  <div class="group flex">
                    <button
                      type="button"
                      class="inline-flex uppercase"
                      on:click={() => sort('type')}
                    >
                      Type
                      <span
                        class="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                      >
                        <Icon src={sortAscending ? ChevronDown : ChevronUp} class="h-4 w-4" />
                      </span>
                    </button>
                    <div
                      class="invisible max-w-3xl text-center lg:max-w-7xl group-hover:visible group-focus:visible"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex inline-flex text-left">
                          <div class="flex">
                            <button
                              type="button"
                              class="inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                              aria-expanded="false"
                              on:click={toggleFilterOptions}
                            >
                              <Icon
                                src={Funnel}
                                class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              />
                              <span
                                class="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700"
                                >{filterOptions.length}</span
                              >
                            </button>
                          </div>
                          {#if filterOptionsVisible}
                            <div
                              class="absolute z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                            >
                              <form class="space-y-4">
                                {#each typeArray as type}
                                  <div class="flex items-center">
                                    <input
                                      id="filter-category-0"
                                      name="category[]"
                                      value={type}
                                      type="checkbox"
                                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      bind:group={filterOptions}
                                      on:change={filter}
                                    />
                                    <label
                                      for="filter-category-0"
                                      class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                                      >{type}</label
                                    >
                                  </div>
                                {/each}
                              </form>
                            </div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
