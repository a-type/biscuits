import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import atype from '@a-type/ui/uno-preset';

export default defineConfig({
  presets: [atype({})],
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
