# Build Pipeline & Packaging

### Three-Tool Pipeline (tsdown / sass / Vite)
tsdown compiles TS to ESM+CJS+UMD (minified, ES2022) and the core .d.ts, and copies the plugin .d.ts files; the sass CLI does SCSS→CSS; Vite is demo-only (dev server, `build:demo`) and never part of the prod build. `npm run build:prod` chains eslint → build:js → build:css. `dist/` is generated output — never hand-edit it. Sources: config, docs.

### Tree-Shakeable Multi-Entry Bundle
Four entry points (index + plugins/range, plugins/timezone, plugins/wheel), one tsdown config per entry (no shared chunks), SVGs loaded as text. `package.json` `exports` separates plugin paths and `sideEffects` lists only CSS, so unused plugins/JS are tree-shaken. When adding a new plugin/public entry, update the tsdown configs, the .d.ts copy, and package.json exports in sync. Sources: config, docs.

### Standardized Script Naming
Scripts follow `build:*` (js/css/prod/demo/...) and `test:*` (unit/watch/coverage/ci/...) prefix patterns. Source: config.
