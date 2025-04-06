// uno.config.ts
import presetAglio from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export default defineConfig({
	presets: [presetAglio({ saturation: 40 })],
	transformers: [variantGroup()],
	preflights: [
		{
			getCSS: () => `
			html, body, #root {
				display: flex;
				flex-direction: column;
				overscroll-behavior: none;
			}

			#root {
				flex: 1;
			}
		`,
		},
	],
});
