<script lang="ts">
	import { type WithoutChild, cn } from "$lib/utils.js";
	import * as FormPrimitive from "formsnap";

	let {
		children: childrenProp,
		ref = $bindable(null),
		class: className,
		errorClasses,
		...restProps
	}: {
		errorClasses?: undefined | string | null;
	} & WithoutChild<FormPrimitive.FieldErrorsProps> = $props();
</script>

<FormPrimitive.FieldErrors
	bind:ref
	class={cn("text-destructive text-sm font-medium", className)}
	{...restProps}
>
	{#snippet children({ errorProps, errors })}
		{#if childrenProp}
			{@render childrenProp({ errorProps, errors })}
		{:else}
			{#each errors as error (error)}
				<div {...errorProps} class={cn(errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
