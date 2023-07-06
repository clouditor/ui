import { listEvaluationResults } from "$lib/api/evaluation";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const evaluations = listEvaluationResults(
    {
      cloudServiceId: params.id,
      catalogId: params.catalogId
    }, true, fetch)

  return {
    evaluations
  }
}) satisfies PageLoad
