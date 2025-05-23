import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export default defineConfig({
	presets: [atype() as any],
	// required to support styling in this library
	transformers: [variantGroup()],
	// modify the content sources to include
	// this library when extracting styles
	content: {
		pipeline: {
			include: [
				// include js/ts files as well as defaults.
				/\.(vue|svelte|[jt]sx?|mdx?|astro|elm|php|phtml|html)($|\?)/,
			],
		},
	},
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
