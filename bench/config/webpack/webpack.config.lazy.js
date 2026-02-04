import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CompressionPlugin from "compression-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production",
  entry: "./src/entry-lazy-load.js",
  output: {
    path: path.resolve(__dirname, "../../dist/webpack/lazy-load"),
    filename: "lazy-load.js",
    chunkFilename: "[name].chunk.js",
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "stats.html",
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: "stats.json",
    }),
    new CompressionPlugin({
      algorithm: "gzip",
    }),
  ],
  devtool: "source-map",
};
