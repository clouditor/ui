<script lang="ts">
  import cytoscape, { type EdgeDefinition, type NodeDefinition } from 'cytoscape';
  import cola from 'cytoscape-cola';
  import dagre from 'cytoscape-dagre';
  import euler from 'cytoscape-euler';
  import { createEventDispatcher, onMount, setContext } from 'svelte';

  export let edges: EdgeDefinition[];
  export let nodes: NodeDefinition[];
  export let initialSelect: string | null;

  let graph: HTMLElement;
  let cy: cytoscape.Core;

  const dispatch = createEventDispatcher<{
    select: NodeDefinition | null;
  }>();

  interface $$Events {
    select: CustomEvent<NodeDefinition | null>;
  }

  setContext('graphSharedState', {
    getCyInstance: () => cy
  });

  const compute = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
</svg>`;
  const storage = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
</svg>`;
  const network = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
</svg>`;
  const group = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
</svg>`;
  const server = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
</svg>`;
  const account = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
</svg>`;

  onMount(() => {
    cytoscape.use(euler);
    cytoscape.use(dagre);
    cytoscape.use(cola);

    cy = cytoscape({
      container: graph,
      layout: {
        name: 'cola',
        infinite: true
      },
      style: [
        {
          selector: 'node',
          style: {
            content: `data(label)`,
            'font-family': `"Inter var", sans-serif`,
            'font-size': '8px',
            'text-background-color': 'white',
            'text-background-shape': 'rectangle',
            'text-background-opacity': 1
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#007FC3'
          }
        },
        {
          selector: 'node[type\\.Compute]',
          style: {
            shape: 'rectangle',
            'background-image': svg(compute, 'black'),
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.Compute]:selected',
          style: {
            shape: 'rectangle',
            'background-image': svg(compute, '#007FC3')
          }
        },
        {
          selector: 'node[type\\.Storage]',
          style: {
            shape: 'rectangle',
            'background-image': svg(storage, 'black'),
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.Storage]:selected',
          style: {
            shape: 'rectangle',
            'background-image': svg(storage, '#007FC3')
          }
        },
        {
          selector: 'node[type\\.Networking]',
          style: {
            shape: 'rectangle',
            'background-image': svg(network, 'black'),
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.Networking]:selected',
          style: {
            shape: 'rectangle',
            'background-image': svg(network, '#007FC3')
          }
        },
        {
          selector: 'node[type\\.NetworkService]',
          style: {
            shape: 'rectangle',
            'background-image': svg(server, 'black'),
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.NetworkService]:selected',
          style: {
            shape: 'rectangle',
            'background-image': svg(server, '#007FC3')
          }
        },
        {
          selector: 'node[type\\.ResourceGroup]',
          style: {
            shape: 'rectangle',
            'background-image': svg(group, 'black'),
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.ResourceGroup]:selected',
          style: {
            shape: 'rectangle',
            'background-image': svg(group, '#007FC3')
          }
        },
        {
          selector: 'node[type\\.Account]',
          style: {
            shape: 'rectangle',
            'background-image': svg(account, 'black'),
            'background-fit': 'cover',
            'background-color': 'white'
          }
        },
        {
          selector: 'node[type\\.Account]:selected',
          style: {
            shape: 'rectangle',
            'background-image': svg(account, '#007FC3')
          }
        }
      ],
      elements: {
        nodes: nodes,
        edges: edges
      }
    });

    if (initialSelect) {
      cy.nodes(`node[id="${initialSelect}"]`).select();
    }

    cy.on('tap', function (e) {
      var target = e.target;

      if (target === cy) {
        dispatch('select', null);
      } else {
        dispatch('select', { id: target.id(), data: target.data() });
      }
    });
  });

  function svg(raw: string, color: string): string {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(raw.replace('currentColor', color));
  }
</script>

<div class="graph" bind:this={graph} style="width: 100%; min-height: 600px" />
