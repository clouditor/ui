import { listCatalogs, listCloudServices, listMetrics } from '$lib/api/orchestrator';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
  const [services, catalogs, metrics] = await Promise.all([
    listCloudServices(fetch),
    listCatalogs(fetch),
    listMetrics(fetch)
  ])
  return {
    services,
    catalogs,
    metrics,
  }
}) satisfies LayoutLoad