# /verify — impact map

Apply to every changed file (paths from the repo root). Tags are a union; `@smoke` is always
added. A file matches at most one row per table — the first matching row wins.

## §1 Library and demo → tags

| Changed path (glob) | Tags |
|---|---|
| `app/src/managers/clock/**`, `app/src/managers/ClockManager.ts` | `@clock @seconds` |
| `app/src/managers/plugins/wheel/**`, `app/src/plugins/wheel.ts`, `app/src/wheel.ts`, `app/src/utils/template/wheel.ts` | `@wheel @seconds` |
| `app/src/managers/plugins/range/**`, `app/src/plugins/range.ts`, `app/src/range.ts` | `@range` |
| `app/src/managers/plugins/timezone/**`, `app/src/plugins/timezone.ts`, `app/src/timezone.ts`, `app/src/utils/timezone/**` | `@timezone` |
| `app/src/core/PluginRegistry.ts` | `@wheel @range @timezone` |
| `app/src/managers/EventManager.ts`, `app/src/managers/events/**`, `app/src/utils/accessibility/**` | `@keyboard @modal` |
| `app/src/managers/ModalManager.ts`, `app/src/managers/AnimationManager.ts` | `@modal` |
| `app/src/constants/timings.ts` | `@modal @wheel` |
| `app/src/managers/ValidationManager.ts`, `app/src/managers/config/DisabledTimeHandler.ts`, `app/src/utils/validation/**` | `@disabled` |
| `app/src/managers/ClearButtonManager.ts` | `@clear` |
| `app/src/managers/config/MobileViewHandler.ts` | `@mobile` |
| `app/src/managers/ConfigManager.ts`, `app/src/managers/config/**` | `@clock @api @mobile` |
| `app/src/managers/ThemeManager.ts` | `@themes` |
| `app/src/utils/template/index.ts`, `app/src/utils/ripple.ts` | `@clock @modal @seconds` |
| `app/src/utils/time/**`, `app/src/utils/input/**` | `@clock @wheel @api @seconds` |
| `app/src/timepicker/**`, `app/src/utils/**`, `app/src/managers/index.ts`, `app/src/index.ts`, `app/src/index.umd.ts` | `@api` |
| `app/src/styles/themes/theme-<X>.scss` | `@theme:<X>` |
| `app/src/styles/main.scss`, `index.scss`, `variables.scss` | `@themes` |
| `app/src/styles/partials/_wheel.scss` | `@wheel` + style rule |
| `app/src/styles/partials/_range.scss` | `@range` + style rule |
| `app/src/styles/partials/_timezone.scss` | `@timezone` + style rule |
| `app/src/styles/partials/_clock.scss`, `_am-pm.scss`, `_header.scss`, `_time-inputs.scss` | `@clock @seconds` + style rule |
| `app/src/styles/partials/_modal.scss`, `_body.scss`, `_wrapper.scss`, `_footer.scss`, `_buttons.scss` | `@modal` + style rule |
| `app/src/styles/partials/**` (other) | `@smoke` + style rule |
| `app/src/types/**` | none (types only) |
| `app/docs/examples/themes.ts`, `app/docs/partials/basic-themes.html` | `@themes` |
| `app/docs/examples/blueprint.ts`, `app/docs/partials/blueprint.html` | `@theme:blueprint @theme:blueprint-dark` |
| `app/docs/examples/wheel.ts`, `hide-footer.ts`, `features.ts`; `app/docs/partials/wheel.html`, `hide-footer.html`, `popover-features.html` | `@wheel` |
| `app/docs/examples/range-themes.ts`, `app/docs/partials/range.html` | `@range` |
| `app/docs/examples/timezone-themes.ts`, `timezone-advanced.ts`; `app/docs/partials/timezone-api.html` | `@timezone` |
| `app/docs/examples/disabled.ts`, `app/docs/partials/disabled.html` | `@disabled` |
| `app/docs/examples/clear-button.ts`, `app/docs/partials/advanced-clear.html` | `@clear` |
| `app/docs/examples/api-demo.ts` | `@api` |
| `app/docs/examples/seconds.ts`, `app/docs/partials/seconds.html` | `@seconds` |
| `app/docs/**` (other: `index.*`, `setup.ts`, `basic.ts`, `style.css`, `theme-custom.css`) | `@smoke` |
| `app/webpack.config.js` | `@smoke` (lib target) |
| `app/package.json`, `app/tsup.config.ts`, `app/rollup.config.js`, `package.json` | `@smoke` (lib + docs targets) |
| `app/tests/**`, `**/*.md`, `.claude/**`, `docs/**`, `bench/**`, `mcp-server/**`, `.verify/**`, `.gitignore` | none (no browser impact) |

**Style rule:** a tag selected because of a `styles/partials` file also runs its theme variants
(scenarios.md "Theme variants").

## §2 Tag → docs routes (first picker on the page)

| Tag | Routes |
|---|---|
| `@clock` | `/examples/basic/12h-format`, `/examples/basic/24h-format` |
| `@wheel` | `/examples/plugins/wheel` |
| `@range` | `/examples/plugins/range` |
| `@timezone` | `/examples/plugins/timezone` |
| `@disabled` | `/examples/features/disabled-time` |
| `@clear` | `/examples/features/clear-button` |
| `@mobile` | `/examples/features/mobile` |
| `@keyboard` | `/examples/features/focus-trap` |
| `@modal` | `/examples/basic/backdrop` |
| `@api` | none (covered by the library demo) |
| `@seconds` | `/examples/features/seconds`, `/docs/features/seconds` |
| `@themes` | `/examples/themes/basic`, `/examples/themes/dark` |
| `@theme:<X>` | `/examples/themes/<X>`; name exceptions: `m2` → `material-2`, `m3-green` → `material-3` |
| `@smoke` | `/react/examples/basic/getting-started` — only when the docs target is active for another reason |

## §3 docs-app → routes

| Changed path | Routes |
|---|---|
| `docs-app/app/(site)/page.tsx` | `/` |
| `docs-app/app/(site)/examples/advanced/external-api/**` | `/examples/advanced/external-api` — load + errors only, no SHOT (live network data) |
| `docs-app/app/(site)/<route>/**` | `/<route>` |
| `docs-app/components/**`, `docs-app/lib/**`, `docs-app/app/layout.tsx`, `docs-app/app/(site)/layout.tsx`, `docs-app/app/globals.css`, `docs-app/public/**`, `docs-app/next.config.ts`, `docs-app/package.json` | key routes |
| `docs-app/**` (other) | key routes |

**Key routes:** `/`, `/docs/quick-start`, `/examples/basic/getting-started`, `/react/examples/basic/getting-started`.

## §4 Rules

- No row matches → the file goes to UNCOVERED: read its diff, choose tags yourself, propose a row in the report.
- Targets: `lib` when any file is under `app/src/**` or `app/docs/**` (or a row says lib target);
  `docs` when any file is under `docs-app/**`, a selected tag (other than `@smoke`) has §2 routes,
  or a row says docs target.
- No target at all → `@smoke` on lib, after phase only.
