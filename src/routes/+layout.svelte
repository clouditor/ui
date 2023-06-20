<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/Button.svelte';
  import { redirectLogin } from '$lib/oauth';
</script>

<slot />

<Button on:click={() => redirectLogin($page.url.href)}>Login</Button>
