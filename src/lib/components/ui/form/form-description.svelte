<script lang="ts">
	import { type WithoutChild, cn } from "$lib/utils.js";
	import * as FormPrimitive from "formsnap";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChild<FormPrimitive.DescriptionProps> = $props();
</script>

<FormPrimitive.Description
	bind:ref
	data-slot="form-description"
	class={cn("text-muted-foreground text-sm", className)}
	{...restProps}
/>
