<script lang="ts">
	import { onMount, getContext } from 'svelte';

	let { edge } = $props();

	const { getCyInstance } = getContext('graphSharedState');
	const cy = getCyInstance();

	try {
		cy.add({
			group: 'edges',
			id: edge.id,
			data: { ...edge }
		});
	} catch (err) {
		console.log(err);
	}
</script>
