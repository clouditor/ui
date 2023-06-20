<script lang="ts">
  import Button from '$lib/Button.svelte';
  import { redirectLogin } from '$lib/oauth';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

{#if data.error}
  {data.error.message}
{:else}
  <slot />
{/if}

<Button on:click={() => redirectLogin()}>Login</Button>
