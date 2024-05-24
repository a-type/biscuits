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
