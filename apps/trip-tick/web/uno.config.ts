import atype from '@a-type/ui/uno-preset';
import presetIcons from '@unocss/preset-icons';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export default defineConfig({
	presets: [atype({ saturation: 40 }), presetIcons({})],
	// required to support styling in this library
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
});
