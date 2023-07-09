import { listEvaluationResults } from "$lib/api/evaluation";
import { getCatalog, listControls } from "$lib/api/orchestrator";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const catalog = getCatalog(params.catalogId, fetch)

  const evaluations = listEvaluationResults(
    {
      cloudServiceId: params.id,
      catalogId: params.catalogId
    }, true, fetch)

  const controls = new Map((await listControls(params.catalogId, undefined, fetch)).map(c => [c.id, c]))

  return {
    evaluations,
    catalog,
    controls
  }
}) satisfies PageLoad
