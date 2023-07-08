import { listControls, listTargetsOfEvaluation } from "$lib/api/orchestrator";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch, params, parent }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const targets = await listTargetsOfEvaluation(params.id, fetch)

  const data = await parent()
  const leftOverCatalogs = data.catalogs.filter((c) => {
    return targets.find((toe) => toe.catalogId == c.id) === undefined
  })

  return {
    targets,
    /** 
     * This array contains all catalogs which do not have a target of evaluation
     * and are possible ready to be selected for evaluation.
      */
    leftOverCatalogs,
  }
}) satisfies LayoutLoad
