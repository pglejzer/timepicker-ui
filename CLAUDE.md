# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Standards & Conventions

The index at @.maister/docs/INDEX.md lists the project's coding standards and conventions:
- Coding standards organized by domain (frontend, backend, testing, etc.)
- Project vision, tech stack, and architecture decisions

Follow standards in `.maister/docs/standards/` when writing code — they represent team decisions. If standards conflict with the task, ask the user.

### Standards Evolution

When you notice recurring patterns, fixes, or conventions during implementation that aren't yet captured in standards — suggest adding them. Examples:
- A bug fix reveals a pattern that should be standardized (e.g., "always validate X before Y")
- PR review feedback identifies a convention the team wants enforced
- The same type of fix is needed across multiple files
- A new library/pattern is adopted that should be documented

When this happens, briefly suggest the standard to the user. If approved, invoke `/maister:standards-update` with the identified pattern.

## Maister Workflows

This project uses the maister plugin for structured development workflows. When any `/maister:*` command is invoked, execute it via the Skill tool immediately — do not skip workflows for "straightforward" tasks. The user chose the workflow intentionally; complexity assessment is the workflow's job.

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
   (`build:*`, `tsup`, `rollup`, `next build`), lint / ESLint, tests / Jest (not even one focused
   spec), typecheck / `tsc`, dev servers (`npm run start`, `next dev`), browsers or browser MCP,
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

## What This Is

`timepicker-ui` — a zero-dependency, framework-agnostic time picker library (v4.5.0). Supports analog clock, scroll wheel, and compact-wheel UI modes. SSR-safe. Published to npm as `timepicker-ui`. Three optional plugins (range, timezone, wheel) are tree-shaken out unless imported. 12 built-in CSS themes.

## Repository Layout

```
app/                    ← ALL source, build, and test work happens here
  src/
    timepicker/         ← main class: TimepickerUI, CoreState, Managers, Lifecycle
    managers/           ← 8 built-in managers (see Architecture below)
      clock/            ← ClockManager internals: engine/, controller/, renderer/, handlers/
      config/           ← ConfigManager internals: DisabledTimeHandler, InputValueHandler, MobileViewHandler
      events/           ← EventManager internals: ButtonHandlers, InputHandlers, KeyboardHandlers, ModalHandlers
      plugins/          ← plugin managers: range/, timezone/, wheel/
    core/               ← PluginRegistry (plugin system)
    plugins/            ← plugin definitions (RangePlugin, TimezonePlugin, WheelPlugin)
    utils/              ← EventEmitter, accessibility/, config/, errors/, input/, options/ (mergeOptions), template/, time/, timezone/, validation/, variables/
    types/              ← TypeScript interfaces (.d.ts files): options, types, images
    constants/          ← timings.ts (animation/delay constants)
    styles/             ← SCSS: index.scss, main.scss, variables.scss, partials/, themes/
  tests/
    unit/               ← mirrors src/ structure
    __mocks__/          ← CSS and SVG mock stubs for Jest
  tsup.config.ts        ← JS build config (ESM + CJS → ../dist/)
  rollup.config.js      ← CSS themes + .d.ts declarations (→ ../dist/css/, ../dist/)
  webpack.config.js     ← dev server only
  jest.config.ts        ← test config
  tsconfig.json         ← dev tsconfig
  tsconfig.prod.json    ← production tsconfig (used by tsup)
  tsconfig.test.json    ← test tsconfig
dist/                   ← generated output, never edit
docs-app/               ← Next.js 16 documentation site (deployed on Vercel)
```

## Commands

**All commands run from the `app/` directory.**

```bash
cd app

# Dev server
npm run start                           # webpack dev server

# Lint
npm run eslint                          # ESLint only (src/**/*.ts)
npm run lint                            # lint-staged + pretty-quick (for staged files)

# Build
npm run build:prod                      # eslint → tsup → rollup (full production build)
npm run build:tsup                      # JS only (ESM + CJS)
npm run build:rollup                    # CSS themes + .d.ts declarations only

# Test
npm test                                # all tests (Jest)
npm run test:unit                       # tests/unit/** only
npm run test:watch                      # watch mode
npm run test:coverage                   # with coverage
npm run test:verbose                    # verbose output
npm run test:ci                         # CI mode (--ci --coverage --maxWorkers=2)

# Single test file
npx jest tests/unit/managers/ClockManager.test.ts

# Single test by name
npx jest -t "should rotate clock hand"

# Tests matching a pattern
npx jest --testPathPatterns="clock"
```

