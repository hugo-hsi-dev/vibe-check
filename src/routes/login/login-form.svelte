<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { authClient } from '$lib/auth-client';
	import { slide } from 'svelte/transition';

	let message: undefined | string = $state();
	let email = $state('');
	let password = $state('');

	let rememberMe = $state(false);

	function showMessage(newMessage: string) {
		message = newMessage;
	}

	function handleLogin() {
		authClient.signIn.email({
			fetchOptions: {
				onError({ error }) {
					message = error.message;
				}
			},

			callbackURL: '/app',
			rememberMe,
			password,
			email
		});
	}
</script>

<div class="flex flex-col gap-2">
	<Label for="email">Email</Label>
	<Input id="email" bind:value={email} placeholder="example@email.com" />
</div>

<div class="flex flex-col gap-2">
	<Label for="password">Password</Label>
	<Input id="password" bind:value={password} placeholder="Password" type="password" />
</div>

<div class="flex items-center gap-2">
	<Checkbox bind:checked={rememberMe} id="remember-me" />
	<Label for="remember-me">Remember me?</Label>
	<Button
		variant="link"
		class="ml-auto h-auto p-0"
		onclick={() => showMessage('Feature currently unavailable')}>Forgot your password?</Button
	>
</div>

<Button onclick={handleLogin}>Log In</Button>

{#if message}
	<div transition:slide>
		<Alert.Root variant="destructive">
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{message}</Alert.Description>
		</Alert.Root>
	</div>
{/if}
