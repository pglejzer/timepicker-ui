# Build Pipeline & Packaging

### Three-Tool Pipeline (tsup / rollup / webpack)
tsup compiles TS to ESM+CJS (minified, ES2022); rollup does SCSS→CSS and TS→.d.ts; webpack is dev-server-only and never part of the prod build. `npm run build:prod` chains eslint → tsup → rollup. `dist/` is generated output — never hand-edit it. Sources: config, docs.

### Tree-Shakeable Multi-Entry Bundle
Four entry points (index + plugins/range, plugins/timezone, plugins/wheel), `splitting: false`, SVGs loaded as text. `package.json` `exports` separates plugin paths and `sideEffects` lists only CSS, so unused plugins/JS are tree-shaken. When adding a new plugin/public entry, update tsup entries, the .d.ts job, and package.json exports in sync. Sources: config, docs.

### Standardized Script Naming
Scripts follow `build:*` (tsup/rollup/prod/...) and `test:*` (unit/watch/coverage/ci/...) prefix patterns. Source: config.
