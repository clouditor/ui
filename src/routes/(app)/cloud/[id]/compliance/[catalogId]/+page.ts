import { listEvaluationResults } from "$lib/api/evaluation";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { listControls } from "$lib/api/orchestrator";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const evaluations = listEvaluationResults(
    {
      cloudServiceId: params.id,
      catalogId: params.catalogId
    }, true, fetch)

  const controls = new Map((await listControls(params.catalogId, undefined, fetch)).map(c => [c.id, c]))

  return {
    evaluations,
    controls
  }
}) satisfies PageLoad
