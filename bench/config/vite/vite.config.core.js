import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist/vite/core-only",
    emptyOutDir: true,
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"],
      },
    },
    rollupOptions: {
      input: "src/entry-core-only.js",
      output: {
        entryFileNames: "core-only.js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]",
        manualChunks: undefined,
      },
      treeshake: {
        moduleSideEffects: "no-external",
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
  plugins: [
    visualizer({
      filename: "dist/vite/core-only/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Vite Analysis: Core Only",
    }),
  ],
});
