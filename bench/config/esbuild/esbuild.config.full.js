import * as esbuild from "esbuild";
import { gzipSizeFromFileSync } from "gzip-size";
import { writeFileSync, statSync, mkdirSync } from "fs";

mkdirSync("dist/esbuild/full-static", { recursive: true });

const unminified = await esbuild.build({
  entryPoints: ["src/entry-full-static.js"],
  bundle: true,
  minify: false,
  sourcemap: true,
  treeShaking: true,
  outfile: "dist/esbuild/full-static/full-static.js",
  format: "esm",
  metafile: true,
  logLevel: "info",
});

const minified = await esbuild.build({
  entryPoints: ["src/entry-full-static.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  treeShaking: true,
  outfile: "dist/esbuild/full-static/full-static.min.js",
  format: "esm",
  metafile: true,
  pure: ["console.log"],
  logLevel: "info",
});

const unminFile = "dist/esbuild/full-static/full-static.js";
const minFile = "dist/esbuild/full-static/full-static.min.js";

const unminStats = statSync(unminFile);
const minStats = statSync(minFile);

const unminGzip = gzipSizeFromFileSync(unminFile);
const minGzip = gzipSizeFromFileSync(minFile);

const analysis = {
  bundler: "esbuild",
  variant: "full-static",
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
  "dist/esbuild/full-static/analysis.json",
  JSON.stringify(analysis, null, 2),
);

console.log(
  `✅ esbuild full-static (unminified): ${(unminStats.size / 1024).toFixed(2)} KB`,
);
console.log(`   gzip: ${(unminGzip / 1024).toFixed(2)} KB`);
console.log(
  `✅ esbuild full-static (minified): ${(minStats.size / 1024).toFixed(2)} KB`,
);
console.log(`   gzip: ${(minGzip / 1024).toFixed(2)} KB`);
