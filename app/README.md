# timepicker-ui — Build & Development

> Source, build, and test workspace for the `timepicker-ui` library.

This directory (`app/`) holds all source, build, and test work for `timepicker-ui` — a zero-dependency, framework-agnostic, SSR-safe time picker. This README is for **contributors working on the library itself**. If you just want to install and use the package, read the [published package README](../README.md) and the [`timepicker-ui` npm page](https://www.npmjs.com/package/timepicker-ui).

The build pipeline uses three tools, each with a distinct job: **Tsup** compiles the JavaScript bundles, **Rollup** compiles the CSS themes, the UMD bundles, and the TypeScript declarations, and **Webpack** runs the local development/demo server only. Compiled artifacts are written to `../dist/`, which is generated output and must never be hand-edited.

## 📑 Table of Contents

- [Prerequisites](#-prerequisites)
- [Install](#-install)
- [Scripts](#-scripts)
- [Build Pipeline & Output](#-build-pipeline--output)
- [Output Themes](#-output-themes)
- [Project Structure](#-project-structure)
- [Tools](#-tools)
- [Contributing](#-contributing)
- [Maintainer](#-maintainer)
- [License](#-license)

## 🧰 Prerequisites

- **Node.js** — `app/package.json` does not declare an `engines` field, so no version is enforced. A minimum of **Node 18+** is recommended (inferred from the toolchain: `@types/node` 24, ESLint 9, Jest 30, and ESM-only configs). Node 20+ or 22 LTS is the safest choice.
- **npm** — used for dependency management and all scripts (a `package-lock.json` is committed).

> All commands below are run from the `app/` directory.

## 📦 Install

```bash
cd app
npm install
```

## 🧪 Scripts

All scripts are defined in `app/package.json` and run from `app/`.

### Development

| Script              | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `npm run start`     | Start the Webpack dev server for the demo (port `8005`)  |

### Build

| Script                  | Description                                                      |
| ----------------------- | --------------------------------------------------------------- |
| `npm run build:prod`    | Full production build: `eslint` → `build:tsup` → `build:rollup` |
| `npm run build:tsup`    | Compile JS bundles (ESM + CJS) for the 4 entry points via Tsup  |
| `npm run build:rollup`  | Compile SCSS → CSS, the UMD bundles, and `.d.ts` declarations   |
| `npm run build:webpack` | Run a one-off Webpack build of the demo                         |
| `npm run build:vercel`  | Build the demo for Vercel deployment (Webpack)                  |

### Test

| Script                     | Description                                            |
| -------------------------- | ----------------------------------------------------- |
| `npm test`                 | Run the full Jest test suite                          |
| `npm run test:unit`        | Run unit tests (`tests/unit`)                         |
| `npm run test:integration` | Run integration tests (`tests/integration`)           |
| `npm run test:e2e`         | Run end-to-end tests (`tests/e2e`)                    |
| `npm run test:watch`       | Run Jest in watch mode                                |
| `npm run test:coverage`    | Run tests with coverage reporting                     |
| `npm run test:verbose`     | Run tests with verbose output                         |
| `npm run test:ci`          | Run tests in CI mode (`--ci --coverage --maxWorkers=2`) |

> The active test suite lives in `tests/unit`. The `test:integration` and `test:e2e` scripts are wired in `package.json` but their `tests/integration` / `tests/e2e` directories are not present yet, so they currently match no specs.

### Lint

| Script           | Description                                              |
| ---------------- | ------------------------------------------------------- |
| `npm run eslint` | Lint all TypeScript source files (`./src/**/*.ts`)      |
| `npm run lint`   | Lint and format staged files (`lint-staged` + `pretty-quick`) |

## 🏗 Build Pipeline & Output

Three tools, three jobs — Webpack is **never** part of the production build:

- **Tsup** (`tsup.config.ts`) — compiles TypeScript to **ESM** (`*.js`) and **CJS** (`*.cjs`) bundles, minified, target **ES2022**, for four tree-shakeable entry points: `index`, `plugins/range`, `plugins/timezone`, and `plugins/wheel`. SVG assets are inlined as text strings.
- **Rollup** (`rollup.config.js`) — three outputs:
  - **CSS** — compiles SCSS in `src/styles/` to `dist/css/` (`index.css`, `main.css`, and the per-theme files in `dist/css/themes/`), minified.
  - **UMD bundles** (`*.umd.js`) — `index.umd.js` plus one per plugin (`plugins/range.umd.js`, `plugins/timezone.umd.js`, `plugins/wheel.umd.js`), transpiled with Babel and minified with Terser, for direct `<script>` / CommonJS consumption.
  - **TypeScript declarations** (`*.d.ts`) — bundled per entry point via `rollup-plugin-dts`.
- **Webpack** (`webpack.config.js`) — local dev/demo server only (`npm run start`).

`build:prod` runs `eslint` → `build:tsup` → `build:rollup`. All artifacts land in `../dist/`, which is generated output and must never be hand-edited.

The four entry points map directly to the `exports` field in `app/package.json`, keeping the tree-shakeable surface in sync with what consumers import.

## 🎨 Output Themes

SCSS themes are compiled to CSS in `../dist/css/themes/` (authoritative list from the Rollup CSS job — **11 themes**):

- `theme-crane.css`
- `theme-crane-straight.css`
- `theme-dark.css`
- `theme-glassmorphic.css`
- `theme-m2.css`
- `theme-m3-green.css`
- `theme-pastel.css`
- `theme-ai.css`
- `theme-cyberpunk.css`
- `theme-blueprint.css`
- `theme-blueprint-dark.css`

Alongside the themes, Rollup also emits the base stylesheets `dist/css/index.css` (core + default theme) and `dist/css/main.css` (core styles only).

## 📁 Project Structure

```
app/
├── src/                  # Library source (TS + SCSS)
│   ├── constants/        # Timing/delay constants
│   ├── core/             # PluginRegistry (plugin system)
│   ├── managers/         # Built-in managers + clock/ + plugins/
│   ├── plugins/          # Plugin definitions (range, timezone, wheel)
│   ├── styles/           # SCSS: variables, mixins, themes/
│   ├── timepicker/       # TimepickerUI, CoreState, Managers, Lifecycle
│   ├── types/            # TypeScript interfaces (.d.ts)
│   └── utils/            # EventEmitter, options, template, time, validation
├── tests/                # Jest tests
│   ├── unit/             # Unit specs (mirror src/)
│   └── __mocks__/        # CSS/SVG mock stubs
├── docs/                 # Local demo served by the Webpack dev server
├── assets/               # Static assets
├── tsup.config.ts        # JS bundles → ESM + CJS (4 entry points)
├── rollup.config.js      # SCSS → CSS, UMD bundles, .d.ts declarations
├── webpack.config.js     # Dev/demo server only
├── jest.config.ts        # Test config
├── eslint.config.js      # ESLint flat config
├── tailwind.config.js    # Tailwind config (demo)
├── tsconfig.json         # Dev tsconfig
├── tsconfig.prod.json    # Production tsconfig (used by Tsup/Rollup)
├── tsconfig.test.json    # Test tsconfig
└── package.json          # Build workspace scripts and dependencies
```

> `dist/`, `coverage/`, and `node_modules/` are generated and not tracked as source.

## 🔧 Tools

- [**Tsup**](https://tsup.egoist.dev/) — bundles JS (ESM + CJS) for the four entry points
- [**Rollup**](https://rollupjs.org/) — compiles SCSS → CSS, the UMD bundles, and `.d.ts` declarations
- [**Webpack**](https://webpack.js.org/) — local dev/demo server only (`npm run start`)
- [**TypeScript**](https://www.typescriptlang.org/) — typed library source
- [**Sass**](https://sass-lang.com/) — modular styling and themes
- [**PostCSS**](https://postcss.org/) + [**Autoprefixer**](https://github.com/postcss/autoprefixer) — vendor prefixing and CSS minification (via `rollup-plugin-postcss`)
- [**Babel**](https://babeljs.io/) + [**Terser**](https://terser.org/) — transpilation and minification of the UMD bundles
- [**Jest**](https://jestjs.io/) (with `ts-jest`, jsdom) — unit testing
- [**ESLint**](https://eslint.org/) + [**Prettier**](https://prettier.io/) — linting and formatting
- [**Husky**](https://typicode.github.io/husky/) + **lint-staged** — git pre-commit hooks

## 🤝 Contributing

Contributions are welcome. There is no separate `CONTRIBUTING.md`; the essentials are:

- **Questions, bugs, and feature requests** — open an issue at [github.com/pglejzer/timepicker-ui/issues](https://github.com/pglejzer/timepicker-ui/issues).
- **Pull requests** are welcome. Before opening one, please make sure your changes pass linting and tests:
  ```bash
  cd app
  npm run eslint
  npm test
  ```
- **Line endings** — all source files use **CRLF** (`linebreak-style: windows` is enforced by ESLint on `src/**/*.ts`).

## 👤 Maintainer

[@pglejzer](https://github.com/pglejzer)

## 📄 License

[MIT](../LICENSE)
