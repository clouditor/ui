import { invalidate } from "$app/navigation"
import { listCatalogs } from "$lib/api/orchestrator"
import type { PageLoad } from "../$types"

export const load = (async ({ fetch, url }) => {
    const step = Number.parseInt(url.searchParams.get("step") ?? "0")

    return {
        step
    }
}) satisfies PageLoad
