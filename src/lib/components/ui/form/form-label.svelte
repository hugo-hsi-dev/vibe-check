<script lang="ts">
	import { Label } from "$lib/components/ui/label/index.js";
	import { type WithoutChild, cn } from "$lib/utils.js";
	import * as FormPrimitive from "formsnap";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithoutChild<FormPrimitive.LabelProps> = $props();
</script>

<FormPrimitive.Label {...restProps} bind:ref>
	{#snippet child({ props })}
		<Label
			{...props}
			data-slot="form-label"
			class={cn("data-[fs-error]:text-destructive", className)}
		>
			{@render children?.()}
		</Label>
	{/snippet}
</FormPrimitive.Label>
