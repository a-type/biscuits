import atype from '@a-type/ui/uno-preset';
import { contentConfig } from '@biscuits/uno-config';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export default defineConfig({
	presets: [
		atype({
			saturation: 40,
			customTheme: {
				primary: {
					hue: 78,
					hueRotate: -8,
				},
				accent: {
					hue: 170,
					hueRotate: 2,
				},
			},
		}) as any,
	],
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
	content: contentConfig,
	// extractors: [
	// 	{
	// 		name: 'log',
	// 		extract: (ctx) => {
	// 			console.log(ctx.id);
	// 			return extractorDefault.extract!(ctx);
	// 		},
	// 	},
	// ],
});
