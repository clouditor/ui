// Import CSS files for tailwind and the Inter font
import 'inter-ui/inter.css';
import '../app.css';

import { listCloudServices } from '../lib/orchestrator';
import type { LayoutLoad } from './$types';
import { catchError } from '$lib/errors';

// Disable SSR because for now we are only a single-page application
export const ssr = false;

export const load = (async ({ fetch, url }) => {
    try {
        const services = await listCloudServices(fetch)

        return {
            services: services
        }
    } catch (err) {
        return catchError(err, url)
    }
}) satisfies LayoutLoad