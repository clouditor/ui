<script lang="ts">
  import StarterHint from '$lib/components/StarterHint.svelte';
  import { CheckCircle, NoSymbol, QueueList, XCircle } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { AssessmentResult } from '$lib/api/assessment';
  import Button from '$lib/components/Button.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import AssessmentIcon from '$lib/components/AssessmentIcon.svelte';
  import { Result } from 'postcss';

  export let data: PageData;

  $: currentPage = data.page ? data.page : 1;
  let rowsPerPage = 9;
  $: totalPages = Math.ceil(filteredData.length / rowsPerPage);

  $: filteredData =
    data.filterIds === undefined &&
    (data.filterResourceId === undefined || data.filterResourceId === null)
      ? data.results
      : data.results.filter((result) => {
          return (
            data.filterIds === undefined ||
            (data.filterIds?.includes(result.id) &&
              (data.filterResourceId === null ||
                data.filterResourceId === undefined ||
                result.resourceId.split('/')[result.resourceId.split('/').length - 1] ===
                  data.filterResourceId))
          );
        });

  $: currentData = paginate(filteredData, currentPage);

  function paginate(results: AssessmentResult[], page: number) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return results.slice(startIndex, endIndex);
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePageQuery(currentPage);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      updatePageQuery(currentPage);
    }
  }

  function updatePageQuery(currentPage: number) {
    $page.url.searchParams.set('page', String(currentPage));
    goto(`?${$page.url.searchParams.toString()}`);
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
    <div class="-mx-4 -my-2 overflow-x-clip sm:-mx-6 lg:-mx-8">
      <div class="inline-block py-2 align-middle sm:px-6 lg:px-8 min-w-full">
        <table class="min-w-full divide-y divide-gray-200 table-fixed">
          <thead class="bg-gray-50">
            <tr>
              {#if showModalId != null}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                >
                  Details
                </th>
              {:else}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-1/12"
                >
                  Compliance
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-1/12"
                >
                  Time
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-3/12"
                >
                  Metric
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-3/12"
                >
                  Resource Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-2/12"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-1/12"
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
                    <AssessmentIcon result={assessment} />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900"
                      >{new Date(assessment.timestamp).toLocaleString()}</span
                    >
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate max-w-0">
                    <span class="text-sm text-gray-900">
                      <a href="/metrics/{data.service.id}/{assessment.metricId}">
                        {assessment.metricId}
                      </a>
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap truncate max-w-xs">
                    <span class="text-sm text-gray-900">
                      <a href={`/cloud/${data.service.id}/graph/?id=${assessment.resourceId}`}>
                        {assessment.resourceId.split('/')[
                          assessment.resourceId.split('/').length - 1
                        ]}
                      </a>
                    </span>
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
            class={'px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200' +
              (currentPage === 1 ? ' cursor-not-allowed opacity-50' : '')}
            on:click={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span class="mx-2 text-gray-500">{currentPage} / {totalPages}</span>
          <button
            class={'px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:bg-gray-200' +
              (currentPage === totalPages ? ' cursor-not-allowed opacity-50' : '')}
            on:click={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </main>
{/if}
