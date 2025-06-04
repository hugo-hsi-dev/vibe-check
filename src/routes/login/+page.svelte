<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SocialSignIn from '$lib/components/social-sign-in.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	import LoginForm from './login-form.svelte';
</script>

<div class="flex min-h-screen flex-col md:flex-row">
	<div class="bg-primary m-6 flex-1 rounded-xl"></div>
	<main class="m-6 mt-0 flex flex-3 md:m-0 md:flex-1 md:items-center md:justify-center">
		<div class="flex w-full flex-col gap-6 md:w-[300px]">
			<div>
				<h1 class="text-2xl font-semibold md:text-4xl md:font-bold">Welcome Back</h1>
				<p class="text-lg font-medium text-gray-600">Log in today to keep your streak</p>
			</div>
			<div class="flex flex-col gap-6">
				<LoginForm />
			</div>
			<div class="flex items-center gap-2">
				<Separator class="flex-1" />
				<span class="text-muted-foreground text-xs font-bold">Or</span>
				<Separator class="flex-1" />
			</div>
			<div class="flex flex-col gap-2">
				<SocialSignIn />
			</div>
			<Button variant="link" href="/signup">Don't have an account? Sign up</Button>
		</div>
	</main>
</div>
