<script lang="ts">
  import type { CloudService } from '$lib/api/orchestrator';
  import { EllipsisVertical } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let service: CloudService;

  const catalogs = [
    {
      name: 'European Cybersecurity Certification Scheme for Cloud Services (EUCS)',
      initials: 'EUCS',
      href: '#',
      controls: 450,
      enabled: true,
      assuranceLevel: 'High',
      bgColor: 'bg-[#aa0512]'
    },
    {
      name: 'Clouditor Demo Catalog',
      initials: 'CD',
      href: '#',
      controls: 10,
      enabled: true,
      bgColor: 'bg-clouditor'
    },
    {
      name: 'BSI C5',
      initials: 'C5',
      href: '#',
      controls: 0,
      bgColor: 'bg-gray-500'
    },
    {
      name: 'CSA CCMv4',
      initials: 'CCM',
      href: '#',
      controls: 0,
      bgColor: 'bg-gray-500'
    }
  ];
</script>

<ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
  {#each catalogs as catalog}
    <li class="col-span-1 flex rounded-md shadow-sm">
      <div
        class="{catalog.bgColor} flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
      >
        {catalog.initials}
      </div>
      <div
        class="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white"
      >
        <div class="flex-1 truncate px-4 py-2 text-sm">
          <a href="#" class="font-medium text-gray-900 hover:text-gray-600">
            {catalog.name}
          </a>
          {#if catalog.assuranceLevel}
            <p class="text-xs text-gray-500">
              Assurance Level <b>{catalog.assuranceLevel}</b>
            </p>
          {/if}
        </div>
        <div class="flex-shrink-0 pr-2">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span class="sr-only">Open options</span>
            <Icon src={EllipsisVertical} class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  {/each}
</ul>
