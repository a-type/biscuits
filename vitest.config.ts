import { defineProject } from 'vitest/config';

export default defineProject({
	test: {
		projects: ['./apps/*/*/vitest.config.ts', './packages/*/vitest.config.ts'],
	},
});
