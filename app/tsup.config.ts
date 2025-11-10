import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: '../dist',
  clean: true,
  minify: true,
  sourcemap: false,
  dts: {
    resolve: true,
  },
  target: 'es2022',
  tsconfig: './tsconfig.prod.json',
  loader: {
    '.svg': 'text',
  },
  esbuildOptions(options) {
    options.assetNames = '[name].[ext]';
  },
});
