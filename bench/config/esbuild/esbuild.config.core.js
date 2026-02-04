import * as esbuild from "esbuild";
import { gzipSizeFromFileSync } from "gzip-size";
import { writeFileSync, statSync, mkdirSync } from "fs";

mkdirSync("dist/esbuild/core-only", { recursive: true });

const unminified = await esbuild.build({
  entryPoints: ["src/entry-core-only.js"],
  bundle: true,
  minify: false,
  sourcemap: true,
  treeShaking: true,
  outfile: "dist/esbuild/core-only/core-only.js",
  format: "esm",
  metafile: true,
  logLevel: "info",
});

const minified = await esbuild.build({
  entryPoints: ["src/entry-core-only.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  treeShaking: true,
  outfile: "dist/esbuild/core-only/core-only.min.js",
  format: "esm",
  metafile: true,
  pure: ["console.log"],
  logLevel: "info",
});

const unminFile = "dist/esbuild/core-only/core-only.js";
const minFile = "dist/esbuild/core-only/core-only.min.js";

const unminStats = statSync(unminFile);
const minStats = statSync(minFile);

const unminGzip = gzipSizeFromFileSync(unminFile);
const minGzip = gzipSizeFromFileSync(minFile);

const analysis = {
  bundler: "esbuild",
  variant: "core-only",
  unminified: {
    size: unminStats.size,
    gzipSize: unminGzip,
  },
  minified: {
    size: minStats.size,
    gzipSize: minGzip,
  },
  metafile: minified.metafile,
};

writeFileSync(
  "dist/esbuild/core-only/analysis.json",
  JSON.stringify(analysis, null, 2),
);

console.log(
  `✅ esbuild core-only (unminified): ${(unminStats.size / 1024).toFixed(2)} KB`,
);
console.log(`   gzip: ${(unminGzip / 1024).toFixed(2)} KB`);
console.log(
  `✅ esbuild core-only (minified): ${(minStats.size / 1024).toFixed(2)} KB`,
);
console.log(`   gzip: ${(minGzip / 1024).toFixed(2)} KB`);
