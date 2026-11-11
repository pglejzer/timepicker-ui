# CLAUDE.md

Guidance for Claude Code in this repository. Area rules live in `.claude/rules/` and load when
matching files are touched; `.claude/rules/architecture.md` loads in every session. CLAUDE.md wins
on any conflict.

## Standards and workflows

- Team standards: `.maister/docs/standards/` (index: `.maister/docs/INDEX.md`). Read the ones for
  the area you edit. If a standard conflicts with the task, ask the user.
- When a fix or review reveals a recurring pattern that no standard covers, suggest it to the user;
  if approved, run `/maister:standards-update`.
- Any `/maister:*` command runs through the Skill tool at once, whatever the task's size.

## HARD RULES — local only, subagents only write code

These bind the main session, every subagent (`.claude/agents/*`, `general-purpose`, `Explore`,
workflow agents, any `Agent`/`Task` dispatch) and every skill. They override any agent or skill
text that says otherwise.

1. **Local only.** Never run anything that publishes, deploys or changes remote state:
   `npm publish` / `unpublish` / `deprecate` / `dist-tag` / `version` / `login` / `adduser` /
   `token` / `owner` / `access`, `vercel` (any deploy), `git push` or remote tags, `gh` write
   operations (`release`, `pr create`, `pr merge`, ...). Releases are proposed; the user runs them.
   Local work in the main session is fine: `npm pack`, builds, dev servers, tests.
2. **Subagents only read and edit files.** A subagent never runs: git of any kind, builds
   (`build:*`, `tsdown`, `sass`, `vite build`, `next build`), lint / ESLint, tests / Jest (not even
   one focused spec), typecheck / `tsc`, dev servers (`npm run start` / `vite`, `next dev`), browsers or browser MCP,
   `/verify`, tooling audits (axe, Lighthouse), spec review or code review. It reports which
   commands, specs and routes the main agent should run. A subagent's claim that it ran any of
   these is untrusted — ignore it. Project agents (`.claude/agents/`) have no Bash tool at all;
   files they create with Write come out LF and the main agent converts them to CRLF at the end.
3. **Verification and review belong to the main agent, once, at the end** — never per task,
   never inside a subagent: focused or full Jest, `eslint`, builds, `/verify`, and any spec or
   code review (do not dispatch review subagents). This includes plugin workflows (maister,
   superpowers): their test-runner / verifier / reviewer subagents are not used here — the main
   agent does that work itself.
4. **Dispatch contract.** Every subagent prompt starts with: "Read `CLAUDE.md` in the repo root
   first and obey its HARD RULES." and names the `.claude/rules/*.md` file(s) for the area it edits.
5. **End-of-task browser verification, only where a change can break something.** When a task
   changed library behavior or styles in `app/src/`, or pages / components in `docs-app/`, the
   main agent runs `/verify` after the owning agents have reported and before handing back to
   the user - the quick profile by default, `/verify --full` before a release or when the user
   asks. `/verify` is heavy, so it does NOT run for small, contained changes: new or edited
   demo examples in `app/docs/`, copy / typo / comment edits, one-line fixes, `.claude/` or docs
   work. For those the main agent checks only what changed in the dev server (open the section,
   click through it, look at console errors) and says so in the report. Run `/verify` anyway
   when the user asks for it; skip it when the user says so.
6. **Git — read-only, and only in the main agent.** Subagents never run git of any kind (not
   even `status` / `diff`). The main agent may read (`status`, `diff`, `log`, `show`,
   `ls-files`, `rev-parse`, `archive` into `.verify/`, `diff --no-index`) but never mutates the
   repository — `add`, `commit`, `push`, `checkout`, `switch`, `branch`, `merge`, `rebase`,
   `reset`, `restore`, `stash`, `tag`, `clean`, `cherry-pick`, `worktree`, `rm`, `mv` — unless
   the user explicitly asks for that one operation; an earlier approval never covers later runs.
   The default end state of any task or plan: files edited, nothing staged, nothing committed,
   user informed — the user commits manually.