### Docs app (separate project)

```bash
cd docs-app
npm run dev                             # Next.js dev server
npm run build                           # Next.js build
```

## Architecture

Composition (TimepickerUI / CoreState / Managers / Lifecycle), the manager contract and the
8 built-in managers, the clock layers, the plugin system, the event bus and the option groups
are in `.claude/rules/architecture.md` §1-5, which loads in every session. The sections below
cover what that file does not.

### Build pipeline

1. **tsup** (`app/tsup.config.ts`) — compiles TypeScript → ESM (`.js`) + CJS (`.cjs`), minified, target ES2022. Four entry points: `index`, `plugins/range`, `plugins/timezone`, `plugins/wheel`. Output goes to `../dist/`. SVG files are loaded as text strings.
2. **rollup** (`app/rollup.config.js`) — two jobs:
   - SCSS → CSS: compiles `app/src/styles/` to `dist/css/` (index.css, main.css, 11 theme files)
   - TypeScript → `.d.ts`: generates declaration bundles via `rollup-plugin-dts`
3. **webpack** (`app/webpack.config.js`) — only for the local dev server (`npm run start`), not used in production build.

### CSS and theming

- `main.css` — core styles required for all modes
- `index.css` — includes main.css + all themes (largest bundle)
- Theme files are standalone: `theme-dark.css`, `theme-crane.css`, `theme-m3-green.css`, etc.
- SCSS source: `app/src/styles/` with tokens in `variables.scss`, component rules in `partials/` (the focus-ring mixin is in `partials/_accessibility.scss`)
- Available themes: basic, crane, crane-straight, m2, m3-green, dark, glassmorphic, pastel, ai, cyberpunk, blueprint, blueprint-dark
- CSS class prefix: `tp-ui-` (e.g., `tp-ui-wrapper`, `tp-ui-clock-face`, `tp-ui-range-from`)

### DOM structure

`TimepickerUI` accepts an `<input>` or an element that contains one. An element becomes the `.tp-ui` root itself (so `data-open` buttons inside it open the picker); a bare `<input>` reuses a `.tp-ui` parent or is wrapped in a new `<div class="tp-ui">`. The modal is created dynamically on open and removed on close. Template HTML is generated in `app/src/utils/template/` — the wheel template is separate (`template/wheel.ts`).

### Testing conventions

- Jest + ts-jest, jsdom environment
- CSS imports mocked → `app/tests/__mocks__/styleMock.ts`
- SVG imports mocked → `app/tests/__mocks__/svgMock.ts`
- Path alias: `@/` → `app/src/`
- Test files mirror source structure: `tests/unit/managers/ClockManager.test.ts` tests `src/managers/ClockManager.ts`
- Coverage configured for `src/**/*.ts` excluding `.d.ts`, `types/`, `styles/`
- Test timeout: 10 seconds
- Some test files have `.edge.test.ts` suffix for edge-case focused tests

### Timing constants

All animation/delay values are centralized in `app/src/constants/timings.ts` (`TIMINGS` object). When changing animation behavior, modify these constants rather than hardcoding timeouts.

## Subagents & rules

This repo ships scoped subagents in `.claude/agents/` and rule files in `.claude/rules/`:
`architecture.md` is always loaded (composition pattern, manager contract, plugin system,
event flow, options, working agreement); `accessibility`, `build-release`, `clock`,
`docs-app`, `plugins`, `styling`, `testing` and `writing` (READMEs, changelog, docs text)
load when matching files are touched.
CLAUDE.md wins on any conflict.

### Orchestration directive (mandatory)

When a task touches code under one of the scopes below, delegate it to the matching
subagent (Agent tool) - each agent carries its area's contract - unless it is one of the
exceptions listed after the routing. Routing is by path:

- `app/src/timepicker/`, `app/src/core/`, `app/src/utils/`, `app/src/types/`, non-clock `app/src/managers/` → `core-architect`
- `app/src/managers/clock/` → `clock-engine-dev`
- `app/src/plugins/`, `app/src/managers/plugins/`, `app/src/core/PluginRegistry.ts` → `plugin-dev`
- `app/src/styles/`, CSS job in `app/rollup.config.js` → `styling-themes`
- `app/tests/` → `test-engineer`
- build configs, `app/package.json`, `dist/`, version bump / changelog / release → `build-release`
- `docs-app/` → `docs-site` (general work) / `seo-optimizer` (SEO) / `docs-accessibility` (a11y)

