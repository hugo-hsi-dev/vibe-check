<script lang="ts">
	import type { Component } from 'svelte';
	import type { User } from '$lib/types';

	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { LayoutDashboard, type IconProps, ChartSpline, BookHeart } from '@lucide/svelte';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let { user }: { user: User | null } = $props();

	type SubMenu = {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		Icon: Component<IconProps, {}, ''>;
		description: string;
		title: string;
		href: string;
	};

	let featureConfig = [
		{
			description: 'Keep a record of your personality with your personal diary',
			href: '/features/diary',
			Icon: BookHeart,
			title: 'Diary'
		},
		{
			description: 'All the different ways to view your data',
			href: 'features/data',
			Icon: ChartSpline,
			title: 'Data'
		},
		{
			description: 'Access everything from a powerful dashboard',
			href: 'features/dashboard',
			Icon: LayoutDashboard,
			title: 'Dashboard'
		}
	] satisfies SubMenu[];
</script>

<header class="flex items-center justify-between border-b-2 p-6">
	{@render menu()}
	<p class="text-xl font-bold">Vibe Check</p>
	{#if !user}
		<div class="flex gap-2">
			<Button variant="outline">Sign in</Button>
			<Button>Get Started</Button>
		</div>
	{:else}
		{user.name}
	{/if}
</header>

{#snippet menu()}
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item>
				<NavigationMenu.Link class={cn(navigationMenuTriggerStyle())} href="/"
					>Home</NavigationMenu.Link
				>
			</NavigationMenu.Item>
			<NavigationMenu.Item>
				<NavigationMenu.Trigger>Features</NavigationMenu.Trigger>
				<NavigationMenu.Content>
					<div class="grid w-[600px] grid-cols-2 gap-4 p-6">
						<NavigationMenu.Link class="bg-muted justify-end p-6" href="/features">
							<div class="text-2xl font-medium">Features</div>
							<p class="text-muted-foreground text-sm">Explore our product's features</p>
						</NavigationMenu.Link>
						<div class="flex flex-col">
							{#each featureConfig as configItem (configItem.title)}
								{@render item(configItem)}
							{/each}
						</div>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
{/snippet}

{#snippet item({ description, title, Icon, href }: SubMenu)}
	<NavigationMenu.Link class="gap-2 p-4" {href}>
		<div class="flex items-center gap-4">
			<div class="bg-muted rounded-sm p-2">
				<Icon size={32} />
			</div>
			<div class="text-lg font-medium">{title}</div>
		</div>
		<p class="text-muted-foreground text-xs">
			{description}
		</p>
	</NavigationMenu.Link>
{/snippet}
