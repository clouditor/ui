import { listCloudServiceAssessmentResults } from '$lib/api/orchestrator';

import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, url }) => {
  if (params.id == undefined) {
    throw error(405, 'Required parameter missing');
  }

  const filterIds = url.searchParams.get('filterIds')?.split(',');
  const filterResourceId = url.searchParams.get('filterResourceId');
  const results = await listCloudServiceAssessmentResults(params.id, fetch);

  return {
    filterIds,
    filterResourceId,
    results
  };
}) satisfies PageLoad;
