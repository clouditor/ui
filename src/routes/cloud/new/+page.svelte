<script lang="ts">
  import Wizard from '$lib/components/Wizard.svelte';
  import { registerCloudService, type CloudService } from '$lib/api/orchestrator';
  import type { PageData } from './$types';
  import { goto, invalidate } from '$app/navigation';

  export let data: PageData;

  // Create a new cloud service
  let service = { id: '', name: '' } satisfies CloudService;

  async function save(event: CustomEvent<{ service: CloudService }>) {
    const service = await registerCloudService(event.detail.service);

    await invalidate((url) => url.pathname === '/v1/orchestrator/cloud_services');
    goto(`/cloud/${service.id}`);
  }
</script>

<Wizard current={data.step} {service} catalogs={data.catalogs} on:save={save} />
