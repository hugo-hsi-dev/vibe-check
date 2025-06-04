import { svelteTesting } from '@testing-library/svelte/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	test: {
		workspace: [
			{
				test: {
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					setupFiles: ['./vitest-setup-client.ts'],
					exclude: ['src/lib/server/**'],
					environment: 'jsdom',
					clearMocks: true,
					name: 'client'
				},
				extends: './vite.config.ts',
				plugins: [svelteTesting()]
			},
			{
				test: {
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					include: ['src/**/*.{test,spec}.{js,ts}'],
					environment: 'node',
					name: 'server'
				},
				extends: './vite.config.ts'
			}
		]
	},
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});
