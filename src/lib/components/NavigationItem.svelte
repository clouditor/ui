<script context="module" lang="ts">
  import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
  import { page } from '$app/stores';

  export interface NavigationItemData {
    name: string;
    href: string;
    icon?: IconSource;
    routes: string[];
    children?: NavigationItemData[];
    routeId?: string;
  }
</script>

<script lang="ts">
  export let item: NavigationItemData;
  export let current: boolean = false;
</script>

<li>
  <a
    href={item.href}
    class="{current
      ? 'bg-gray-50 text-clouditor'
      : 'text-gray-700 hover:text-clouditor hover:bg-gray-50'}
      group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
  >
    {#if item.icon}
      <Icon
        src={item.icon}
        class="{current ? 'text-clouditor' : 'text-gray-400 group-hover:text-clouditor'}
        h-6 w-6 shrink-0"
        aria-hidden="true"
      />
    {/if}
    {item.name}
  </a>
  <ul class="mt-1 px-2">
    {#each item.children ?? [] as subItem}
      <li>
        <a
          href={subItem.href}
          class="{current && $page.route.id == subItem.routeId
            ? 'bg-gray-50 text-clouditor'
            : 'text-gray-700 hover:text-clouditor hover:bg-gray-50'}
            block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
        >
          {subItem.name}
        </a>
      </li>
    {/each}
  </ul>
</li>
