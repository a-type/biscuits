// uno.config.ts
import preset from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export default defineConfig({
	presets: [
		preset({
			saturation: 20,
		}),
	],
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
