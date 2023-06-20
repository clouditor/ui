<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

This is a list of all cloud services

<ul>
  {#each data.services as service}
    <li><a href="/cloud/{service.id}">{service.name}</a></li>
  {/each}
</ul>
