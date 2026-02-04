import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist/vite/full-static",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    rollupOptions: {
      input: "src/entry-full-static.js",
      output: {
        entryFileNames: "full-static.unmin.js",
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
      filename: "dist/vite/full-static/stats-unmin.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Vite Analysis: Full Static (Unminified)",
    }),
  ],
});
