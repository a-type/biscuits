import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react-swc';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [UnoCSS(), react(), viteCommonjs()],
	base:
		mode === 'production' ?
			'https://lists.wish-wash.biscuits.club/'
		:	'http://localhost:6124/wish-wash/hub/',
	optimizeDeps: {
		exclude: ['@a-type/ui', '@biscuits/client'],
		include: [
			'react/jsx-runtime',
			'react',
			'react-dom',
			'react-dom/client',
			'formik',
			'hoist-non-react-statics',
		],
	},
	ssr: {
		noExternal: ['@apollo/client', '@a-type/ui', '@biscuits/client'],
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
