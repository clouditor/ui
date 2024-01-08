<script lang="ts" context="module">
	export interface AssuranceLevelEvent {
		catalog: Catalog;
		assuranceLevel: string;
	}
</script>

<script lang="ts">
	import type { Catalog } from '$lib/api/orchestrator';
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
	import { createEventDispatcher } from 'svelte';
	import { createPopperActions } from 'svelte-popperjs';

	const dispatch = createEventDispatcher<{
		select: AssuranceLevelEvent;
	}>();

	interface $$Events {
		select: CustomEvent<AssuranceLevelEvent>;
	}

	const [popperRef, popperContent] = createPopperActions();
	const popperOptions = {
		placement: 'bottom-start',
		strategy: 'fixed',
		modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
	};

	function select(level: string) {
		dispatch('select', {
			catalog: catalog,
			assuranceLevel: level
		});
	}

	export let catalog: Catalog;
</script>

<Popover class="z-20">
	<PopoverButton as="div" use={[popperRef]} class="h-full w-full">
		<slot />
	</PopoverButton>

	<PopoverPanel use={[[popperContent, popperOptions]]}>
		<div
			class="w-screen max-w-sm flex-auto rounded-3xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5"
		>
			<div class="ml-4 mr-4 mt-4">
				<p class="font-medium text-gray-900">Please choose an assurance level</p>
				<p class="text-gray-500">
					The selected catalog requires the selection of an assurance level.
				</p>
			</div>

			{#each catalog.assuranceLevels as level}
				<div class="relative rounded-lg p-4 hover:bg-gray-50">
					<button on:click={() => select(level)} class="font-semibold text-gray-900">
						{level}
						<span class="absolute inset-0" />
					</button>
				</div>
			{/each}
		</div>
	</PopoverPanel>
</Popover>