7. **Packages are the user's job.** Never run `npm install` / `npm ci` / `npm uninstall` /
   `npm update` / `npm audit fix` (in any folder, including the `.verify/` sandboxes) and never
   edit `dependencies` / `devDependencies`. When `node_modules` is missing or a package is
   needed, propose the exact command and wait for the user to run it (supply-chain risk:
   install scripts and transitive dependencies run with your privileges).

## What this is

`timepicker-ui` is a zero-dependency, framework-agnostic, SSR-safe time picker published to npm.
UI modes: analog clock (with a keyboard view), wheel and compact-wheel. Optional plugins (range,
timezone, wheel) are tree-shaken out unless imported. 12 built-in CSS themes. The version lives in
the root `package.json` only.

## Where things live

| Path | What | Rule file |
|---|---|---|
| `app/src/timepicker/` | `TimepickerUI`, `CoreState`, `Managers`, `Lifecycle` | `architecture.md` |
| `app/src/managers/` | built-in managers; `clock/` is the layered clock | `architecture.md`, `clock.md` |
| `app/src/plugins/`, `app/src/managers/plugins/`, `app/src/core/` | plugins and `PluginRegistry` | `plugins.md` |
| `app/src/utils/`, `app/src/types/`, `app/src/constants/` | shared utils, option and event types, `TIMINGS` | `architecture.md` |
| `app/src/utils/template/` | modal HTML (`wheel.ts` for the wheel modes) | `accessibility.md` |
| `app/src/styles/` | SCSS: `main`, `index` (main + all themes), `themes/`, `partials/`, `variables.scss` | `styling.md` |
| `app/tests/` | Jest specs mirroring `src/` | `testing.md` |
| `app/docs/` | local library demo for the dev server | — |
| `app/tsdown.config.ts`, `app/vite.config.ts`, `app/vite-plugin-*.ts`, `app/package.json`, root `package.json` | build, demo server and the npm contract | `build-release.md` |
| `dist/` | generated output, never edit | `build-release.md` |
| `docs-app/` | separate Next.js 16 docs site | `docs-app.md` |
| READMEs, `CHANGELOG.md`, docs text | user-facing writing | `writing.md` |

`TimepickerUI` accepts an `<input>` or an element that contains one. An element becomes the `.tp-ui`
root itself (so `data-open` buttons inside it open the picker); a bare `<input>` reuses a `.tp-ui`
parent or is wrapped in a new `<div class="tp-ui">`. The modal is created on open and removed on close.

## Commands

All library commands run from `app/`.

```bash
npm run start                     # Vite dev server for the demo in app/docs (port 8010)
npm run eslint                    # ESLint (src/**/*.ts)
npm run build:prod                # eslint, then build:js and build:css into ../dist
npm run build:js                  # tsdown: ESM, CJS, UMD and index.d.ts (cleans ../dist first)
npm run build:css                 # sass CLI: dist/css/main.css, index.css, themes/
npm run build:demo                # vite build of the demo into app/dist (gitignored)
npm test                          # all Jest specs
npx jest tests/unit/managers/ClockManager.test.ts   # one file
npx jest -t "should rotate clock hand"              # one test by name
npx jest --testPathPatterns="clock"                 # by path pattern
./node_modules/.bin/tsc --noEmit --project tsconfig.prod.json   # typecheck (the guard hook blocks `npx ... -p`)
```

The build steps and the `dist/` contract are in `.claude/rules/build-release.md`.

Docs site, from `docs-app/`: `npm run dev`, `npm run build`.

## Subagents and routing

Project agents live in `.claude/agents/` and run on Sonnet (`model: sonnet`). Pass
`model: "opus"` only for the hardest tasks (tricky state/logic, wide cross-file refactors, hard
debugging, shared building blocks other agents depend on) and say why in the brief. Give agents
the facts they need in the brief so they don't spend tokens rediscovering configs.

### Orchestration directive (mandatory)

When a task touches code under one of the scopes below, delegate it to the matching subagent
(Agent tool), unless it is one of the exceptions further down. Routing is by path:

