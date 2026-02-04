import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import analyzer from "rollup-plugin-analyzer";
import { writeFileSync } from "fs";
export default {
  input: "src/entry-core-only.js",
  output: [
    {
      file: "dist/rollup/core-only.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/rollup/core-only.min.js",
      format: "es",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      filename: "dist/rollup/stats-core-only.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Rollup Analysis: Core Only",
    }),
    analyzer({
      summaryOnly: false,
      limit: 0,
      writeTo: (analysis) => {
        writeFileSync("dist/rollup/analysis-core-only.txt", analysis);
      },
    }),
  ],
  treeshake: {
    moduleSideEffects: "no-external",
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
};
