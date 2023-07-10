<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import { NoSymbol, QueueList } from '@steeze-ui/heroicons';
  import { Check } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { AssessmentResult } from '$lib/api/assessment';
  import Button from '$lib/components/Button.svelte';

  export let data: PageData;

  let currentPage = 1;
  let rowsPerPage = 9;

  let filteredData: AssessmentResult[] = [];
  let totalPages = Math.ceil(filteredData.length / rowsPerPage);
  let currentData: AssessmentResult[] = [];

  onMount(() => {
    filterData();
    updateCurrentData();
  });

  function filterData() {
    // get query param ids and filter the data accordingly
    const urlParams = new URLSearchParams(window.location.search);
    const filterIdParam = urlParams.get('filterIds');
    let filterIds: String[] = [];

    if (filterIdParam) {
      filterIds = filterIdParam.split(',');
    } else {
      filterIds = [];
    }

    if (filterIds.length == 0) {
      filteredData = data.results;
    } else {
      filteredData = data.results.filter((assessment) => {
        return filterIds.includes(assessment.id);
      });
    }
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

  let showModalId: string | null = null;

  function showDetails(id: string) {
    showModalId = id;
  }

  function closeModal() {
    showModalId = null;
  }
</script>

{#if data.resources.length == 0}
  <StarterHint type="assessment results" icon={QueueList}>
    <span slot="component">Clouditor Assessment component</span>
  </StarterHint>
{:else}
  <main>
    <table class="min-w-full divide-y divide-gray-200 table-fixed">
      <thead class="bg-gray-50">
        <tr>
          {#if showModalId != null}
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
            >
              Details
            </th>
          {:else}
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
            >
              Compliance
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider uppercase w-50"
            >
              Time
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
            >
              Resource Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
            >
              Type
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-50"
            />
          {/if}
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each currentData as assessment}
          {#if showModalId == assessment.id}
            <tr>
              <div
                class=" inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 max-w-80"
              >
                <div class="bg-white rounded shadow-lg p-6">
                  <pre class="overflow-y-auto bg-gray-100 rounded p-4">
                    {JSON.stringify(assessment, null, 5)}
                    </pre>
                  <Button on:click={closeModal}>Close</Button>
                </div>
              </div>
            </tr>
          {:else}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                {#if assessment.compliant}
                  <Icon src={Check} class="h-5 w-5 mr-2 text-green-500" />
                {:else}
                  <Icon src={NoSymbol} class="h-5 w-5 mr-2 text-red-500" />
                {/if}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900"
                  >{new Date(assessment.timestamp).toLocaleString()}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900"
                  >{assessment.resourceId.split('/')[
                    assessment.resourceId.split('/').length - 1
                  ]}</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{assessment.resourceTypes[0]}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Button on:click={() => showDetails(assessment.id)}>More Details</Button>
              </td>
            </tr>
          {/if}
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
