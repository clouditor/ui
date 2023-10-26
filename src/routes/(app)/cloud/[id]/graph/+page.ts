import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { listGraphEdges } from '$lib/api/discovery';

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, 'Required parameter missing');
  }

  const edges = await listGraphEdges(fetch)

  return {
    edges
  };
}) satisfies PageLoad;
