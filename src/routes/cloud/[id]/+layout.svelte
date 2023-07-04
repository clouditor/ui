<script lang="ts">
  import { goto } from '$app/navigation';
  import { removeCloudService } from '$lib/api/orchestrator';
  import Header from '$lib/components/Header.svelte';
  import Tabs from '$lib/components/Tabs.svelte';
  import { CheckBadge, Cog6Tooth, QueueList, Squares2x2, User } from '@steeze-ui/heroicons';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: tabs = [
    {
      name: 'Activity',
      href: '/cloud/' + data.service.id + '/activity',
      icon: User,
      current: false
    },
    {
      name: 'Discovered Resources',
      href: '/cloud/' + data.service.id + '/resources',
      icon: Squares2x2
    },
    {
      name: 'Assessment Results',
      href: '/cloud/' + data.service.id + '/assessments',
      icon: QueueList
    },
    {
      name: 'Compliance',
      href: '/cloud/' + data.service.id + '/compliance',
      icon: CheckBadge
    },
    {
      name: 'Settings',
      href: '/cloud/' + data.service.id + '/settings',
      icon: Cog6Tooth
    }
  ];

  async function remove(e: CustomEvent) {
    let really = confirm('Do you really want to delete this cloud service?');

    if (!really) {
      return;
    }

    await removeCloudService(data.service.id);
    goto('/cloud');
  }
</script>

<Header
  name={data.service.name}
  description={[
    data.service.description,
    data.statistics.discoveredResources + ' discovered resources'
  ]
    .filter((s) => s != '')
    .join('. ')}
  on:remove={remove}
/>

<Tabs items={tabs} />

<div class="pt-8">
  <slot />
</div>
