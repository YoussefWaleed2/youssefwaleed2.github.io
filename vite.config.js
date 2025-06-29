import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
        manualChunks: {
          // Keep GSAP and its plugins together to prevent loading issues
          'gsap-vendor': ['gsap', 'gsap/CustomEase']
        }
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    sourcemap: true
  },
  optimizeDeps: {
    // Include GSAP plugins in dependency optimization
    include: ['gsap', 'gsap/CustomEase'],
    // Force optimization of GSAP modules
    force: true
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true,
    historyApiFallback: true
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
});
