import { listCertificationTargetAssessmentResults } from '$lib/api/orchestrator';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import { listGraphEdges } from '$lib/api/discovery';

export const load = (async ({ fetch, params, url }) => {
	if (params.id == undefined) {
		throw error(405, 'Required parameter missing');
	}

	const results = await listCertificationTargetAssessmentResults(params.id, fetch);
	const edges = await listGraphEdges();
	const page = Number(url.searchParams.get('page'));

	return {
		results,
		edges,
		page
	};
}) satisfies PageLoad;
