// Import CSS files for tailwind and the Inter font
import 'inter-ui/inter.css';
import '../app.css';

import type { LayoutLoad } from './$types';

// Disable SSR because for now we are only a single-page application
export const ssr = false;

export const load = (async () => {
    // We have to be careful, that we do NOT throw errors inside the root layout
    // load function, otherwise the page won't load. Throwing errors in any of
    // the other places (including sub-layouts) seems to be fine.
}) satisfies LayoutLoad