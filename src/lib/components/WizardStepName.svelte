<script lang="ts">
	import type { WizardData } from '$lib/components/Wizard.svelte';

	interface Props {
		data: WizardData;
	}

	let { data = $bindable() }: Props = $props();
</script>

<div
	class="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-clouditor"
>
	<label for="name" class="block text-xs font-medium text-gray-900">Name</label>
	<input
		type="text"
		name="name"
		id="name"
		class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
		placeholder="Enter a service name"
		bind:value={data.service.name}
	/>
</div>
