<script lang="ts">
  import type { EvaluationResult } from '$lib/api/evaluation';
  import { CheckCircle, ExclamationCircle, Minus, PauseCircle, Plus } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { PageData } from './$types';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
  import ControlComplianceItem from '$lib/components/ControlComplianceItem.svelte';

  export let data: PageData;

  interface TreeItemData {
    result: EvaluationResult;
    children: EvaluationResult[];
  }

  $: tree = buildTree(data.evaluations);

  /**
   * This function builds a tree-like structure out of the evaluation results,
   * with the first level comprising of the top level controls. The second level
   * consists of their sub controls.
   *
   * @param results
   */
  function buildTree(results: EvaluationResult[]): Map<string, TreeItemData> {
    const tree = new Map<string, TreeItemData>();

    for (const result of results) {
      // Top level control is at the first level of the tree
      if (result.parentControlId === undefined) {
        tree.set(result.controlId, {
          result: result,
          children: []
        });
      } else {
        // Look for parent tree item
        let parent = tree.get(result.parentControlId);
        if (parent === undefined) {
          continue;
        }

        parent.children.push(result);
      }
    }

    return tree;
  }
</script>

<div class="border-b border-gray-200 pb-5">
  <h3 class="text-base font-semibold leading-6 text-gray-900">{data.catalog.name}</h3>
  <p class="mt-2 max-w-4xl text-sm text-gray-500">
    {data.catalog.description}
  </p>
</div>

<dl class="space-y-6 divide-y divide-gray-900/10">
  {#each [...tree] as [_, item] (item.result.id)}
    <Disclosure as="div" class="pt-6" let:open>
      <dt>
        <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
          <ControlComplianceItem
            result={item.result}
            control={data.controls.get(item.result.controlId)}
          />
          <span class="ml-6 flex h-7 items-center">
            {#if !open}
              <Icon src={Plus} class="h-6 w-6" aria-hidden="true" />
            {:else}
              <Icon src={Minus} class="h-6 w-6" aria-hidden="true" />
            {/if}
          </span>
        </DisclosureButton>
        <DisclosurePanel as="dd" class="mt-2 pr-12">
          {#each item.children as result (result.controlId)}
            <div class="mt-6 ml-12">
              <ControlComplianceItem {result} control={data.controls.get(result.controlId)} />
            </div>
          {/each}
        </DisclosurePanel>
      </dt>
    </Disclosure>
  {/each}
</dl>
