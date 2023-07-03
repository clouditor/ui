<script lang="ts">
  import Tabs from '$lib/components/Tabs.svelte';
  import {
    BuildingOffice,
    Cog6Tooth,
    PresentationChartLine,
    User,
    Users
  } from '@steeze-ui/heroicons';
  import type { PageData } from './$types';
  import Button from '$lib/components/Button.svelte';
  import { removeCloudService } from '$lib/api/orchestrator';
  import { goto } from '$app/navigation';

  export let data: PageData;

  $: tabs = [
    { name: 'Overview', href: '/cloud/' + data.service.id, icon: User, current: false },
    {
      name: 'Discovered Resources',
      href: '/cloud/' + data.service.id + '/resources',
      icon: BuildingOffice
    },
    {
      name: 'Assesment Results',
      href: '/cloud/' + data.service.id + '/assessments',
      icon: Users
    },
    {
      name: 'Compliance',
      href: '/cloud/' + data.service.id + '/compliance',
      icon: PresentationChartLine
    },
    {
      name: 'Settings',
      href: '/cloud/' + data.service.id + '/settings',
      icon: Cog6Tooth
    }
  ];

  async function remove() {
    let really = confirm('Do you really want to delete this cloud service?');

    if (!really) {
      return;
    }

    await removeCloudService(data.service.id);
    goto('/cloud');
  }
</script>

<div class="md:flex md:items-center md:justify-between md:space-x-5">
  <div class="flex items-start space-x-5">
    <div class="flex-shrink-0">
      <div class="relative">
        <img
          class="h-16 w-16 rounded-full"
          src="https://images.unsplash.com/photo-1499346030926-9a72daac6c63?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt=""
        />
        <span class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
      </div>
    </div>
    <!--
      Use vertical padding to simulate center alignment when both lines of text are one line,
      but preserve the same layout if the text wraps without making the image jump around.
    -->
    <div class="pt-1.5">
      <h1 class="text-2xl font-bold text-gray-900">{data.service.name}</h1>
      <p class="text-sm font-medium text-gray-500">
        {data.statistics.discoveredResources} discovered resources
      </p>
    </div>
  </div>
  <div
    class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3"
  >
    <Button on:click={remove} class="bg-red-800 hover:bg-red-700">Delete</Button>
    <Button>Save</Button>
  </div>
</div>

<Tabs items={tabs} />

<div class="pt-4">
  <slot />
</div>
