import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
	plugins: [UnoCSS(), react(), viteCommonjs()],
	base:
		mode === 'production' ?
			'https://recipes.gnocchi.biscuits.club/'
		:	'http://localhost:6124/gnocchi/hubRecipe/',
	optimizeDeps: {
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
			mode === 'production' ?
				['production', 'import', 'module', 'browser', 'default']
			:	['development', 'import', 'module', 'browser', 'default'],
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		sourcemap: true,
	},
}));
