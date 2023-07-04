import { listCloudServiceAssessmentResults } from "$lib/api/orchestrator";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const results = await listCloudServiceAssessmentResults(params.id, fetch)

  return {
    results: results
  }
}) satisfies PageLoad
