<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

This is a list of all cloud services

<ul>
  {#each data.services as service}
    <li>{service.name}</li>
  {/each}
</ul>
