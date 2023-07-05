<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';

  export let data: PageData;

  // Make sure, that our list of cloud services is up-to-date
  invalidate((url) => url.pathname == '/v1/orchestrator/cloud_services');
</script>

This is a list of all cloud services

<ul>
  {#each data.services as service}
    <li><a href="/cloud/{service.id}">{service.name}</a></li>
  {/each}
</ul>
