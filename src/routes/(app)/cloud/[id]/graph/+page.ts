import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { listGraphEdges } from '$lib/api/discovery';
import { listAssessmentResults } from '$lib/api/orchestrator';

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, 'Required parameter missing');
  }

  const results = listAssessmentResults(fetch, true)
  const edges = await listGraphEdges(fetch)

  return {
    results,
    edges
  };
}) satisfies PageLoad;
