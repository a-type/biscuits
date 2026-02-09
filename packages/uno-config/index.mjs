import atype from '@a-type/ui/uno-preset';
import variantGroup from '@unocss/transformer-variant-group';
import { defineConfig } from 'unocss';

export const contentConfig = {
	filesystem: ['./node_modules/@a-type/ui/dist/esm/**'],
};

export default withOptions({});

export function withOptions(options) {
	return defineConfig({
		presets: [
			atype({
				...options,
				disableZIndexes: true,
				focusColor: 'primary',
			}),
		],
		transformers: [variantGroup()],
		preflights: [
			{
				getCSS: () => `
			html, body, #root {
				display: flex;
				flex-direction: column;
				flex: 1;
				min-height: 100%;
				margin: 0;
			}

			#root {
				flex: 1;
				isolation: isolate;
			}

			.hidden {
				display: none;
			}
			`,
			},
		],
		content: contentConfig,
	});
}
