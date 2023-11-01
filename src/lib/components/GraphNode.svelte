<script>
  import { onMount, getContext } from 'svelte';

  export let node;

  const { getCyInstance } = getContext('graphSharedState');
  const cy = getCyInstance();

  cy.add({
    group: 'nodes',
    id: node.id,
    data: { ...node }
  });
</script>
