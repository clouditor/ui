import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	if (params.id == undefined) {
		throw error(405, 'Required parameter missing');
	}

	// In case someone access the "root" of a certification target, we redirect him to
	// the activity view
	throw redirect(301, '/cloud/' + params.id + '/activity');
}) satisfies PageLoad;
