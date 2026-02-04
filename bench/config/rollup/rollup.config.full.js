import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";
import analyzer from "rollup-plugin-analyzer";
import { writeFileSync } from "fs";
export default {
  input: "src/entry-full-static.js",
  output: [
    {
      file: "dist/rollup/full-static.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/rollup/full-static.min.js",
      format: "es",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    visualizer({
      filename: "dist/rollup/stats-full-static.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Rollup Analysis: Full Static (Core + All Plugins)",
    }),
    analyzer({
      summaryOnly: false,
      limit: 0,
      writeTo: (analysis) => {
        writeFileSync("dist/rollup/analysis-full-static.txt", analysis);
      },
    }),
  ],
  treeshake: {
    moduleSideEffects: "no-external",
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },
};
