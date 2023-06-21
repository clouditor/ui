import { listCloudServices } from "$lib/api/orchestrator"
import type { PageLoad } from "./$types"

export const load = (async ({ fetch }) => {
    const services = await listCloudServices(fetch)

    return {
        services
    }
}) satisfies PageLoad
