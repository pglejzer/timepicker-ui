import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' with { type: 'json' };
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import { importAsString } from 'rollup-plugin-string-import';

const { dependencies } = Object.keys(pkg) || {};

const baseConfig = (input, outputFile) => ({
  input,
  output: {
    file: outputFile,
  },
  plugins: [
    postcss({
      extract: true,
      minimize: true,
      modules: false,
      use: ['sass'],
    }),
  ],
});

const scssConfigs = [
  baseConfig('./src/styles/index.scss', '../dist/css/index.css'),
  baseConfig('./src/styles/main.scss', '../dist/css/main.css'),
  baseConfig('./src/styles/themes/theme-crane.scss', '../dist/css/themes/theme-crane.css'),
  baseConfig('./src/styles/themes/theme-crane-straight.scss', '../dist/css/themes/theme-crane-straight.css'),
  baseConfig('./src/styles/themes/theme-dark.scss', '../dist/css/themes/theme-dark.css'),
  baseConfig('./src/styles/themes/theme-glassmorphic.scss', '../dist/css/themes/theme-glassmorphic.css'),
  baseConfig('./src/styles/themes/theme-m2.scss', '../dist/css/themes/theme-m2.css'),
  baseConfig('./src/styles/themes/theme-m3-green.scss', '../dist/css/themes/theme-m3-green.css'),
  baseConfig('./src/styles/themes/theme-pastel.scss', '../dist/css/themes/theme-pastel.css'),
  baseConfig('./src/styles/themes/theme-ai.scss', '../dist/css/themes/theme-ai.css'),
  baseConfig('./src/styles/themes/theme-cyberpunk.scss', '../dist/css/themes/theme-cyberpunk.css'),
];

const umdConfig = {
  external: dependencies,
  input: './src/index.umd.ts',
  output: {
    file: '../dist/index.umd.js',
    format: 'umd',
    name: 'TimepickerUI',
    exports: 'default',
    sourcemap: false,
  },
  plugins: [
    peerDepsExternal(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production'), preventAssignment: true }),
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    nodeResolve({
      jsnext: true,
      main: true,
    }),
    importAsString({
      include: ['**/*.svg'],
      exclude: ['**/*.test.*'],
    }),
    typescript({
      tsconfig: './tsconfig.prod.json',
      declaration: false,
      declarationDir: undefined,
      outDir: undefined,
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};

export default [...scssConfigs, umdConfig];
