<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

A list of resources will magically appear here

<ul class="list-disc">
  {#each data.resources as resource}
    <li>{resource.properties.name}</li>
  {/each}
</ul>
