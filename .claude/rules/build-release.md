---
paths:
  - "app/tsup.config.ts"
  - "app/rollup.config.js"
  - "app/webpack.config.js"
  - "app/package.json"
  - "package.json"
---

# Build & release rules

Applies to build configs and the package manifests. Pairs with `.claude/rules/architecture.md`.

- **Three tools, three jobs:** `tsup` -> ESM + CJS (minified, ES2022, 4 entries: `index`,
  `plugins/range`, `plugins/timezone`, `plugins/wheel`); `rollup` -> SCSS->CSS + `.d.ts`;
  `webpack` is dev-server only, never in the prod build. `build:prod` = eslint -> tsup -> rollup.
- **`dist/` is generated - never hand-edit it.** Change configs, not artifacts.
- **`package.json` is the public contract:** keep `exports`, `main`/`module`/`types`, `files`,
  `sideEffects` (CSS only) accurate. A new plugin/public entry must be added to tsup entries, the
  `.d.ts` job, and `exports` **in sync**. Editing `exports`/`sideEffects`/`version` is
  release-affecting - call it out.
- **Versioning:** the **root `package.json` `version` is the source of truth**. `app/package.json`
  (1.0.0) is the dev workspace - do NOT bump it to the public version without confirmation.
  `docs-app/package.json` versions the docs site, not the library - a release NEVER bumps it.
- No new runtime dependencies (zero-dependency promise); dev/build deps must be justified.
- Never run `npm publish` or git write ops - propose the version, tag (`vX.Y.Z`), and commit
  message; the user executes. Full release flow (README + CHANGELOG + docs-app) is the `/release`
  skill / `build-release` agent.
