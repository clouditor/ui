<script lang="ts">
  import type { Catalog, CloudService } from '$lib/api/orchestrator';
  import { EllipsisVertical } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  export let service: CloudService;
  export let catalogs: Catalog[];

  interface FancyCatalog extends Catalog {
    initials: string;
    enabled: boolean;
    bgColor: string;
  }

  console.log(catalogs);

  // TODO: map catalogs to fancy catalogs
  const fancyCatalogs: FancyCatalog[] = [
    {
      id: 'EUCS',
      name: 'European Cybersecurity Certification Scheme for Cloud Services (EUCS)',
      description: 'European Cybersecurity Certification Scheme for Cloud Services',
      initials: 'EUCS',
      enabled: true,
      bgColor: 'bg-[#aa0512]',
      categories: [],
      controls: [],
      allInScope: true,
      assuranceLevels: ['basic', 'substential', 'high']
    },
    ...catalogs.map((c) => {
      return {
        ...c,
        enabled: false,
        initials: 'CD',
        bgColor: 'bg-clouditor'
      };
    }),
    {
      id: 'C5',
      name: 'BSI C5',
      description: 'The fancy BSI catalog',
      initials: 'C5',
      enabled: false,
      categories: [],
      controls: [],
      bgColor: 'bg-gray-500',
      allInScope: false,
      assuranceLevels: []
    },
    {
      id: 'CCM',
      name: 'CSA CCMv4',
      description: 'The CCM',
      initials: 'CCM',
      enabled: false,
      categories: [],
      controls: [],
      bgColor: 'bg-gray-500',
      allInScope: false,
      assuranceLevels: []
    }
  ];
</script>

<ul class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
  {#each fancyCatalogs as catalog}
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
          <p class="text-xs text-gray-500">
            {catalog.description}
          </p>
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
