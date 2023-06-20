import { listCloudServices } from "$lib/orchestrator"
import type { PageLoad } from "./$types"

export const load = (async ({ fetch }) => {
    const services = await listCloudServices(fetch)

    return {
        services
    }
}) satisfies PageLoad
