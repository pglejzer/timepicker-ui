# timepicker-ui: development

This folder has the library source, the build and the tests. If you just want to use the package, read the [main README](../README.md) instead.

## Setup

You need Node 20 (that's what CI runs) and npm.

```bash
cd app
npm install
npm run start     # demo on http://localhost:8010
```

All commands below run from `app/`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run start` | Webpack dev server with the demo, port 8010 |
| `npm run build:prod` | `eslint`, then `build:tsup`, then `build:rollup` |
| `npm run build:tsup` | ESM and CJS bundles |
| `npm run build:rollup` | CSS, UMD bundles and `.d.ts` files |
| `npm run build:webpack`, `npm run build:vercel` | Build the demo. Both run the same webpack config. |
| `npm test` | All Jest tests |
| `npm run test:unit` | Only `tests/unit` |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | With coverage |
| `npm run test:verbose` | Verbose output |
| `npm run test:ci` | `--ci --coverage --maxWorkers=2` |
| `npm run eslint` | Lint `src/**/*.ts` |
| `npm run lint` | lint-staged and pretty-quick on staged files |

`test:integration` and `test:e2e` are in `package.json` too, but `tests/integration` and `tests/e2e` don't exist yet, so they find nothing.

## How the build works

tsup (`tsup.config.ts`) builds the ESM (`.js`) and CJS (`.cjs`) bundles for four entry points: `index`, `plugins/range`, `plugins/timezone` and `plugins/wheel`. Output is minified, targets ES2022, and SVGs are inlined as strings.

Rollup (`rollup.config.js`) does the rest. It compiles the SCSS, builds the UMD bundles (`index.umd.js` and one per plugin, through Babel and Terser) and bundles the `.d.ts` files.

Webpack only runs the demo. It's not part of the production build.

Everything lands in `../dist/`. Don't edit files there, the next build overwrites them. The four entry points match the `exports` field in `package.json`, so if you add one, update both.

CSS output: `dist/css/main.css` has the core styles and the `basic` theme and is always required. Each other theme gets its own `dist/css/themes/theme-<name>.css` (11 of them). `dist/css/index.css` is `main.css` plus every theme in one file.

## Layout

```
app/
├── src/
│   ├── constants/        # timing and delay constants
│   ├── core/             # PluginRegistry
│   ├── managers/         # built-in managers, clock/, plugins/
│   ├── plugins/          # plugin definitions (range, timezone, wheel)
│   ├── styles/           # SCSS, themes/
│   ├── timepicker/       # TimepickerUI, CoreState, Managers, Lifecycle
│   ├── types/            # TypeScript interfaces (.d.ts)
│   └── utils/            # EventEmitter, options, template, time, validation
├── tests/
│   ├── unit/             # Jest specs, same structure as src/
│   └── __mocks__/        # CSS and SVG stubs
├── docs/                 # demo page for the dev server
├── assets/               # SVG icons
├── tsup.config.ts
├── rollup.config.js
├── webpack.config.js     # demo only
├── jest.config.ts
├── eslint.config.js
├── tailwind.config.js    # demo only
├── tsconfig.json         # dev
├── tsconfig.prod.json    # production build
└── tsconfig.test.json    # tests
```

`coverage/`, `node_modules/` and `../dist/` are generated.

Tests run on Jest with ts-jest and jsdom. Formatting is Prettier, linting is ESLint with typescript-eslint.

## Before you open a PR

```bash
npm run eslint
npm test
```

Source files use CRLF line endings. ESLint fails on LF in `src/`, and `.gitattributes` converts files on checkout.

Bugs and questions go to [GitHub issues](https://github.com/pglejzer/timepicker-ui/issues).

## License

[MIT](../LICENSE). Maintained by [@pglejzer](https://github.com/pglejzer).
