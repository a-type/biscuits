import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'url';
import UnoCSS from 'unocss/vite';
import { resolve } from 'path';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [UnoCSS(), react(), viteCommonjs()],
  optimizeDeps: {
    exclude: [],
    include: ['react/jsx-runtime', 'react', 'react-dom'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    conditions:
      mode === 'production'
        ? ['production', 'import', 'module', 'browser', 'default']
        : ['development', 'import', 'module', 'browser', 'default'],
  },
  server: {
    port: 6123,
    strictPort: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        appPicker: resolve(__dirname, 'appPicker/index.html'),
      },
    },
  },
}));
