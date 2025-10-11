import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{ ignores: ['dist'] },
	js.configs.recommended,
	tseslint.configs.recommended,
	reactHooks.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					ignoreRestSiblings: true,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-empty-object-type': [
				'warn',
				{
					allowWithName: '.*Props$',
					allowInterfaces: 'with-single-extends',
				},
			],
			'no-empty-pattern': 'off',
			'no-extra-boolean-cast': 'off',
		},
	},
]);
