import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig, extractorDefault } from 'unocss';

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
					hue: 180,
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
	content: {
		pipeline: {
			include: [/\.(tsx|tsx|html)($|\?)/, '**/@a-type_ui.js*'],
		},
	},
	extractors: [
		{
			name: 'log',
			extract: (ctx) => {
				console.log(ctx.id);
				return extractorDefault.extract!(ctx);
			},
		},
	],
});
