import { listTargetsOfEvaluation } from "$lib/api/orchestrator";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const targets = await listTargetsOfEvaluation(params.id, fetch)

  return {
    targets
  }
}) satisfies PageLoad
