import { listResources } from "$lib/api/discovery";
import { getCloudService } from "$lib/api/orchestrator";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "../../$types";

export const load = (async ({ fetch, params }) => {
  if (params.id == undefined) {
    throw error(405, "Required parameter missing")
  }

  const service = await getCloudService(params.id, fetch);
  const resources = await listResources(service.id, "", fetch);

  return {
    service: service,
    resources: resources,
    statistics: {
      discoveredResources: resources.length,
    }
  }
}) satisfies LayoutLoad
