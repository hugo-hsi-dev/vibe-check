<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import type { FormPathLeaves } from "sveltekit-superforms";
	import type { HTMLAttributes } from "svelte/elements";

	import { type WithoutChildren, type WithElementRef, cn } from "$lib/utils.js";
	import * as FormPrimitive from "formsnap";

	let {
		children: childrenProp,
		ref = $bindable(null),
		class: className,
		form,
		name,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> &
		FormPrimitive.ElementFieldProps<T, U> = $props();
</script>

<FormPrimitive.ElementField {form} {name}>
	{#snippet children({ constraints, tainted, errors, value })}
		<div bind:this={ref} class={cn("space-y-2", className)} {...restProps}>
			{@render childrenProp?.({ value: value as T[U], constraints, tainted, errors })}
		</div>
	{/snippet}
</FormPrimitive.ElementField>
