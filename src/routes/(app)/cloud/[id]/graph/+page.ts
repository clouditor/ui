import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { listGraphEdges } from '$lib/api/discovery';
import { listAssessmentResults } from '$lib/api/orchestrator';

export const load = (async ({ fetch, params, url }) => {
	if (params.id == undefined) {
		error(405, 'Required parameter missing');
	}

	const results = await listAssessmentResults(fetch, true);
	const edges = await listGraphEdges(fetch);
	const id = url.searchParams.get('id');
	const tab = url.searchParams.get('tab');

	return {
		results,
		edges,
		id,
		tab
	};
}) satisfies PageLoad;