**Cross-cutting agents** (not pinned to one path — scoped by concern):
- `accessibility` — a11y of the **library** (`app/src`): ARIA, keyboard, focus, screen-reader,
  labels. Adds a11y semantics across managers/clock/plugins/templates; flags deep structural or
  logic changes to the owning agent, and CSS contrast/focus-ring to `styling-themes`.
- `docs-accessibility` — a11y of the **docs site** (`docs-app/`).
- `seo-optimizer` — SEO of the **docs site** (`docs-app/`): metadata, sitemap/robots/manifest,
  Open Graph, JSON-LD.

Rules for delegation:
- **One agent per scope.** A task spanning multiple scopes is split into per-scope
  subtasks and dispatched to each owner; the owning agent flags cross-scope needs
  rather than reaching over.
- **You stay the orchestrator.** Gather context, decide routing, hand the agent a
  precise brief, integrate its report, and run the final verification once, at the end.
  Outside the exceptions below, don't do the agent's in-scope edits yourself.
- **Exceptions (do it directly, no delegation):** read-only exploration; the user
  explicitly says to edit directly; small, contained edits - one file, roughly up to 30
  changed lines - where the area's rule file (it loads when you touch those files) carries
  the contract, since a cold agent start costs more than it saves; or work outside every
  scope above (e.g. `.claude/`, root configs).

### Custom skills (audit → approve → apply orchestrators)

These `.claude/skills/` skills drive the agents above through a gated flow (audit read-only →
user approval → apply → verify). They never run git/publish — they propose, the user executes.

- `/release` → `build-release` — cut a release (version bump, README, CHANGELOG.md, docs-app
  changelog/what's-new). The library changelog records **library** changes only; docs-app's own
  changes are never logged or versioned.
- `/docs-seo` → `seo-optimizer` — audit/fix docs-site SEO.
- `/a11y` → `accessibility` — audit/fix **library** accessibility.
- `/docs-a11y` → `docs-accessibility` — audit/fix docs-site accessibility.
- `/verify` (main agent only) — start before/after test servers (library demo + docs-app sandbox
  built against the local library) and check in the browser, via chrome-devtools MCP (fallback
  Playwright MCP), only what the change could break. Runs at the end of tasks that change library
  behavior / styles or docs-app pages (quick profile; `--full` before a release); not for demo
  examples or micro changes (HARD RULES §5).

Shared working agreement baked into every agent (see `.claude/rules/architecture.md` §6):
CRLF line endings, git is the user's job (no commit/push), subagents never run anything (HARD RULES; no per-task
build/test/lint/servers/review — the main agent verifies once at the end, incl. `/verify` when §5 calls for it), local only, zero-dependency
and SSR-safe. **Don't break a theme's visual identity / Material Design 3** (no `font-weight: 700`
or strikethrough as state cues — MD3 uses state layers / tonal containers / opacity).

## Coding Conventions

- ESLint with `typescript-eslint` recommended rules + Prettier
- `linebreak-style: windows` enforced
- `@typescript-eslint/no-explicit-any: off` — `any` is permitted
- `no-nested-ternary: error` — no nested ternaries
- Unused vars checked but rest siblings ignored
- Default exports only for `TimepickerUI` (the package default) and each manager class (the 8 built-ins and the plugin managers); everything else uses named exports
- **No code comments** in `app/src` — let code self-document. The only acceptable comments are doc-comments on TypeScript options/public types (e.g. JSDoc in `types/options.d.ts`)

## Public API

```typescript
const picker = new TimepickerUI(selectorOrElement, options?);
picker.create();                          // initialize and render
picker.open(callback?);                   // open modal
picker.close(update?, callback?);         // close modal
picker.destroy(options?);                 // clean up
picker.getValue();                        // { hour, minutes, type?, time, degreesHours, degreesMinutes }
picker.setValue(time, updateInput?);       // set time programmatically ("14:30" or "2:30 PM")
picker.update({ options, create? });      // update options at runtime
picker.on(event, handler);                // subscribe to event
picker.once(event, handler);              // subscribe once
picker.off(event, handler?);              // unsubscribe

// Static methods
TimepickerUI.getById(id);                 // get instance by custom ID
TimepickerUI.getAllInstances();            // all live instances
TimepickerUI.isAvailable(selector);       // check if element exists
TimepickerUI.destroyAll();                // destroy all instances
```
