import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
	plugins: [
		UnoCSS(),
		react(),
		VitePWA({
			includeManifestIcons: true,
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			manifest: {
				id: 'names-main',
				name: 'Names',
				short_name: 'Names',
				description: 'An app to help with remembering names',
				theme_color: '#8ff8d3',
				background_color: '#5CC787',
				icons: [
					{
						src: 'pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
				screenshots: [
					{
						src: 'screenshots/homepage.png',
						type: 'image/png',
						sizes: '477x1060',
					},
					{
						src: 'screenshots/person.png',
						type: 'image/png',
						sizes: '477x1057',
					},
				],
				categories: [],
				display: 'standalone',
				scope: 'https://names.biscuits.club/',
				start_url: '/?directLaunch=true',
			} as any,
			includeAssets: ['fonts/**/*', 'images/**/*'],

			workbox: {
				sourcemap: true,
			},

			devOptions: {
				enabled: false,
				type: 'module',
				navigateFallback: 'index.html',
			},
		}),
		viteCommonjs(),
	],
	optimizeDeps: {
		exclude: ['@biscuits/client'],
		include: ['react/jsx-runtime', 'react', 'react-dom', 'react-dom/client'],
	},
	resolve: {
		conditions:
			mode === 'production' ?
				['production', 'import', 'module', 'browser', 'default']
			:	['development', 'import', 'module', 'browser', 'default'],
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 6227,
	},
	build: {
		sourcemap: true,
	},
}));
