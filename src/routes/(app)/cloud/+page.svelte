<script lang="ts">
	import { invalidate } from '$app/navigation';
	import BelowHeader from '$lib/components/BelowHeader.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Make sure, that our list of cloud services is up-to-date
	invalidate((url) => url.pathname == '/v1/orchestrator/cloud_services');
</script>

<Header
	name="Cloud Services"
	description="{data.services.length} cloud service(s) configured"
	buttons={false}
	icon={false}
/>

<BelowHeader>
	This page provides an overview of all configured cloud services within Clouditor. Click on the
	name of a cloud service to display more information about it.
</BelowHeader>

<ul class="divide-y divide-gray-100">
	{#each data.services as service (service.id)}
		<li class="flex justify-between gap-x-6 py-5">
			<div class="flex gap-x-4">
				<img
					class="h-12 w-12 flex-none rounded-full bg-gray-50"
					src="https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
					alt=""
				/>
				<div class="min-w-0 flex-auto">
					<a href="/cloud/{service.id}/">
						<p class="text-sm font-semibold leading-6 text-gray-900">{service.name}</p>
					</a>
					<p class="mt-1 truncate text-sm leading-5 text-gray-500">
						{service.description}
					</p>
				</div>
			</div>
			<div class="hidden sm:flex sm:flex-col sm:items-end">
				<p class="text-sm leading-6 text-gray-900" />
				<p class="mt-1 text-xs leading-5 text-gray-500">
					Last updated <time datetime={service.updatedAt}>{service.updatedAt}</time>
				</p>
			</div>
		</li>
	{/each}
</ul>
