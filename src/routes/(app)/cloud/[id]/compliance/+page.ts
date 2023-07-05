import { listTargetsOfEvaluation } from "$lib/api/orchestrator";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { listEvaluationResults } from "$lib/api/evaluation";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const targets = await listTargetsOfEvaluation(params.id, fetch)

  // Retrieve results (or in the future, just the statistics)
  // TODO: filter according to catalog
  const evaluations = listEvaluationResults({ cloudServiceId: params.id }, fetch)

  return {
    targets,
    evaluations
  }
}) satisfies PageLoad
