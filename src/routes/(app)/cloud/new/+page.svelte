<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import { createTargetOfEvaluation, registerCloudService } from '$lib/api/orchestrator';
  import Wizard, { type WizardData } from '$lib/components/Wizard.svelte';
  import Header from '$lib/components/Header.svelte';
  import type { PageData } from './$types';
  import { startEvaluation } from '$lib/api/evaluation';

  export let data: PageData;

  // Create data for the wizard
  let wizard: WizardData;
  restart();

  // Fetch an up-to-date version of all catalogs because we need to select
  // them as part of the wizard
  invalidate((url) => url.pathname == '/v1/orchestrator/catalogs');

  async function save(event: CustomEvent<WizardData>) {
    let service = event.detail.service;

    // Make sure, that the tags are a map
    if (typeof service.tags == 'string') {
      let entries = service.tags.split(' ');
      service.tags = [];
      for (let entry of entries) {
        let pair = entry.split('=');
        if (pair.length == 2) {
          let tag = {};
          (tag as any)[pair[0]] = pair[1];
          service.tags.push({ tag: tag });
        }
      }
    }

    // First, register the cloud service
    service = await registerCloudService(service);

    // Afterwards, create the targets of evaluation
    let toes = await Promise.all(
      event.detail.toes.map((toe) => {
        // Set the correct cloud service id
        toe.cloudServiceId = service.id;
        return createTargetOfEvaluation(toe);
      })
    );

    // And also automatically start the evaluation
    for (let toe of toes) {
      startEvaluation(toe);
    }

    // Invalidate the list of cloud services
    await invalidate((url) => url.pathname === '/v1/orchestrator/cloud_services');
    goto(`/cloud/${service.id}`);
  }

  function restart() {
    wizard = {
      service: {
        id: '',
        name: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      catalogs: data.catalogs,
      toes: [],
      mode: 'create'
    };
  }

  function cancel() {
    let really = confirm('Do you really want to cancel?');
    if (!really) {
      return;
    }

    // Reset cloud service data and reset step to the beginning
    restart();

    // Reset step to the beginning
    goto('?step=0');
  }
</script>

<Header
  name={wizard.service.name}
  description={wizard.service.description ?? 'A new cloud service'}
  buttons={false}
/>

<div class="pt-4 pb-4 text-sm">
  You can use this page to create a new cloud service. This wizard will guide you through all the
  necessary steps. To move to the next step, either click on the name of the step or the circle next
  to it.
</div>
<Wizard current={data.step} bind:data={wizard} on:save={save} on:cancel={cancel} />
