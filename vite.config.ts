import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
	plugins: [sveltekit()],

	server: {
		proxy: {
			'/v1/auth/': 'http://localhost:8080',
			'/v1/discovery/': 'http://localhost:8080',
			'/v1experimental/discovery/': 'http://localhost:8080',
			'/v1/evidence_store/': 'http://localhost:8080',
			'/v1/assessment/': 'http://localhost:8080',
			'/v1/evaluation/': 'http://localhost:8080',
			'/v1/orchestrator/': 'http://localhost:8080'
		}
	}
};

export default {
	...config,
	resolve: {
		alias: {
			// anpassen, falls die Datei anders heißt
			'svelte-transition': path.resolve(
				'./node_modules/svelte-transition/dist/index.js'
			)
		}
	}
};