import { listCatalogs } from "$lib/api/orchestrator"
import type { PageLoad } from "../$types"

export const load = (async ({ fetch, url }) => {
    const step = Number.parseInt(url.searchParams.get("step") ?? "0")

    // Fetch an up-to-date version of all catalogs because we need to select
    // them as part of the wizard
    const catalogs = listCatalogs(fetch)

    return {
        step,
        catalogs
    }
}) satisfies PageLoad
