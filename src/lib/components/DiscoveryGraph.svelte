<script lang="ts">
  import cytoscape, { type EdgeDefinition, type NodeDefinition } from 'cytoscape';
  import cola from 'cytoscape-cola';
  import dagre from 'cytoscape-dagre';
  import euler from 'cytoscape-euler';
  import { onMount, setContext } from 'svelte';

  export let edges: EdgeDefinition[];
  export let nodes: NodeDefinition[];
  let graph: HTMLElement;
  let cy: cytoscape.Core;

  setContext('graphSharedState', {
    getCyInstance: () => cy
  });

  const compute =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
</svg>`);
  const storage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>`);

  onMount(() => {
    cytoscape.use(euler);
    cytoscape.use(dagre);
    cytoscape.use(cola);

    cy = cytoscape({
      container: graph,
      layout: {
        name: 'cola'
      },
      style: [
        {
          selector: 'node',
          style: {
            content: `data(label)`
          }
        },
        {
          selector: 'node[type\\.Compute]',
          style: {
            shape: 'rectangle',
            'background-image': compute,
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.Storage]',
          style: {
            shape: 'rectangle',
            'background-image': storage,
            'background-fit': 'cover',
            'background-color': 'white'
          }
        }
      ],
      elements: {
        nodes: nodes,
        edges: edges
      }
    });
  });
</script>

<div class="graph" bind:this={graph} style="width: 100%; min-height: 600px" />
