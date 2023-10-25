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
      container: graph,
      style: [
        {
          selector: 'node',
          style: {
            width: '50',
            height: '50',
            'font-size': '18',
            'font-weight': 'bold',
            content: `data(label)`,
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '140',
            'background-color': 'gold',
            'border-color': 'orange',
            'border-width': '3',
            color: 'darkred'
          }
        }
      ]
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
