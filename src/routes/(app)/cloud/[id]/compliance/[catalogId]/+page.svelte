<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { createEvaluationResult, type EvaluationResult } from '$lib/api/evaluation';
  import type { Control } from '$lib/api/orchestrator';
  import type { AddEvaluationResultEvent } from '$lib/components/AddEvaluationResultDialog.svelte';
  import ControlComplianceItem from '$lib/components/ControlComplianceItem.svelte';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
  import { Minus, Plus } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { PageData } from './$types';

  export let data: PageData;

  interface TreeItemData {
    result: EvaluationResult;
    children: EvaluationResult[];
  }

  $: tree = buildTree(data.evaluations, data.filterStatus);

  /**
   * This function builds a tree-like structure out of the evaluation results,
   * with the first level comprising of the top level controls. The second level
   * consists of their sub controls.
   *
   * @param results
   */
  function buildTree(results: EvaluationResult[], status: string[]): Map<string, TreeItemData> {
    const tree = new Map<string, TreeItemData>();

    for (const result of results) {
      if (status !== null && !status.includes(result.status)) {
        continue;
      }

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

        if (status !== null && status.includes(result.status)) {
          parent.children.push(result);
        }
      }
    }

    return tree;
  }

  async function addResult(e: CustomEvent<AddEvaluationResultEvent>, control?: Control) {
    if (control == undefined) {
      return;
    }

    let result: EvaluationResult = {
      id: '',
      controlId: control.id,
      cloudServiceId: data.service.id,
      controlCategoryName: control.categoryName,
      controlCatalogId: data.catalog.id,
      parentControlId: control.parentControlId,
      status: e.detail.status,
      timestamp: new Date().toISOString(),
      failingAssessmentResultIds: [],
      comment: e.detail.comment,
      validUntil: e.detail.validUntil.toISOString()
    };

    result = await createEvaluationResult(result);
    invalidate((url) => url.pathname == '/v1/evaluation/results');
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
        <div class="flex w-full items-start justify-between text-left text-gray-900">
          <ControlComplianceItem
            result={item.result}
            control={data.controls.get(item.result.controlId)}
            on:addResult={(e) => addResult(e, data.controls.get(item.result.controlId))}
          />
          <DisclosureButton>
            <span class="ml-6 flex h-7 items-center">
              {#if !open}
                <Icon src={Plus} class="h-6 w-6" aria-hidden="true" />
              {:else}
                <Icon src={Minus} class="h-6 w-6" aria-hidden="true" />
              {/if}
            </span>
          </DisclosureButton>
        </div>
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
