<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { startEvaluation } from '$lib/api/evaluation';
	import { createTargetOfEvaluation } from '$lib/api/orchestrator';
	import type { WizardData } from '$lib/components/Wizard.svelte';
	import WizardStepCatalog from '$lib/components/WizardStepCatalog.svelte';
	import WizardStepSave from '$lib/components/WizardStepSave.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Create a new wizard data object to store the catalogs that will be enabled
	let wizard = {
		service: data.service,
		catalogs: data.leftOverCatalogs,
		toes: [],
		mode: 'edit'
	} satisfies WizardData;

	async function save(event: CustomEvent<WizardData>) {
		// Afterwards, create the targets of evaluation
		let toes = await Promise.all(
			event.detail.toes.map((toe) => {
				return createTargetOfEvaluation(toe);
			})
		);

		await Promise.all(toes.map((toe) => startEvaluation(toe)));
		await invalidate(
			(url) => url.pathname === `/v1/orchestrator/cloud_services/${data.service.id}/toes`
		);
		goto('../');
	}
</script>

<WizardStepCatalog bind:data={wizard} />
<div class="mt-4" />
<WizardStepSave bind:data={wizard} on:cancel={() => goto('../')} on:save={save} />
