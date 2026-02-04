import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CompressionPlugin from "compression-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createConfig = (minify) => ({
  mode: "production",
  entry: "./src/entry-core-only.js",
  output: {
    path: path.resolve(__dirname, "../../dist/webpack/core-only"),
    filename: minify ? "core-only.min.js" : "core-only.js",
    clean: false,
  },
  optimization: {
    minimize: minify,
    minimizer: minify
      ? [
          new TerserPlugin({
            terserOptions: {
              compress: {
                pure_funcs: ["console.log"],
              },
            },
          }),
        ]
      : [],
    usedExports: true,
    sideEffects: false,
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: minify ? "stats-min.html" : "stats.html",
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: minify ? "stats-min.json" : "stats.json",
    }),
    new CompressionPlugin({
      algorithm: "gzip",
    }),
  ],
  devtool: "source-map",
});

export default [createConfig(false), createConfig(true)];
