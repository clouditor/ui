<script lang="ts">
	import DiscoveryGraph, { shouldCenter } from '$lib/components/DiscoveryGraph.svelte';
	import type { NodeDefinition, EdgeDefinition, ElementDefinition } from 'cytoscape';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import NodeDetail from '$lib/components/NodeDetail.svelte';
	import Button from '$lib/components/Button.svelte';
	import { ViewfinderCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let data: PageData;

	enum Status {
		WAITING,
		GOOD,
		BAD
	}

	$: nodes = data.resources.map((n) => {
		let status = Status.WAITING;

		// fetch assessment results
		let results = data.results.filter((r) => {
			return r.resourceId == n.id;
		});

		if (results.length >= 1) {
			if (results.filter((r) => r.compliant == false).length > 0) {
				status = Status.BAD;
			} else {
				status = Status.GOOD;
			}
		}

		return {
			data: {
				id: n.id,
				status: status,
				label: n.properties.name,
				type: n.resourceType.split(',').reduce((a, v) => ({ ...a, [v]: true }), {})
			}
		} satisfies NodeDefinition;
	});

	$: edges = data.edges.map((e) => {
		return {
			data: e
		} satisfies EdgeDefinition;
	});

	$: selected = data.resources.find((r) => {
		return r.id == data.id;
	});

	function select(e: CustomEvent<ElementDefinition | null>) {
		if (e.detail == null) {
			data.id = null;
		} else {
			data.id = e.detail.data.id ?? null;
		}

		replaceHistory();
	}

	// a crude attempt to implement shallow routing until
	// https://github.com/sveltejs/kit/pull/9847 is merged
	function replaceHistory() {
		const url = new URL($page.url);
		if (data.id != null) {
			url.searchParams.set('id', data.id);
		} else {
			url.searchParams.set('id', '');
		}

		history.replaceState({}, '', url);
	}

	$: results = data.results.filter((r) => r.resourceId == data.id);

	let overlay = false;
</script>

<div class="overflow-hidden rounded-xl border border-gray-200">
	<div class="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4">
		<div class="text-sm text-gray-500">
			This graph provides an overview over all discovered resources of the Cloud service,
			infrastructure as well as application source-code.
		</div>
		<div class="flex gap-x-1.5">
			<Button on:click={(e) => ($shouldCenter = true)}>
				<Icon src={ViewfinderCircle} class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<div class="relative left-4 z-10 mt-4 flex items-start">
		<div class="flex h-6 items-center">
			<input
				id="overlay"
				aria-describedby="overlay-description"
				name="overlay"
				type="checkbox"
				class="h-4 w-4 rounded border-gray-300 text-clouditor focus:ring-clouditor"
				bind:checked={overlay}
			/>
		</div>
		<div class="ml-3 text-sm leading-6">
			<label for="overlay" class="font-medium text-gray-900">Show overlay</label>
			<span id="overlay-description" class="text-gray-500">
				<span class="sr-only">Show overlay </span>
				of assessment results
			</span>
		</div>
	</div>

	<dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
		<DiscoveryGraph {nodes} {edges} on:select={select} initialSelect={data.id} {overlay} />
	</dl>
</div>

<div class="absolute right-8 top-64 z-20 max-w-md">
	{#if selected}
		<NodeDetail {selected} {results} metrics={data.metrics} tab={data.tab ?? 'results'} />
	{/if}
</div>
