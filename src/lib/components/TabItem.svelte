<script context="module" lang="ts">
  import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
  import { page } from '$app/stores';

  export interface TabItemData {
    name: string;
    icon: IconSource;
    href: string;
  }
</script>

<script lang="ts">
  /**
   * The data for this tab item.
   */
  export let item: TabItemData;

  export let mobile: boolean = false;

  // React to changes in the route and set the current status (true/false)
  $: current = $page.url.pathname.startsWith(item.href);
</script>

{#if mobile}
  <option selected={current}>{item.name}</option>
{:else}
  <a
    href={item.href}
    class="{current
      ? 'border-clouditor text-clouditor'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}
              group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
    aria-current={current ? 'page' : undefined}
  >
    <Icon
      src={item.icon}
      class="{current ? 'text-clouditor' : 'text-gray-400 group-hover:text-gray-500'}
                -ml-0.5 mr-2 h-5 w-5"
      aria-hidden="true"
    />
    <span>{item.name}</span>
  </a>
{/if}
