<script lang="ts" context="module">
  export let text: string;
</script>

<script lang="ts">
  interface $$Props extends Partial<HTMLButtonElement> {}
</script>

<button
  type="button"
  class="{$$props['disabled'] ? 'bg-gray-500' : 'bg-clouditor hover:bg-clouditor-light'}
    rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clouditor"
  on:click
  {...$$restProps}
>
  <slot />
</button>
