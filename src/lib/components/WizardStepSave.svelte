<script lang="ts">
  import Button from './Button.svelte';
  import type { CloudService } from '$lib/api/orchestrator';
  import { createEventDispatcher } from 'svelte';

  export let service: CloudService;

  const dispatch = createEventDispatcher<{ save: { service: CloudService }; cancel: {} }>();

  function save() {
    dispatch('save', { service });
  }

  function cancel() {
    dispatch('cancel');
  }
</script>

<Button on:click={cancel} class="bg-red-800 hover:bg-red-700">Cancel</Button>
<Button on:click={save} disabled={service.name.length == 0}>Save</Button>
