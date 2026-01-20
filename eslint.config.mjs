import js from '@eslint/js';
import unocss from '@unocss/eslint-config/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	{ ignores: ['dist'] },
	js.configs.recommended,
	tseslint.configs.recommended,
	reactHooks.configs.flat.recommended,
	unocss,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					ignoreRestSiblings: true,
					argsIgnorePattern: '(^_|ctx|migrate)',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-empty-object-type': [
				'warn',
				{
					allowWithName: '.*Props$',
					allowInterfaces: 'always',
				},
			],
			'no-empty-pattern': 'off',
			'no-extra-boolean-cast': 'off',
			'unocss/order': [
				'error',
				{
					unoFunctions: ['clsx', 'classNames', 'css', 'withClassName'],
				},
			],
		},
	},
	{
		ignores: [
			'**/dist/**/*',
			'**/node_modules/**/*',
			'**/assets/**/*',
			'**/*.js',
			'**/*.cjs',
			'**/*.mjs',
			'**/vite.config.*',
			'**/eslint.config.*',
			'**/worker-configuration.d.ts',
			'**/verdant/src/client/**/*',
			'**/verdant/src/migrations/**/*',
		],
	},
]);
