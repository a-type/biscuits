import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import atype from '@a-type/ui/uno-preset';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [atype({ spacingIncrement: 0.25 }), presetIcons({})],
  // required to support styling in this library
  transformers: [variantGroup()],
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
