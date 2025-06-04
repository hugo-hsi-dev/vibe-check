import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin } from 'better-auth/plugins';
import { betterAuth } from 'better-auth';

import { db } from './db'; // your drizzle instance

export const auth = betterAuth({
	user: {
		additionalFields: {
			isOnboarded: {
				defaultValue: () => false,
				type: 'boolean',
				required: false,
				input: false
			}
		}
	},
	emailAndPassword: { autoSignIn: true, enabled: true },
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [adminPlugin()],
	appName: 'vibe-check'
});
