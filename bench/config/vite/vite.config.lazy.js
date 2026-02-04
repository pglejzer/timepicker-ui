import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist/vite/lazy-load",
    emptyOutDir: true,
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        pure_funcs: ["console.log"],
      },
    },
    rollupOptions: {
      input: "src/entry-lazy-load.js",
      output: {
        entryFileNames: "lazy-load.js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: "[name][extname]",
        manualChunks: (id) => {
          if (id.includes("plugins/range")) return "plugin-range";
          if (id.includes("plugins/timezone")) return "plugin-timezone";
        },
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
      filename: "dist/vite/lazy-load/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Vite Analysis: Lazy Load",
    }),
  ],
});
