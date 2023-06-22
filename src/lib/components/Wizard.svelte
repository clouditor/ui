<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Check } from '@steeze-ui/heroicons';
  import WizardStepName from './WizardStepName.svelte';
  import WizardStepInfo from './WizardStepInfo.svelte';
  import WizardStepSave from './WizardStepSave.svelte';
  import WizardStepCatalog from './WizardStepCatalog.svelte';
  import type { Catalog, CloudService } from '$lib/api/orchestrator';
  import type { SvelteComponent } from 'svelte';

  export let current: number = 0;
  export let service: CloudService;
  export let catalogs: Catalog[];

  interface $$Events {
    save: CustomEvent<{ service: CloudService }>;
  }

  const steps: {
    name: string;
    description: string;
    href: string;
    content: typeof SvelteComponent;
  }[] = [
    {
      name: 'Create cloud service',
      description: 'Please provide a name for the cloud service.',
      href: '?step=0',
      content: WizardStepName
    },
    {
      name: 'Service information',
      description: 'Optionally specify additional information about the cloud service.',
      href: '?step=1',
      content: WizardStepInfo
    },
    {
      name: 'Target of evaluation',
      description: 'Select relevant catalogs for the certification or audit.',
      href: '?step=2',
      content: WizardStepCatalog
    },
    {
      name: 'Confirm',
      description: 'Confirm creation of cloud service.',
      href: '?step=3',
      content: WizardStepSave
    }
  ];
</script>

<nav aria-label="Progress">
  <ol class="overflow-hidden">
    {#each steps as step, stepIdx}
      <li class="{stepIdx !== steps.length - 1 ? 'pb-10' : ''} relative">
        {#if stepIdx < current}
          {#if stepIdx !== steps.length - 1}
            <div
              class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-clouditor"
              aria-hidden="true"
            />
          {/if}
          <a href={step.href} class="group relative flex items-start">
            <span class="flex h-9 items-center">
              <span
                class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-clouditor group-hover:bg-clouditor-light"
              >
                <Icon src={Check} class="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </span>
            <span class="ml-4 flex min-w-0 flex-col">
              <span class="text-sm font-medium">{step.name}</span>
              <span class="text-sm text-gray-500">{step.description}</span>
            </span>
          </a>
        {:else if stepIdx == current}
          {#if stepIdx !== steps.length - 1}
            <div
              class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
              aria-hidden="true"
            />
          {/if}
          <span class="group relative flex items-start" aria-current="step">
            <span class="flex h-9 items-center" aria-hidden="true">
              <span
                class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-clouditor bg-white"
              >
                <span class="h-2.5 w-2.5 rounded-full bg-clouditor" />
              </span>
            </span>
            <span class="ml-4 flex min-w-0 flex-col">
              <span class="text-sm font-medium text-clouditor">{step.name}</span>
              <span class="text-sm text-gray-500">{step.description}</span>
            </span>
          </span>
          <div class="mt-5 ml-12 max-w-xl">
            {#if step.content == WizardStepCatalog}
              <svelte:component this={step.content} {service} {catalogs} on:save />
            {:else}
              <svelte:component this={step.content} {service} on:save />
            {/if}
          </div>
        {:else}
          {#if stepIdx !== steps.length - 1}
            <div
              class="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
              aria-hidden="true"
            />
          {/if}
          <a href={step.href} class="group relative flex items-start">
            <span class="flex h-9 items-center" aria-hidden="true">
              <span
                class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400"
              >
                <span class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
              </span>
            </span>
            <span class="ml-4 flex min-w-0 flex-col">
              <span class="text-sm font-medium text-gray-500">{step.name}</span>
              <span class="text-sm text-gray-500">{step.description}</span>
            </span>
          </a>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
