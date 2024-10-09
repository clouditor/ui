import { listCatalogs, listCertificationTargets, listMetrics } from '$lib/api/orchestrator';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
	const [services, catalogs, metricList] = await Promise.all([
		listCertificationTargets(fetch),
		listCatalogs(fetch),
		listMetrics(fetch)
	]);

	const metrics = new Map(metricList.map((m) => [m.id, m]));

	return {
		services,
		catalogs,
		metrics
	};
}) satisfies LayoutLoad;
