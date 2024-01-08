import { listEvaluationResults } from '$lib/api/evaluation';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	if (params.id == undefined) {
		throw error(405, 'Required parameter missing');
	}

	// Retrieve the result of each "parent" (aka the top controls), because in the
	// overview we are only interested in that
	const topControlResults = listEvaluationResults(
		{ cloudServiceId: params.id, parentsOnly: true },
		true,
		fetch
	);

	return {
		topControlResults
	};
}) satisfies PageLoad;
