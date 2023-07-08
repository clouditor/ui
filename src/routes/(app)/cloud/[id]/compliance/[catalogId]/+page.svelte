<script lang="ts">
  import type { EvaluationResult } from '$lib/api/evaluation';
  import { CheckCircle, ExclamationCircle, PauseCircle } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import type { PageData } from './$types';

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

{#each [...tree] as [_, item] (item.result.id)}
  <div class="flex mt-4">
    <div class="mr-4 flex-shrink-0">
      {#if item.result.status == 'EVALUATION_STATUS_COMPLIANT'}
        <Icon src={CheckCircle} theme="solid" class="w-8 h-8 text-green-800" />
      {:else if item.result.status == 'EVALUATION_STATUS_PENDING'}
        <Icon src={PauseCircle} theme="solid" class="w-8 h-8 text-gray-400" />
      {:else}
        <Icon src={ExclamationCircle} theme="solid" class="w-8 h-8 text-red-800" />
      {/if}
    </div>
    <div>
      <h4 class="text-base font-semibold">
        {item.result.controlId}: {data.controls.get(item.result.controlId)?.name}
      </h4>
      <p class="mt-1 text-sm text-gray-500">
        {item.result.id} is {item.result.status}
      </p>

      {#each item.children as result}
        <div class="mt-6 flex">
          <div class="mr-4 flex-shrink-0">
            {#if result.status == 'EVALUATION_STATUS_COMPLIANT'}
              <Icon src={CheckCircle} theme="solid" class="w-8 h-8 text-green-800" />
            {:else if result.status == 'EVALUATION_STATUS_PENDING'}
              <Icon src={PauseCircle} theme="solid" class="w-8 h-8 text-gray-400" />
            {:else}
              <Icon src={ExclamationCircle} theme="solid" class="w-8 h-8 text-red-800" />
            {/if}
          </div>
          <div>
            <h4 class="text-base font-semibold">
              {result.controlId}: {data.controls.get(result.controlId)?.name}
            </h4>
            <p class="mt-1 text-sm text-gray-500">
              {result.id} is {result.status}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/each}
