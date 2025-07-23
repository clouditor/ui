import { getCertificationTarget } from '$lib/api/orchestrator';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { listResources } from '$lib/api/discovery';

export const load = (async ({ fetch, params }) => {
	if (params.id == undefined) {
		error(405, 'Required parameter missing');
	}

	const service = await getCertificationTarget(params.id, fetch);

	// TODO: replace with statistics endpoint to avoid slow loading of resource data
	const resources = await listResources(service.id, '', fetch);

	return {
		service: service,
		resources: resources,
		statistics: {
			discoveredResources: resources.length
		}
	};
}) satisfies LayoutLoad;
