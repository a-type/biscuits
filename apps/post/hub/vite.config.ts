import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [UnoCSS(), react(), viteCommonjs()],
	base:
		mode === 'production' ?
			'https://pub.post.biscuits.club/'
		:	'http://localhost:6124/post/hub/',
	optimizeDeps: {
		include: [
			'react/jsx-runtime',
			'react',
			'react-dom',
			'react-dom/client',
			'formik',
			'hoist-non-react-statics',
		],
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
	build: {
		sourcemap: true,
		rollupOptions: {
			input: {
				notebook: resolve(
					import.meta.dirname,
					'./src/pages/notebook/index.html',
				),
				post: resolve(import.meta.dirname, './src/pages/post/index.html'),
			},
		},
	},
}));
