---
paths:
  - "app/tsdown.config.ts"
  - "app/vite.config.ts"
  - "app/vite-plugin-*.ts"
  - "app/tsconfig.node.json"
  - "app/package.json"
  - "package.json"
---

# Build & release rules

Applies to build configs and the package manifests. Pairs with `.claude/rules/architecture.md`.

- **Three tools, three jobs:** `tsdown` (`app/tsdown.config.ts`) -> ESM + CJS + UMD
  (minified, ES2022, SVG loaded as text) and the core `dist/index.d.ts`; one config per entry
  (`index`, `plugins/range`, `plugins/timezone`, `plugins/wheel`) so plugin bundles stay
  standalone with no shared chunks; the plugin `.d.ts` files are copied unchanged from the
  hand-written `src/plugins/*.d.ts`. The `sass` CLI (`build:css`) -> `dist/css/main.css`,
  `index.css` = main + all themes, `themes/*.css`. `Vite` (`app/vite.config.ts`) -> demo dev
  server (`npm run start`) and `build:demo`, never part of `build:prod`.
  `build:prod` = eslint -> build:js -> build:css.
- **The `dist/` layout is flat and public:** `index.{js,cjs,umd.js,d.ts}`,
  `plugins/{range,timezone,wheel}.{js,cjs,umd.js,d.ts}`, `css/`. Renaming or moving a file there
  is a breaking change.
- **UMD globals:** the core UMD sets `window.TimepickerUI` (the class, with a static
  `PluginRegistry` from `src/index.umd.ts`); the plugin UMDs set `TimepickerUIRange`,
  `TimepickerUITimezone` and `TimepickerUIWheel`. A `<script>` user registers with
  `TimepickerUI.PluginRegistry.register(TimepickerUIRange.RangePlugin)`. Keep both sides in sync.
- **`dist/` is generated - never hand-edit it.** Change configs, not artifacts.
- **`package.json` is the public contract:** keep `exports`, `main`/`module`/`types`, `files`,
  `sideEffects` (CSS only) accurate. A new plugin/public entry must be added to tsdown entries, the
  `.d.ts` copy, and `exports` **in sync**. Editing `exports`/`sideEffects`/`version` is
  release-affecting - call it out.
- **Versioning:** the **root `package.json` `version` is the source of truth**. `app/package.json`
  (1.0.0) is the dev workspace - do NOT bump it to the public version without confirmation.
  `docs-app/package.json` versions the docs site, not the library - a release NEVER bumps it.
- No new runtime dependencies (zero-dependency promise); dev/build deps must be justified.
- Never run `npm publish` or git write ops - propose the version, tag (`X.Y.Z`), and commit
  message; the user executes.
- **Publishing runs on GitHub:** `.github/workflows/publish.yml` (npm trusted publishing, no
  token). A published GitHub release whose tag is the root version (`4.7.0` or `v4.7.0`)
  installs, runs `build:prod` and the tests, then runs `npm publish`. A version with a `-` goes to
  the `next` dist-tag. A manual run of the workflow is only a dry run. The MCP server has its own
  `.github/workflows/publish-mcp.yml`: a release tagged `mcp-<version>` (e.g. `mcp-2.2.0`) checks
  that `mcp-server/package.json` and `server.json` agree, builds, runs the smoke test, publishes
  `timepicker-ui-mcp` to npm, waits up to 30 minutes until npm serves the version (npm's automated
  review delays it), then publishes to the MCP Registry. A re-run skips the npm publish when the
  version is already on npm. `publish.yml` skips `mcp-` tags. Full release flow (README + CHANGELOG + docs-app) is the `/release`
  skill / `build-release` agent.
