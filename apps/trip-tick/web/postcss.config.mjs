import { ArborPlugin } from '@arbor-css/postcss';

export default {
	plugins: [
		ArborPlugin({
			configFile: './arbor.config.ts',
		}),
	],
};
