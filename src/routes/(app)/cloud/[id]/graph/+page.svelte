<script lang="ts">
  import DiscoveryGraph from '$lib/components/DiscoveryGraph.svelte';
  import type { NodeDefinition, EdgeDefinition } from 'cytoscape';
  import type { PageData } from './$types';

  export let data: PageData;

  $: nodes = data.resources.map((n) => {
    return {
      data: {
        id: n.id,
        label: n.properties.name,
        type: n.resourceType.split(',').reduce((a, v) => ({ ...a, [v]: true }), {})
      }
    } satisfies NodeDefinition;
  });

  $: edges = data.edges.map((e) => {
    return {
      data: e
    } satisfies EdgeDefinition;
  });
</script>

<DiscoveryGraph {nodes} {edges} />
