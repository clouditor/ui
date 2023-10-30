<script lang="ts">
  import DiscoveryGraph from '$lib/components/DiscoveryGraph.svelte';
  import type { NodeDefinition, EdgeDefinition, ElementDefinition } from 'cytoscape';
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import NodeDetail from '$lib/components/NodeDetail.svelte';

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

  $: selected = data.resources.find((r) => {
    return r.id == data.id;
  });

  function select(e: CustomEvent<ElementDefinition>) {
    data.id = e.detail.data.id ?? null;
    replaceHistory();
  }

  // a crude attempt to implement shallow routing until
  // https://github.com/sveltejs/kit/pull/9847 is merged
  function replaceHistory() {
    const url = new URL($page.url);
    if (data.id != null) {
      url.searchParams.set('id', data.id);
    }

    history.replaceState({}, '', url);
  }

  $: results = data.results.filter((r) => r.resourceId == data.id);
</script>

<div class="grid md:grid-cols-10">
  <div class="md:col-span-7">
    <DiscoveryGraph {nodes} {edges} on:select={select} initialSelect={data.id} />
  </div>
  <div class="md:col-span-3">
    {#if selected}
      <NodeDetail {selected} {results} metrics={data.metrics} />
    {/if}
  </div>
</div>
