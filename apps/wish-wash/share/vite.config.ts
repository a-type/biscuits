import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
	server: {
		port: 6401,
	},
	// base:
	// 	mode === 'production' ?
	// 		'https://lists.wish-wash.biscuits.club/'
	// 	:	undefined,
	plugins: [
		UnoCSS(),
		tsConfigPaths({
			projects: ['./tsconfig.json'],
		}),
		cloudflare({ viteEnvironment: { name: 'ssr' } }),
		tanstackStart(),
		viteReact(),
	],
}));
