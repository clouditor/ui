<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { createAuditScope, registerCertificationTarget } from '$lib/api/orchestrator';
	import Wizard, { type WizardData } from '$lib/components/Wizard.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { PageData } from './$types';
	import { startEvaluation } from '$lib/api/evaluation';
	import BelowHeader from '$lib/components/BelowHeader.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Create data for the wizard
	let wizard: WizardData = $state();
	restart();

	// Fetch an up-to-date version of all catalogs because we need to select
	// them as part of the wizard
	invalidate((url) => url.pathname == '/v1/orchestrator/catalogs');

	async function save(event: CustomEvent<WizardData>) {
		let service = event.detail.service;

		// Make sure, that the tags are a map
		if (typeof service.metadata.labels == 'string') {
			let entries = service.metadata?.labels.split(' ');
			service.metadata.labels = [];
			for (let entry of entries) {
				let pair = entry.split('=');
				if (pair.length == 2) {
					let tag = {};
					(tag as any)[pair[0]] = pair[1];
					service.metadata.labels.push({ tag: tag });
				}
			}
		}

		// First, register the certification target
		service = await registerCertificationTarget(service);

		// Afterwards, create the targets of evaluation
		let auditScopes = await Promise.all(
			event.detail.auditScopes.map((auditScope) => {
				// Set the correct certification target id
				auditScope.certificationTargetId = service.id;
				return createAuditScope(auditScope);
			})
		);

		// And also automatically start the evaluation
		for (let auditScope of auditScopes) {
			startEvaluation(auditScope);
		}

		// Invalidate the list of evaluation targets
		await invalidate((url) => url.pathname === '/v1/orchestrator/certification_targets');
		goto(`/cloud/${service.id}`);
	}

	function restart() {
		wizard = {
			service: {
				id: '',
				name: '',
				metadata: {},
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			},
			catalogs: data.catalogs,
			auditScopes: [],
			mode: 'create'
		};
	}

	function cancel() {
		let really = confirm('Do you really want to cancel?');
		if (!really) {
			return;
		}

		// Reset certification target data and reset step to the beginning
		restart();

		// Reset step to the beginning
		goto('?step=0');
	}
</script>

<Header
	name={wizard.service.name}
	description={wizard.service.description ?? 'A new certification target'}
	buttons={false}
/>

<BelowHeader>
	You can use this page to create a new certification target. This wizard will guide you through all
	the necessary steps. To move to the next step, either click on the name of the step or the circle
	next to it.
</BelowHeader>

<Wizard current={data.step} bind:data={wizard} on:save={save} on:cancel={cancel} />
