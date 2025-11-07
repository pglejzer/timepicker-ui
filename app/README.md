# Timepicker-UI — Build System

This directory contains the build configuration for the `timepicker-ui` library. It supports multiple build tools including Webpack, Rollup, and Tsup, covering development and production workflows.

---

## 📦 Installation

```bash
npm install
```

---

## 🧪 Scripts

| Script                  | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `npm run dev`           | Start Webpack development server for demo/docs        |
| `npm run build:prod`    | Full production build using Tsup + Rollup             |
| `npm run build:tsup`    | Compile JS (ESM + CJS) and type declarations via Tsup |
| `npm run build:rollup`  | Compile SCSS to CSS (themes & base styles)            |
| `npm run build:webpack` | Build demo/docs with Webpack                          |
| `npm run build:vercel`  | Build demo for Vercel deployment (custom Webpack)     |
| `npm test`              | Run unit tests using Jest                             |
| `npm run lint`          | Lint and format staged files                          |
| `npm run eslint`        | Lint all TypeScript source files                      |
| `npm run format`        | Format codebase using Prettier (via lint-staged)      |

---

## 🧱 Build Output

Compiled output is placed in `../dist/` and includes:

- JavaScript bundles: ESM, CJS, and UMD (with `terser` minification)
- TypeScript declarations (`*.d.ts`)
- Compiled CSS files from SCSS (main + themes)
- Demo HTML (via Webpack build)

---

## 🎨 Output Themes

SCSS themes compiled to CSS in `../dist/css/themes/`:

- `theme-dark.css`
- `theme-pastel.css`
- `theme-glassmorphic.css`
- `theme-cyberpunk.css`
- `theme-crane.css`
- `theme-m3.css`
- `theme-ai.css`

---

## 🔧 Tools Used

- [**Tsup**](https://tsup.egoist.dev/) — Bundles JS (ESM + CJS) and types
- [**Rollup**](https://rollupjs.org/) — Stylesheet compilation, UMD bundle
- [**Webpack**](https://webpack.js.org/) — Dev server and docs bundler
- [**TypeScript**](https://www.typescriptlang.org/) — Typed library code
- [**Sass**](https://sass-lang.com/) — Modular styling with themes
- [**PostCSS**](https://postcss.org/) — Autoprefixing, CSS minification
- [**Jest**](https://jestjs.io/) — Unit testing
- [**ESLint**](https://eslint.org/), [**Prettier**](https://prettier.io/) — Linting & formatting
- [**Husky**](https://typicode.github.io/husky/), **lint-staged** — Git pre-commit hooks

---

## 📁 Build Structure

```
/build
├── webpack.config.js       # Webpack config (demo/docs)
├── rollup.config.js        # SCSS and UMD bundling
├── tsup.config.ts          # TS → JS + types
└── package.json            # Scripts and dependencies
```

---

## 👤 Author

Created by [@pglejzer](https://github.com/pglejzer)

---

## 📄 License

[MIT](../LICENSE)
