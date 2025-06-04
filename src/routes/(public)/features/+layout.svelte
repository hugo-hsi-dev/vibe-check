<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<div>
	<Button href="/features/diary">Diary</Button>
	<Button href="/features/data">Data</Button>
	<Button href="/features/dashboard">Dashboard</Button>
</div>
{@render children()}
