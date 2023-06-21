<script lang="ts" context="module">
  export let text: string;
</script>

<button
  type="button"
  class="rounded-md bg-clouditor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-clouditor-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clouditor"
  on:click
>
  <slot />
</button>
