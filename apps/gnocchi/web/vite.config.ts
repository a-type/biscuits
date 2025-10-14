import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [
		UnoCSS(),
		react({
			babel: {
				// plugins: ['babel-plugin-react-compiler'],
			},
		}),
		VitePWA({
			includeManifestIcons: true,
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'service-worker.ts',
			manifest: {
				id: 'gnocchi-main',
				name: 'Gnocchi',
				short_name: 'Gnocchi',
				description: 'Your grocery list, done better.',
				theme_color: '#fdfdff',
				background_color: '#fdfdff',
				scope: 'https://gnocchi.biscuits.club/',
				icons: [
					{
						src: 'android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'android-chrome-512x512-mask.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
				screenshots: [
					{
						src: 'images/screenshots/list.png',
						type: 'image/png',
						sizes: '1170x2532',
					},
					{
						src: 'images/screenshots/recipe_overview.png',
						type: 'image/png',
						sizes: '1170x2532',
					},
					{
						src: 'images/screenshots/cooking.png',
						type: 'image/png',
						sizes: '1170x2532',
					},
				],
				categories: ['food'],
				display: 'standalone',
				start_url: '/?directLaunch=true',
				share_target: {
					action: 'share',
					method: 'POST',
					enctype: 'multipart/form-data',
					params: {
						title: 'title',
						text: 'text',
						url: 'url',
					},
				},
			} as any,
			includeAssets: [
				'fonts/**/*',
				'images/**/*',
				'assets/**/*',
				'og-image.png',
			],

			injectManifest: {
				maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MiB
			},

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
		// 	circleImportThrowErr: true,
		// }),
		viteCommonjs(),
	],
	optimizeDeps: {
		exclude: ['@biscuits/client'],
		include: [
			'react/jsx-runtime',
			'react',
			'react-dom',
			'react-dom/client',
			'formik',
			'hoist-non-react-statics',
			'graphql',
		],
	},
	resolve: {
		conditions:
			mode === 'production'
				? ['production', 'import', 'module', 'browser', 'default']
				: ['development', 'import', 'module', 'browser', 'default'],
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 6220,
	},
	build: {
		sourcemap: true,
	},
}));