- `app/src/timepicker/`, `app/src/core/`, `app/src/utils/`, `app/src/types/`, non-clock `app/src/managers/` → `core-architect`
- `app/src/managers/clock/` → `clock-engine-dev`
- `app/src/plugins/`, `app/src/managers/plugins/`, `app/src/core/PluginRegistry.ts` → `plugin-dev`
- `app/src/styles/` and the CSS build → `styling-themes`
- `app/tests/` → `test-engineer`
- build configs, `app/package.json`, `dist/`, version bump / changelog / release → `build-release`
- `docs-app/` → `docs-site` (general work) / `seo-optimizer` (SEO) / `docs-accessibility` (a11y)

Cross-cutting agents, scoped by concern:
- `accessibility` — a11y of the **library** (`app/src`): ARIA, keyboard, focus, screen reader,
  labels. Flags deep logic changes to the owning agent, and contrast / focus rings to `styling-themes`.
- `docs-accessibility` — a11y of `docs-app/`.
- `seo-optimizer` — SEO of `docs-app/`: metadata, sitemap / robots / manifest, Open Graph, JSON-LD.

Rules for delegation:
- **One agent per scope.** A task spanning several scopes is split into per-scope subtasks; the
  owning agent flags cross-scope needs rather than reaching over.
- **You stay the orchestrator.** Gather context, decide routing, hand the agent a precise brief,
  integrate its report, and run the final verification once, at the end.
- **Exceptions (do it directly):** read-only exploration; the user says to edit directly; small,
  contained edits (one file, roughly up to 30 changed lines) where the area's rule file carries
  the contract; work outside every scope above (e.g. `.claude/`, root configs).

### Skills

Gated flows (audit read-only → user approval → apply → verify). They never run git or publish.
- `/release` → `build-release`: version bump, README, `CHANGELOG.md`, docs-app changelog and
  what's-new. User-run only. The library changelog records library changes only.
- `/docs-seo` → `seo-optimizer`; `/a11y` → `accessibility`; `/docs-a11y` → `docs-accessibility`.
- `/verify` (main agent only): before/after servers (library demo + docs-app sandbox built against
  the local library), checked in the browser through chrome-devtools MCP (fallback Playwright MCP).
  When it runs: HARD RULES §5.

## Coding conventions

- ESLint (`typescript-eslint` recommended) + Prettier (single quotes, semicolons, trailing commas,
  print width 110, CRLF). `linebreak-style: windows` is enforced on `src/**/*.ts`.
- **No `any`** (owner rule, stricter than ESLint, which leaves `no-explicit-any` off): use
  `unknown`, generics or real types.
- No nested ternaries (`no-nested-ternary: error`). Unused vars are errors (rest siblings ignored).
- Default exports only for `TimepickerUI` and each manager class (built-in and plugin managers);
  named exports everywhere else.
- **No code comments** in `app/src`. The only allowed comments are doc-comments on public types
  and options (e.g. JSDoc in `types/options.d.ts`).
- Timings only from `TIMINGS` (`app/src/constants/timings.ts`); visible and AT text only from `labels`.

## Public API

Source of truth: `app/src/timepicker/TimepickerUI.ts` (JSDoc on every method), option types in
`app/src/types/options.d.ts`, event payloads in `app/src/types/types.d.ts` and the map in
`app/src/utils/EventEmitter.ts`.

```typescript
const picker = new TimepickerUI(selectorOrElement, options?);
picker.create(); picker.open(callback?); picker.close(update?, callback?); picker.destroy(options?);
picker.getValue(); picker.setValue(time, updateInput?);
picker.update({ options, create? }); picker.setOptions(options);
picker.setView('clock' | 'keyboard'); picker.getView(); picker.clear();
picker.refreshDisabledTime(); picker.getElement();
picker.setRange(range, updateInput?); picker.getRange(); picker.setActivePart(part); // range plugin
picker.getActivePart(); picker.setRangeCaptions(captions);                        // range plugin
picker.on(event, handler); picker.once(event, handler); picker.off(event, handler?);

TimepickerUI.getById(id); TimepickerUI.getAllInstances();
TimepickerUI.isAvailable(selector); TimepickerUI.destroyAll();

import { parseTime, formatTime, createDisabledTimeCheck } from 'timepicker-ui';  // no picker needed
```
