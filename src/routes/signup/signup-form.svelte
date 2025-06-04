<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { authClient } from '$lib/auth-client';
	import { slide } from 'svelte/transition';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	let message: undefined | string = $state();

	async function handleSignup() {
		if (password !== confirmPassword) {
			return (message = 'Passwords do not match');
		}

		authClient.signUp.email({
			fetchOptions: {
				onError({ error }) {
					message = error.message;
				}
			},
			callbackURL: '/get-started',
			name: firstName + lastName,
			password,
			email
		});
	}
</script>

<div class="flex flex-col gap-2">
	<Label>First name</Label>
	<Input bind:value={firstName} placeholder="John" />
</div>
<div class="flex flex-col gap-2">
	<Label>Last name</Label>
	<Input bind:value={lastName} placeholder="Doe" />
</div>
<div class="flex flex-col gap-2">
	<Label>Email</Label>
	<Input bind:value={email} placeholder="example@email.com" />
</div>
<div class="flex flex-col gap-2">
	<Label>Password</Label>
	<Input bind:value={password} placeholder="Password" type="password" />
</div>
<div class="flex flex-col gap-2">
	<Label>Confirm Password</Label>
	<Input bind:value={confirmPassword} placeholder="Confirm Password" type="password" />
</div>
<Button onclick={handleSignup}>Sign up</Button>

{#if message}
	<div transition:slide>
		<Alert.Root variant="destructive">
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{message}</Alert.Description>
		</Alert.Root>
	</div>
{/if}
