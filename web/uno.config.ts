import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export default defineConfig({
	presets: [atype({ saturation: 0 }) as any],
	// required to support styling in this library
	transformers: [(variantGroup as any)() as any],
	preflights: [
		{
			getCSS: () => `
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
      `,
		},
	],
});
