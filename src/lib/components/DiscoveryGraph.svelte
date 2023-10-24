<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import cytoscape from 'cytoscape';
  import dagre from 'cytoscape-dagre';

  let graph: HTMLElement;
  let cy: cytoscape.Core;

  setContext('graphSharedState', {
    getCyInstance: () => cy
  });

  onMount(() => {
    cytoscape.use(dagre);

    cy = cytoscape({
      container: graph
    });

    cy.on('add', () => {
      cy.makeLayout({
        name: 'dagre'
      }).run();
    });
  });
</script>

<div class="graph" bind:this={graph} style="width: 100%; min-height: 500px">
  {#if cy}
    <slot />
  {/if}
</div>
