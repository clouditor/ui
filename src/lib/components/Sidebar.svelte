<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Users, Calendar, Home, Folder, ChartPie, Cog6Tooth } from '@steeze-ui/heroicons';
  import type { CloudService } from '$lib/orchestrator';
  import type { NavigationItemData } from '$lib/components/NavigationItem.svelte';
  import { page } from '$app/stores';
  import NavigationItem from '$lib/components/NavigationItem.svelte';

  export let services: CloudService[];
  export let mobile: boolean = false;

  const navigation: NavigationItemData[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, routes: ['/'] },
    {
      name: 'Cloud Services',
      href: '/cloud',
      icon: Folder,
      routes: ['/cloud', '/cloud[...id]'],
      children: services.map((s) => {
        return {
          name: s.name,
          href: '/cloud/' + s.id,
          routes: ['cloud-detail'],
          routeId: s.id
        };
      })
    },
    { name: 'Metrics', href: '#', icon: Users, routes: ['/metrics'] },
    { name: 'Catalog Data', href: '#', icon: Calendar, routes: ['/catalogs'] },
    { name: 'Reports', href: '#', icon: ChartPie, routes: [] }
  ];
</script>

<div
  class="{mobile ? '' : 'border-r border-gray-200'}
    flex grow flex-col gap-y-5 overflow-y-auto bg-slate-50 px-6 pb-4"
>
  <div class="flex h-16 shrink-0 items-center border-b border-gray-200">
    <img
      class="h-12 w-auto"
      style="transform: scaleX(-1);"
      src="/img/logo-small2.png"
      alt="The Clouditor"
    />
    <div class="ml-4 flex flex-col">
      <div class="text-xl">Clouditor</div>
      <div class="text-sm text-gray-500">The Cloud Auditor</div>
    </div>
  </div>
  <nav class="flex flex-1 flex-col">
    <ul class="flex flex-1 flex-col gap-y-7">
      <li>
        <ul class="-mx-2 space-y-1">
          {#each navigation as item}
            <NavigationItem {item} current={($page.route.id ?? '/').startsWith(item.href)} />
          {/each}
        </ul>
      </li>

      <li class="mt-auto">
        <a
          href="/"
          class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-clouditor"
        >
          <Icon
            src={Cog6Tooth}
            class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-clouditor"
            aria-hidden="true"
          />
          Settings
        </a>
      </li>
    </ul>
  </nav>
</div>
