<script lang="ts">
	import { getContext } from 'svelte';

	let { node } = $props();

	const { getCyInstance } = getContext('graphSharedState');
	const cy = getCyInstance();

	cy.add({
		group: 'nodes',
		id: node.id,
		data: { ...node }
	});
</script>
