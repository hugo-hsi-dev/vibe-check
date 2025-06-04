import perfectionist from 'eslint-plugin-perfectionist';
import { includeIgnoreFile } from '@eslint/compat';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import globals from 'globals';
import js from '@eslint/js';

import svelteConfig from './svelte.config.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	perfectionist.configs['recommended-line-length'],
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: { 'no-undef': 'off' }
	},
	{
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				// projectService: true,
				svelteConfig
			}
		},
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js']
	}
);
