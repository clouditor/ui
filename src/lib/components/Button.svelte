<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	// Since class is a reseverd keyword we cannot have a variable called "class"
	let clazz: string | undefined | null = null;

	// Explicitly export class so we can use $$restProps, which contains all the
	// passed down props *except* the exported ones. Otherwise we would override
	// the already specified class attribute in our button
	export { clazz as class };

	interface $$Props extends HTMLButtonAttributes {
		// We need to re-define our class here because we are explicitly exporting it
		class?: string | undefined | null;
	}
</script>

<button
	type="button"
	class="{$$props['disabled'] ? 'bg-gray-500' : 'bg-clouditor hover:bg-clouditor-light'}
    focus-visible:outline-clouditor rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid
    {clazz ?? ''}
    "
	on:click
	{...$$restProps}
>
	<slot />
</button>
