import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'plugins/range': 'src/range.ts',
    'plugins/timezone': 'src/timezone.ts',
  },
  format: ['esm', 'cjs'],
  outDir: '../dist',
  clean: true,
  minify: true,
  sourcemap: false,
  splitting: false,
  dts: false,
  target: 'es2022',
  tsconfig: './tsconfig.prod.json',
  loader: {
    '.svg': 'text',
  },
  esbuildOptions(options) {
    options.assetNames = '[name].[ext]';
  },
});
