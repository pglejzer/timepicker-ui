import { defineConfig, type UserConfig } from 'tsdown';

type EntrySpec = {
  name: string;
  source: string;
  umdSource: string;
  globalName: string;
  exports: 'default' | 'named';
};

const entries: EntrySpec[] = [
  {
    name: 'index',
    source: 'src/index.ts',
    umdSource: 'src/index.umd.ts',
    globalName: 'TimepickerUI',
    exports: 'default',
  },
  {
    name: 'plugins/range',
    source: 'src/range.ts',
    umdSource: 'src/range.ts',
    globalName: 'TimepickerUIRange',
    exports: 'named',
  },
  {
    name: 'plugins/timezone',
    source: 'src/timezone.ts',
    umdSource: 'src/timezone.ts',
    globalName: 'TimepickerUITimezone',
    exports: 'named',
  },
  {
    name: 'plugins/wheel',
    source: 'src/wheel.ts',
    umdSource: 'src/wheel.ts',
    globalName: 'TimepickerUIWheel',
    exports: 'named',
  },
];

const shared: UserConfig = {
  platform: 'browser',
  target: 'es2022',
  minify: true,
  sourcemap: false,
  hash: false,
  fixedExtension: false,
  tsconfig: './tsconfig.prod.json',
  loader: { '.svg': 'text' },
  outDir: '../dist',
  clean: false,
};

const moduleConfig = ({ name, source }: EntrySpec): UserConfig => ({
  ...shared,
  entry: { [name]: source },
  format: ['esm', 'cjs'],
  dts: false,
});

const umdConfig = ({ name, umdSource, globalName, exports }: EntrySpec): UserConfig => ({
  ...shared,
  entry: { [name]: umdSource },
  format: 'umd',
  globalName,
  dts: false,
  outputOptions: { exports },
});

const declarationsConfig: UserConfig = {
  ...shared,
  entry: { index: 'src/index.ts' },
  format: 'esm',
  dts: { emitDtsOnly: true, tsconfig: './tsconfig.prod.json' },
  copy: ['range', 'timezone', 'wheel'].map((plugin) => ({
    from: `src/plugins/${plugin}.d.ts`,
    to: '../dist/plugins',
  })),
};

export default defineConfig([
  ...entries.map(moduleConfig),
  ...entries.map(umdConfig),
  declarationsConfig,
]);
