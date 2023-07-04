<script lang="ts">
  import {
    AdjustmentsHorizontal,
    Check,
    Cloud,
    HandThumbUp,
    QueueList,
    User
  } from '@steeze-ui/heroicons';
  import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
  import type { PageData } from './$types';
  import type { AssessmentResult } from '$lib/api/assessment';

  export let data: PageData;

  interface Timeline {
    content: string;
    target: string;
    href: string;
    date: string;
    datetime: string;
    icon: IconSource;
    iconBackground: string;
  }

  function shortResourceId(id: string): string {
    let parts = id.split('/');

    return parts[parts.length - 1];
  }

  function buildTimeline(results: AssessmentResult[]): Timeline[] {
    const timeline = [];
    let groupedResult = new Map<string, AssessmentResult[]>();
    // First, group resources together
    // TODO: group according to interval
    for (const result of results) {
      let group = groupedResult.get(result.resourceId);
      if (group == undefined) {
        group = [];
        groupedResult.set(result.resourceId, group);
      }

      group.push(result);
    }

    for (let group of groupedResult.values()) {
      const date = new Date(group[0].timestamp);
      let formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

      timeline.push({
        content: `Assessed ${group.length} metrics for ${group[0].resourceTypes[0]}`,
        target: shortResourceId(group[0].resourceId),
        href: '/cloud/' + data.service.id + '/resources/' + group[0].resourceId,
        date: formatter.format(date),
        datetime: group[0].timestamp,
        icon: QueueList,
        iconBackground: 'bg-blue-500'
      });
    }

    timeline.push({
      content: 'Created cloud service',
      target: data.service.name,
      href: '#',
      date: '4 Jul',
      datetime: '2023-07-04',
      icon: Cloud,
      iconBackground: 'bg-gray-400'
    });

    return timeline;
  }

  $: timeline = buildTimeline(data.results);
</script>

<div class="flow-root">
  <ul class="-mb-8">
    {#each timeline as event, eventIdx}
      <li>
        <div class="relative pb-8">
          {#if eventIdx !== timeline.length - 1}
            <span
              class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
          {/if}
          <div class="relative flex space-x-3">
            <div>
              <span
                class="{event.iconBackground} h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
              >
                <Icon src={event.icon} class="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-500">
                  {event.content}
                  <a href={event.href} class="font-medium text-gray-900">{event.target}</a>
                </p>
              </div>
              <div class="whitespace-nowrap text-right text-sm text-gray-500">
                <time datetime={event.datetime}>{event.date}</time>
              </div>
            </div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>
