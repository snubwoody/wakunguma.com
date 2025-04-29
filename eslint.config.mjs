import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import {globalIgnores} from 'eslint/config';

export default ts.config(
    ts.configs.base,
	...svelte.configs.base,
    globalIgnores([
        "**/*.d.ts",
        "vitest-setup-client.ts",
        "vite.config.ts",
        ".storybook/",
        ".svelte-kit/",
    ]),
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: { 
			"no-undef": 'off',
			"no-unused-vars":'warn',
			"semi":"error",
            "svelte/prefer-const":"warn",
            "svelte/no-unused-props":"warn"
		}
	},
	{
		files: [
			'**/*.svelte',
			'**/*.svelte.ts',
			'**/*.svelte.js',
			'**/*.js',
			'**/*.ts',
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);
