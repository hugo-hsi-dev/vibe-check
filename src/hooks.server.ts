import { svelteKitHandler } from 'better-auth/svelte-kit';
import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

export async function handle({ resolve, event }) {
	const authResult = await auth.api.getSession({ headers: event.request.headers });

	event.locals.session = authResult?.session || null;
	event.locals.user = authResult?.user || null;

	const pathname = event.url.pathname;

	// ========== Auth Guard ==========
	const isLoggedIn = !!authResult?.user;

	if (!isLoggedIn) {
		if (pathname.startsWith('/app')) {
			return redirect(302, '/login');
		}
	}

	if (isLoggedIn) {
		if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
			return redirect(302, '/app');
		}
	}

	// ========== Onboard Guard ==========
	const isOnboarded = authResult!.user.isOnboarded;

	if (!isOnboarded) {
		if (pathname.startsWith('/app')) {
			return redirect(302, '/get-started');
		}
	}

	if (isOnboarded) {
		if (pathname.startsWith('/get-started')) {
			return redirect(302, '/app');
		}
	}

	// ========== Admin Guard ==========
	const role = authResult!.user.role;
	const isAdmin = !!role && role.includes('admin');

	if (!isAdmin) {
		if (pathname.startsWith('/admin')) {
			return redirect(302, '/app');
		}
	}

	return svelteKitHandler({ resolve, event, auth });
}
