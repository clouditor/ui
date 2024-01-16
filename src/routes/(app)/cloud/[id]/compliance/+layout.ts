import { listEvaluationResults } from '$lib/api/evaluation';
import { listTargetsOfEvaluation } from '$lib/api/orchestrator';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch, params, parent }) => {
	if (params.id == undefined) {
		throw error(405, 'Required parameter missing');
	}

	const targets = await listTargetsOfEvaluation(params.id, fetch);
	const data = await parent();

	const leftOverCatalogs = data.catalogs.filter((c) => {
		return targets.find((toe) => toe.catalogId == c.id) === undefined;
	});

	const enabledItems = data.catalogs.flatMap((catalog) => {
		const toe = targets.find((toe) => toe.catalogId == catalog.id);
		if (toe === undefined) {
			return [];
		}

		return [{ catalog, toe }];
	});

	// Retrieve the result of each "parent" (aka the top controls), because in the
	// overview we are only interested in that
	const topControlResults = await listEvaluationResults(
		{ cloudServiceId: params.id, parentsOnly: true },
		true,
		fetch
	);

	return {
		targets,
		/**
		 * This array contains all catalogs which do not have a target of evaluation
		 * and are possible ready to be selected for evaluation.
		 */
		leftOverCatalogs,
		/**
		 * This array contains all currently selected catalogs and their ToE.
		 */
		enabledItems,
		topControlResults
	};
}) satisfies LayoutLoad;
