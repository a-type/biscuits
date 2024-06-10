import { defineConfig } from 'unocss';
import variantGroup from '@unocss/transformer-variant-group';
import atype from '@a-type/ui/uno-preset';

export default defineConfig({
  presets: [atype({ spacingIncrement: 0.25 }) as any],
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
