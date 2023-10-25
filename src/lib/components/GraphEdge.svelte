<script>
  import { onMount, getContext } from 'svelte';

  export let edge;

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
