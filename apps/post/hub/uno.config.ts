// uno.config.ts
import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import atype from '@a-type/ui/uno-preset';

export default defineConfig({
  presets: [atype()],
  transformers: [variantGroup()],
  preflights: [
    {
      getCSS: () => `
			@font-face {
				font-family: "Inter";
				src: url("https://resources.biscuits.club/fonts/Inter-VariableFont_slnt,wght.ttf") format("truetype-variations");
				font-weight: 1 999;
				font-style: oblique 0deg 5deg;
				font-display: block;
			}

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
