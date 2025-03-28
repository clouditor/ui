<script lang="ts">
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { createDialog, createMenu } from 'svelte-headlessui';
	import { Transition } from 'svelte-transition';
	import { Bars3, Bell, ChevronDown, MagnifyingGlass, XMark } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { LayoutProps } from '../$types';

	let { children }: LayoutProps = $props();

	const userNavigation = [
		{ name: 'Your profile', href: '#' },
		{ name: 'Sign out', href: '#' }
	];

	// We need to use $page here because of
	// https://github.com/sveltejs/kit/issues/627#issuecomment-1458539744 and
	// https://github.com/sveltejs/kit/issues/10201
	const sidebar = createDialog({ label: 'Sidebar' });
	const userMenu = createMenu({ label: 'User menu' });
</script>

<div>
	<Transition show={$sidebar.expanded}>
		<div class="relative z-50 lg:hidden">
			<Transition
				enter="transition-opacity ease-linear duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div class="fixed inset-0 bg-gray-900/80"></div>
			</Transition>

			<div class="fixed inset-0 flex">
				<Transition
					enter="transition ease-in-out duration-300 transform"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition ease-in-out duration-300 transform"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<div class="relative mr-16 flex h-full w-full max-w-xs flex-1">
						<Transition
							enter="ease-in-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in-out duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div class="absolute left-full top-0 flex w-16 justify-center pt-5">
								<button type="button" class="-m-2.5 p-2.5" onclick={sidebar.close}>
									<span class="sr-only">Close sidebar</span>
									<Icon src={XMark} class="h-6 w-6 text-white" aria-hidden="true" />
								</button>
							</div>
						</Transition>
						<Sidebar services={$page.data.services ?? []} mobile={true} />
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
	<!-- Static sidebar for desktop -->
	<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
		<Sidebar services={$page.data.services ?? []} />
	</div>
	<div class="lg:pl-72">
		<div
			class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
		>
			<button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" onclick={sidebar.open}>
				<span class="sr-only">Open sidebar</span>
				<Icon src={Bars3} class="h-6 w-6" aria-hidden="true" />
			</button>

			<!-- Separator -->
			<div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true"></div>

			<div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
				<form class="relative flex flex-1" action="#" method="GET">
					<label for="search-field" class="sr-only">Search</label>
					<Icon
						src={MagnifyingGlass}
						theme="solid"
						class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
						aria-hidden="true"
					/>
					<input
						id="search-field"
						class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
						placeholder="Search..."
						type="search"
						name="search"
					/>
				</form>
				<div class="flex items-center gap-x-4 lg:gap-x-6">
					<button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
						<span class="sr-only">View notifications</span>
						<Icon src={Bell} class="h-6 w-6" aria-hidden="true" />
					</button>

					<!-- Separator -->
					<div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true"></div>

					<!-- Profile dropdown -->
					<div class="relative">
						<button class="-m-1.5 flex items-center p-1.5" use:userMenu.button>
							<span class="sr-only">Open user menu</span>
							<img
								class="h-8 w-8 rounded-full bg-gray-50"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
							<span class="hidden lg:flex lg:items-center">
								<span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
									Bob | Security Manager</span
								>
								<Icon
									src={ChevronDown}
									theme="solid"
									class="ml-2 h-5 w-5 text-gray-400"
									aria-hidden="true"
								/>
							</span>
						</button>
						<Transition
							show={$userMenu.expanded}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<div
								class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
							>
								{#each userNavigation as item}
									{@const active = $userMenu.active === item.name}
									<div use:userMenu.item>
										<a
											href={item.href}
											class="{active ? 'bg-gray-50' : ''}
	                      block px-3 py-1 text-sm leading-6 text-gray-900">{item.name}</a
										>
									</div>
								{/each}
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</div>

		<main class="py-10">
			<div class="ml-auto mr-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
				<!-- Your content -->
				{@render children()}
			</div>
		</main>
	</div>
</div>
