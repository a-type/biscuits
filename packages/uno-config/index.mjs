import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export const contentConfig = {
	filesystem: ['./node_modules/@a-type/ui/dist/esm/**'],
};

export default defineConfig({
	presets: [atype({ saturation: 40 })],
	transformers: [variantGroup()],
	preflights: [
		{
			getCSS: () => `
			html, body, #root {
				display: flex;
				flex-direction: column;
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
