// Import CSS files for tailwind and the Inter font
import 'inter-ui/inter.css';
import '../app.css';

import type { LayoutLoad } from './$types';
import { listCloudServices } from '$lib/orchestrator';

// Disable SSR because for now we are only a single-page application
export const ssr = false;

export const load = (async ({ fetch }) => {
    try {
        const services = await listCloudServices(fetch)
        return {
            services
        }
    } catch (ex) {
        // We have to be careful, that we do NOT throw errors inside the root layout
        // load function, otherwise the page won't load. Throwing errors in any of
        // the other places (including sub-layouts) seems to be fine.
        // See https://github.com/sveltejs/kit/issues/10201#issuecomment-1599711576
        return {
            services: []
        }
    }
}) satisfies LayoutLoad