import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export const contentConfig = {
	filesystem: ['./node_modules/@a-type/ui/dist/esm/**'],
};

export default defineConfig({
	presets: [atype()],
	transformers: [variantGroup()],
	preflights: [
		{
			getCSS: () => `
			html, body, #root {
				display: flex;
				flex-direction: column;
				flex: 1;
				min-height: 100%;
				margin: 0;
			}

			#root {
				flex: 1;
			}

			.hidden {
				display: none;
			}
			`,
		},
	],
	content: contentConfig,
});
