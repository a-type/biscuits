// vite.config.ts
import { defineConfig } from "file:///Users/grant/git/personal/biscuits/node_modules/.pnpm/vite@3.2.8_@types+node@20.11.19/node_modules/vite/dist/node/index.js";
import react from "file:///Users/grant/git/personal/biscuits/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@3.2.8/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath } from "url";
import { VitePWA } from "file:///Users/grant/git/personal/biscuits/node_modules/.pnpm/vite-plugin-pwa@0.12.8_vite@3.2.8_workbox-build@6.6.0_workbox-window@6.6.1/node_modules/vite-plugin-pwa/dist/index.mjs";
import UnoCSS from "file:///Users/grant/git/personal/biscuits/node_modules/.pnpm/unocss@0.54.3_postcss@8.4.35_rollup@2.79.1_vite@3.2.8/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/grant/git/personal/biscuits/apps/trip-tick/web/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    UnoCSS(),
    react(),
    VitePWA({
      includeManifestIcons: true,
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      manifest: {
        name: "packing-list",
        short_name: "packing-list",
        description: "",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        categories: [],
        display: "standalone",
        start_url: "/"
      },
      includeAssets: ["fonts/**/*", "images/**/*"],
      workbox: {
        sourcemap: true
      },
      devOptions: {
        enabled: false,
        type: "module",
        navigateFallback: "index.html"
      }
    })
  ],
  optimizeDeps: {
    exclude: ["@a-type/ui"],
    include: ["react/jsx-runtime", "react", "react-dom"]
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    port: 6221
  },
  build: {
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZ3JhbnQvZ2l0L3BlcnNvbmFsL2Jpc2N1aXRzL2FwcHMvdHJpcC10aWNrL3dlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2dyYW50L2dpdC9wZXJzb25hbC9iaXNjdWl0cy9hcHBzL3RyaXAtdGljay93ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2dyYW50L2dpdC9wZXJzb25hbC9iaXNjdWl0cy9hcHBzL3RyaXAtdGljay93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgVW5vQ1NTKCksXG4gICAgcmVhY3QoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIGluY2x1ZGVNYW5pZmVzdEljb25zOiB0cnVlLFxuICAgICAgc3RyYXRlZ2llczogJ2luamVjdE1hbmlmZXN0JyxcbiAgICAgIHNyY0RpcjogJ3NyYycsXG4gICAgICBmaWxlbmFtZTogJ3NlcnZpY2Utd29ya2VyLnRzJyxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdwYWNraW5nLWxpc3QnLFxuICAgICAgICBzaG9ydF9uYW1lOiAncGFja2luZy1saXN0JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNhdGVnb3JpZXM6IFtdLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgfSBhcyBhbnksXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2ZvbnRzLyoqLyonLCAnaW1hZ2VzLyoqLyonXSxcblxuICAgICAgd29ya2JveDoge1xuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICB9LFxuXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB0eXBlOiAnbW9kdWxlJyxcbiAgICAgICAgbmF2aWdhdGVGYWxsYmFjazogJ2luZGV4Lmh0bWwnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydAYS10eXBlL3VpJ10sXG4gICAgaW5jbHVkZTogWydyZWFjdC9qc3gtcnVudGltZScsICdyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA2MjIxLFxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVixTQUFTLG9CQUFvQjtBQUM5VyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sWUFBWTtBQUorTCxJQUFNLDJDQUEyQztBQU9uUSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixzQkFBc0I7QUFBQSxNQUN0QixZQUFZO0FBQUEsTUFDWixRQUFRO0FBQUEsTUFDUixVQUFVO0FBQUEsTUFDVixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFlBQVksQ0FBQztBQUFBLFFBQ2IsU0FBUztBQUFBLFFBQ1QsV0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBLGVBQWUsQ0FBQyxjQUFjLGFBQWE7QUFBQSxNQUUzQyxTQUFTO0FBQUEsUUFDUCxXQUFXO0FBQUEsTUFDYjtBQUFBLE1BRUEsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsWUFBWTtBQUFBLElBQ3RCLFNBQVMsQ0FBQyxxQkFBcUIsU0FBUyxXQUFXO0FBQUEsRUFDckQ7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
