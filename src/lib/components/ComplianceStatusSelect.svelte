<script lang="ts">
  import type { ComplianceStatus } from '$lib/api/evaluation';
  import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    Transition
  } from '@rgossiaux/svelte-headlessui';
  import { Check, ChevronDown } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  const publishingOptions = [
    {
      name: 'Compliant',
      description: 'This job posting can be viewed by anyone who has the link.',
      bgColor: 'bg-green-800',
      hoverColor: 'hover:bg-green-900 focus:ring-green-800',
      divideColor: 'divide-green-900',
      status: 'EVALUATION_STATUS_COMPLIANT_MANUALLY'
    },
    {
      name: 'Non-Compliant',
      description: 'This job posting will no longer be publicly accessible.',
      bgColor: 'bg-red-800',
      hoverColor: 'hover:bg-red-900 focus:ring-red-900',
      divideColor: 'divide-red-900',
      status: 'EVALUATION_STATUS_NOT_COMPLIANT_MANUALLY'
    }
  ];

  export let status: ComplianceStatus = 'EVALUATION_STATUS_COMPLIANT_MANUALLY';

  $: selected =
    status == 'EVALUATION_STATUS_COMPLIANT_MANUALLY' ? publishingOptions[0] : publishingOptions[1];
</script>

<Listbox bind:value={status}>
  <ListboxLabel class="sr-only">Change published status</ListboxLabel>
  <div class="relative">
    <div class="inline-flex divide-x {selected.divideColor} rounded-md shadow-sm">
      <div
        class="inline-flex items-center gap-x-1.5 rounded-l-md px-3 py-2 text-white shadow-sm {selected.bgColor}"
      >
        <Icon src={Check} class="-ml-0.5 h-5 w-5" aria-hidden="true" />
        <p class="text-sm font-semibold">{selected.name}</p>
      </div>
      <ListboxButton
        class="inline-flex items-center rounded-l-none rounded-r-md {selected.bgColor} {selected.hoverColor} p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        <span class="sr-only">Change published status</span>
        <Icon src={ChevronDown} class="h-5 w-5 text-white" aria-hidden="true" />
      </ListboxButton>
    </div>

    <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
      <ListboxOptions
        class="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        {#each publishingOptions as option (option.name)}
          <ListboxOption value={option.status} let:active let:selected>
            <li
              class="{active
                ? 'bg-clouditor text-white'
                : 'text-gray-900'} cursor-default select-none p-4 text-sm"
            >
              <div class="flex flex-col">
                <div class="flex justify-between">
                  <p class={selected ? 'font-semibold' : 'font-normal'}>{option.name}</p>
                  {#if selected}
                    <span class="active ? 'text-white' : 'text-clouditor'">
                      <Icon src={Check} class="h-5 w-5" aria-hidden="true" />
                    </span>
                  {/if}
                </div>
                <p class="{active ? 'text-indigo-200' : 'text-gray-500'} mt-2">
                  {option.description}
                </p>
              </div>
            </li>
          </ListboxOption>
        {/each}
      </ListboxOptions>
    </Transition>
  </div>
</Listbox>
