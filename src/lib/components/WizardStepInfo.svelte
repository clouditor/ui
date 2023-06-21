<script lang="ts">
  import type { CloudService } from '$lib/api/orchestrator';

  export let service: CloudService;
</script>

<div class="isolate -space-y-px rounded-md shadow-sm">
  <div
    class="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-clouditor"
  >
    <label for="description" class="block text-xs font-medium text-gray-900">Description</label>
    <input
      type="text"
      name="description"
      id="description"
      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
      placeholder="Enter an optional description"
      bind:value={service.description}
    />
  </div>
  <div
    class="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-clouditor"
  >
    <label for="job-title" class="block text-xs font-medium text-gray-900">Tags</label>
    <input
      type="text"
      name="job-title"
      id="job-title"
      class="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
      placeholder="aws azure prod dev"
      bind:value={service.tags}
    />
  </div>
</div>
