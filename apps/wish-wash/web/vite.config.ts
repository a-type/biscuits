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
				name: 'Wish Wash',
				short_name: 'Wish Wash',
				description: '',
				theme_color: '#ffffff',
				background_color: '#ffffff',
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
				categories: [],
				display: 'standalone',
				start_url: '/',
				scope: 'https://wish-wash.biscuits.club/',
				share_target: {
					action: '/share',
					method: 'POST',
					enctype: 'multipart/form-data',
					params: {
						title: 'title',
						text: 'text',
						url: 'url',
					},
				},
			},
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
		// CircularDependency({
		//   circleImportThrowErr: true,
		// }),
		viteCommonjs(),
	],
	optimizeDeps: {
		exclude: ['@biscuits/client'],
		include: ['react/jsx-runtime', 'react', 'react-dom', 'react-dom/client'],
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
		conditions:
			mode === 'production' ?
				['production', 'import', 'module', 'browser', 'default']
			:	['development', 'import', 'module', 'browser', 'default'],
	},
	server: {
		port: 6222,
	},
	build: {
		sourcemap: true,
	},
}));
