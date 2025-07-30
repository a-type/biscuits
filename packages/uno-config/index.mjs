import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

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
			`,
		},
	],
	content: {
		pipeline: {
			include: [/\.(tsx|html)($|\?)/, '**/@a-type_ui.js*'],
		},
	},
});
