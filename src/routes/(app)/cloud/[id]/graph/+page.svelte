<script lang="ts">
  import DiscoveryGraph from '$lib/components/DiscoveryGraph.svelte';
  import type { NodeDefinition, EdgeDefinition, ElementDefinition } from 'cytoscape';
  import type { PageData } from './$types';
  import { add_attribute } from 'svelte/internal';
  import { CheckCircle, XCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

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

  let node: NodeDefinition | undefined;
  function select(e: CustomEvent<ElementDefinition>) {
    console.log(e.detail);
    node = e.detail;
  }

  $: results = data.results.filter((r) => r.resourceId == node?.data.id);
</script>

<div class="grid md:grid-cols-5">
  <div class="md:col-span-4">
    <DiscoveryGraph {nodes} {edges} on:select={select} />
  </div>
  <div>
    {#if node}
      ID: {node.data.id}<br />
      Type: {Object.keys(node.data.type)}

      Assessment Results:
      <ul>
        {#each results as result}
          <li class="flex">
            {#if result.compliant}
              <Icon src={CheckCircle} theme="solid" class="h-5 w-5 mr-2 text-green-800" />
            {:else}
              <Icon src={XCircle} theme="solid" class="h-5 w-5 mr-2 text-red-800" />
            {/if}
            <a href={`/cloud/${data.service.id}/assessments/?filterIds=${result.id}`}>
              {result.metricId}
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      Nothing selected
    {/if}
  </div>
</div>
