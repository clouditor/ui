<script>
  import { onMount, getContext } from 'svelte';

  export let edge;

  const { getCyInstance } = getContext('graphSharedState');
  const cy = getCyInstance();

  cy.add({
    group: 'edges',
    id: edge.id,
    data: { ...edge }
  });
</script>
