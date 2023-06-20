import { listCloudServices } from "$lib/orchestrator"
import type { PageLoad } from "./$types"

export const load = (async ({ fetch, url }) => {
    //await listCloudServices(fetch)
}) satisfies PageLoad
