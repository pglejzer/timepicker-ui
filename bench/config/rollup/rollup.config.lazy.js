import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import analyzer from "rollup-plugin-analyzer";
import { writeFileSync } from "fs";
export default {
  input: "src/entry-lazy-load.js",
  output: [
    {
      dir: "dist/rollup/lazy",
      format: "es",
      sourcemap: true,
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
      inlineDynamicImports: false,
      manualChunks: (id) => {
        if (id.includes("/range.js") || id.includes("\\range.js"))
          return "plugin-range";
        if (id.includes("/timezone.js") || id.includes("\\timezone.js"))
          return "plugin-timezone";
      },
    },
    {
      dir: "dist/rollup/lazy-min",
      format: "es",
      sourcemap: true,
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
      inlineDynamicImports: false,
      manualChunks: (id) => {
        if (id.includes("/range.js") || id.includes("\\range.js"))
          return "plugin-range";
        if (id.includes("/timezone.js") || id.includes("\\timezone.js"))
          return "plugin-timezone";
      },
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      filename: "dist/rollup/stats-lazy-load.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Rollup Analysis: Lazy Load (Code Splitting)",
    }),
    analyzer({
      summaryOnly: false,
      limit: 0,
      writeTo: (analysis) => {
        writeFileSync("dist/rollup/analysis-lazy-load.txt", analysis);
      },
    }),
  ],
  treeshake: {
    moduleSideEffects: "no-external",
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
};
