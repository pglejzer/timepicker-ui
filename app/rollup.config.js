import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import cleanup from 'rollup-plugin-cleanup';

const { dependencies } = Object.keys(require('./package.json'));
const tsconfigDefaults = { compilerOptions: { declaration: true } };
const tsconfigOverride = { compilerOptions: { declaration: false } };

const plugins = [
  peerDepsExternal(),
  replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
  typescript({
    tsconfigDefaults,
    tsconfig: './tsconfig.prod.json',
    tsconfigOverride,
  }),
  nodeResolve({
    jsnext: true,
    main: true,
  }),
  commonjs({
    include: 'node_modules/**',
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
  }),
  postcss({
    extract: false,
  }),
  terser({
    output: {
      comments: false,
    },
  }),
  cleanup(),
];

export default [
  {
    external: dependencies,
    input: './src/index.ts',
    plugins,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
      {
        file: '../dist/timepicker-ui.umd.js',
        format: 'umd',
        name: 'tui',
      },
    ],
  },
  {
    input: './src/index.d.ts',
    output: [{ file: '../dist/types/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
