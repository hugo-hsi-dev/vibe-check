<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SocialSignIn from '$lib/components/social-sign-in.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import SignupForm from './signup-form.svelte';
</script>

<div class="flex min-h-screen flex-col md:flex-row">
	<main class="m-6 mb-0 flex flex-3 md:m-0 md:flex-1 md:items-center md:justify-center">
		<div class="flex w-full flex-col gap-6 md:w-[300px]">
			<div>
				<h1 class="text-2xl font-semibold md:text-4xl md:font-bold">Create Account</h1>
				<p class="text-lg font-medium text-gray-600">Sign up to start your journey</p>
			</div>
			<div class="flex flex-col gap-6">
				<SignupForm />
			</div>
			<div class="flex items-center gap-2">
				<Separator class="flex-1" />
				<span class="text-muted-foreground text-xs font-bold">Or</span>
				<Separator class="flex-1" />
			</div>
			<div class="flex flex-col gap-2">
				<SocialSignIn />
			</div>
			<Button variant="link" href="/login">Already have an account? Log in</Button>
		</div>
	</main>
	{#key 'block'}
		<div class="bg-primary m-6 mt-0 flex-1 rounded-xl md:mt-6"></div>
	{/key}
</div>
