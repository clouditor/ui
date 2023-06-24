// Import CSS files for tailwind and the Inter font
import 'inter-ui/inter.css';
import '../app.css';

import type { LayoutLoad } from './$types';
import { listCatalogs, listCloudServices, listMetrics } from '$lib/api/orchestrator';

// Disable SSR because for now we are only a single-page application
export const ssr = false;

export const load = (async ({ fetch }) => {
    try {
        // Fetch some often used-data (such as cloud services) and some static
        // data
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
    } catch (ex) {
        // We have to be careful, that we do NOT throw errors inside the root layout
        // load function, otherwise the page won't load. Throwing errors in any of
        // the other places (including sub-layouts) seems to be fine.
        // See https://github.com/sveltejs/kit/issues/10201#issuecomment-1599711576
        return {
            services: [],
            metrics: [],
            catalogs: []
        }
    }
}) satisfies LayoutLoad