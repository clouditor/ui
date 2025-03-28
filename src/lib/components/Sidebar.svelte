<script lang="ts">
	import type { CertificationTarget } from '$lib/api/orchestrator';
	import NavigationItem from '$lib/components/NavigationItem.svelte';
	import {
		AdjustmentsHorizontal,
		ArchiveBox,
		ChartPie,
		Folder,
		Home,
		InformationCircle
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	interface Props {
		services: CertificationTarget[];
		mobile?: boolean;
	}

	let { services, mobile = false }: Props = $props();

	// Build navigation menu with dynamic components
	let navigation = $derived([
		{ name: 'Dashboard', href: '/dashboard', icon: Home, disabled: true },
		{
			name: 'Certification Targets',
			href: '/cloud',
			icon: Folder,
			children: [
				...services.map((s) => {
					return {
						name: s.name,
						href: '/cloud/' + s.id + '/',
						isSub: true
					};
				}),
				{
					name: 'New...',
					href: '/cloud/new',
					isSub: true,
					isNew: true
				}
			]
		},
		{ name: 'Metrics', href: '/metrics', icon: AdjustmentsHorizontal },
		{ name: 'Catalog Data', href: '/catalogs', icon: ArchiveBox, disabled: true },
		{ name: 'Reports', href: '/reports', icon: ChartPie, disabled: true }
	]);
</script>

<div
	class="{mobile ? '' : 'border-r border-gray-200'}
    flex grow flex-col gap-y-5 overflow-y-auto bg-slate-50 px-6 pb-4"
>
	<div class="flex h-16 shrink-0 items-center border-b border-gray-200">
		<img
			class="h-12 w-auto"
			style="transform: scaleX(-1);"
			src="/img/logo-small2.png"
			alt="The Clouditor"
		/>
		<div class="ml-4 flex flex-col">
			<div class="text-xl">Clouditor</div>
			<div class="text-sm text-gray-500">The Cloud Auditor</div>
		</div>
	</div>
	<nav class="flex flex-1 flex-col">
		<ul class="flex flex-1 flex-col gap-y-7">
			<li>
				<ul class="-mx-2 space-y-1">
					{#each navigation as item}
						<NavigationItem {item} />
					{/each}
				</ul>
			</li>

			<li class="mt-auto">
				<a
					href="/about"
					class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-clouditor"
				>
					<Icon
						src={InformationCircle}
						class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-clouditor"
						aria-hidden="true"
					/>
					About
				</a>
			</li>
		</ul>
	</nav>
</div>
