<script lang="ts">
	import PublicHeader from '$lib/components/public-header.svelte';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<PublicHeader user={data.user} />
{@render children()}
