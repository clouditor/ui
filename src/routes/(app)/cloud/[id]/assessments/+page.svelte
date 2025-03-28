<!-- @migration-task Error while migrating Svelte code: `<div>` cannot be a child of `<tr>`. `<tr>` only allows these children: `<th>`, `<td>`, `<style>`, `<script>`, `<template>`. The browser will 'repair' the HTML (by moving, removing, or inserting elements) which breaks Svelte's assumptions about the structure of your components.
https://svelte.dev/e/node_invalid_placement -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { AssessmentResult } from '$lib/api/assessment';
	import AssessmentIcon from '$lib/components/AssessmentIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import StarterHint from '$lib/components/StarterHint.svelte';
	import { QueueList } from '@steeze-ui/heroicons';
	import type { PageData } from './$types';

	export let data: PageData;

	$: currentPage = data.page ? data.page : 1;
	let rowsPerPage = 9;
	$: totalPages = Math.ceil(filteredData.length / rowsPerPage);

	$: filteredData = filter(data.results, data.filterIds, data.filterResourceId);
	$: currentData = paginate(filteredData, currentPage);

	function filter(
		results: AssessmentResult[],
		ids: string[],
		resourceId: string | null
	): AssessmentResult[] {
		if (ids.length > 0) {
			results = results.filter((r) => ids.includes(r.id));
		}

		if (resourceId !== null) {
			results = results.filter((r) => r.resourceId == resourceId);
		}

		return results;
	}

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
	{#snippet hint()}
		<span slot="component">Clouditor Assessment component</span>
	{/snippet}
	<StarterHint type="assessment results" icon={QueueList} component={hint}></StarterHint>
{:else}
	<main>
		<div class="-mx-4 -my-2 overflow-x-clip sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<table class="min-w-full table-fixed divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							{#if showModalId != null}
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
									Details
								</th>
							{:else}
								<th
									scope="col"
									class="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
									Compliance
								</th>
								<th
									scope="col"
									class="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
									Time
								</th>
								<th
									scope="col"
									class="w-3/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
									Metric
								</th>
								<th
									scope="col"
									class="w-3/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
									Resource Name
								</th>
								<th
									scope="col"
									class="w-2/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
									Type
								</th>
								<th
									scope="col"
									class="w-1/12 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
								>
								</th>
							{/if}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each currentData as assessment}
							<tr>
								<td class="whitespace-nowrap px-6 py-4">
									<AssessmentIcon result={assessment} />
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class="text-sm text-gray-900"
										>{new Date(assessment.timestamp).toLocaleString()}</span
									>
								</td>
								<td class="max-w-0 truncate whitespace-nowrap px-6 py-4">
									<span class="text-sm text-gray-900">
										<a href="/metrics/{data.service.id}/{assessment.metricId}">
											{assessment.metricId}
										</a>
									</span>
								</td>
								<td class="max-w-xs truncate whitespace-nowrap px-6 py-4">
									<span class="text-sm text-gray-900">
										<a href={`/cloud/${data.service.id}/graph/?id=${assessment.resourceId}`}>
											{assessment.resourceId.split('/')[
												assessment.resourceId.split('/').length - 1
											]}
										</a>
									</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<span class="text-sm text-gray-900">{assessment.resourceTypes[0]}</span>
								</td>
								<td class="whitespace-nowrap px-6 py-4">
									<Button on:click={() => showDetails(assessment.id)}>More Details</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="mt-4">
					<button
						class={'rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none' +
							(currentPage === 1 ? ' cursor-not-allowed opacity-50' : '')}
						on:click={prevPage}
						disabled={currentPage === 1}
					>
						Previous
					</button>
					<span class="mx-2 text-gray-500">{currentPage} / {totalPages}</span>
					<button
						class={'rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none' +
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
