<script lang="ts">
  import Button from './Button.svelte';
  import type { CloudService } from '$lib/api/orchestrator';
  import { createEventDispatcher } from 'svelte';

  export let service: CloudService;

  const dispatch = createEventDispatcher<{ save: { service: CloudService } }>();

  function save() {
    dispatch('save', { service });
  }
</script>

<Button on:click={save} disabled={service.name.length == 0}>Save</Button>
