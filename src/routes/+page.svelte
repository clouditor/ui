<script lang="ts">
  export let data: import('./$types').LayoutData;
</script>

<h1 class="text-3xl font-bold underline">Hello world!</h1>

<p class="text-base">Very awesome stuff here</p>

<pre>
{JSON.stringify(data.services)}
</pre>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
