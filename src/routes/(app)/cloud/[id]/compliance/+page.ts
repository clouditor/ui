import { listEvaluationResults } from "$lib/api/evaluation";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  // Retrieve results (or in the future, just the statistics)
  // TODO: filter according to catalog
  const evaluations = listEvaluationResults({ cloudServiceId: params.id }, fetch)

  return {
    evaluations
  }
}) satisfies PageLoad
