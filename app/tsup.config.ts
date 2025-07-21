import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: '../dist',
    clean: true,
    minify: true,
    sourcemap: false,
    dts: {
      resolve: true,
    },
    tsconfig: './tsconfig.prod.json',
    target: 'es2022',
  },
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    outDir: '../dist',
    clean: false,
    minify: true,
    sourcemap: false,
    dts: {
      resolve: true,
    },
    tsconfig: './tsconfig.prod.json',
    target: 'es2022',
  },
]);

