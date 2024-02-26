import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [UnoCSS(), react()],
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
  },
  build: {
    sourcemap: true,
  },
}));
