import * as esbuild from "esbuild";
import { gzipSizeFromFileSync } from "gzip-size";
import { writeFileSync, statSync, rmSync } from "fs";

rmSync("dist/esbuild/lazy-load", { recursive: true, force: true });

const result = await esbuild.build({
  entryPoints: ["src/entry-lazy-load.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  treeShaking: true,
  outdir: "dist/esbuild/lazy-load",
  format: "esm",
  metafile: true,
  pure: ["console.log"],
  logLevel: "info",
  splitting: true,
  chunkNames: "[name]-[hash]",
});

const outputFile = "dist/esbuild/lazy-load/entry-lazy-load.js";
const stats = statSync(outputFile);
const gzipSize = gzipSizeFromFileSync(outputFile);

const analysis = {
  bundler: "esbuild",
  variant: "lazy-load",
  size: stats.size,
  gzipSize,
  metafile: result.metafile,
};

writeFileSync(
  "dist/esbuild/lazy-load/analysis.json",
  JSON.stringify(analysis, null, 2),
);
writeFileSync(
  "dist/esbuild/lazy-load/metafile.json",
  JSON.stringify(result.metafile, null, 2),
);

console.log(`✅ esbuild lazy-load: ${(stats.size / 1024).toFixed(2)} KB`);
console.log(`   gzip: ${(gzipSize / 1024).toFixed(2)} KB`);
