# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`timepicker-ui` — a zero-dependency, framework-agnostic time picker library (v4.3.0). Supports analog clock, scroll wheel, and compact-wheel UI modes. SSR-safe. Published to npm as `timepicker-ui`. Three optional plugins (range, timezone, wheel) are tree-shaken out unless imported. 10 built-in CSS themes.

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
    utils/              ← EventEmitter, accessibility/, config/, debounce/, input/, template/, time/, validation/
    types/              ← TypeScript interfaces (.d.ts files): options, types, ITimepickerUI, images
    constants/          ← timings.ts (animation/delay constants)
    styles/             ← SCSS: index.scss, main.scss, variables.scss, _mixins.scss, themes/
  tests/
    unit/               ← mirrors src/ structure (80+ test files)
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
npx jest --testPathPattern="clock"
```

### Docs app (separate project)

```bash
cd docs-app
npm run dev                             # Next.js dev server
npm run build                           # Next.js build
```

## Architecture

### Composition pattern — TimepickerUI

`TimepickerUI` (the public API class) does not contain business logic itself. It composes three internal objects:

```
TimepickerUI
├── CoreState      — state bag (degrees, options, DOM refs, flags, getters/setters)
├── Managers       — creates and owns all 8 managers + plugin managers
└── Lifecycle      — init/mount/unmount/destroy orchestration
```

All three receive the same `CoreState` instance and `EventEmitter<TimepickerEventMap>` by reference. This is the primary coupling mechanism — managers never reference each other directly, they communicate through state and events.

A static `instanceRegistry` (Map<string, TimepickerUI>) tracks all live instances, enabling `TimepickerUI.getById()`, `getAllInstances()`, `destroyAll()`.

### Manager layer

Each manager follows the same contract: constructor receives `(core: CoreState, emitter: EventEmitter)`, and exposes `destroy()`. Managers are single-responsibility:

| Manager | What it does |
|---|---|
| `AnimationManager` | CSS transition classes on open/close (uses `TIMINGS` constants) |
| `ModalManager` | DOM creation/removal of the picker modal, backdrop, scrollbar lock |
| `ConfigManager` | Merges runtime options, handles disabled time, mobile detection, input value sync |
| `ThemeManager` | Applies theme CSS classes (`basic`, `crane`, `dark`, etc.) to wrapper and modal |
| `ValidationManager` | Disabled hours/minutes/intervals, error display |
| `EventManager` | DOM event binding: click, touch, drag, keyboard, focus trap, backdrop dismiss |
| `ClockManager` | Clock face initialization, hand rotation, hour/minute tip rendering |
| `ClearButtonManager` | Clear button visibility, click handling, plugin clear delegation |

### ClockManager internals

The clock subsystem has its own layered architecture under `app/src/managers/clock/`:

- **`engine/`** — pure math: `AngleEngine` (degree calculations), `ClockEngine` (coordinate math), `HourEngine` / `MinuteEngine` (tip generation)
- **`controller/`** — `ClockController` orchestrates engine + renderer
- **`renderer/`** — `ClockRenderer` handles DOM rendering of clock face tips
- **`handlers/`** — `ClockEventHandler` (click/drag events), `ClockStyleHandler` (CSS), `ClockTimeHandler` (time selection logic), `ClockSystemInitializer` (startup), `DragHandlers` (mouse/touch drag)

### Plugin system

Plugins use a registry pattern. Each plugin is a plain object implementing the `Plugin` interface:

```typescript
interface Plugin {
  name: string;
  factory: (core: CoreState, emitter: EventEmitter) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
  templateProvider?: (options, instanceId) => string;
  clearHandler?: (core, emitter) => void;
}
```

Registration happens once at app startup (`PluginRegistry.register(RangePlugin)`). When `Managers` is constructed, it iterates `PluginRegistry.getAll()` and instantiates each plugin's factory. Plugin managers are stored in a `Map<string, PluginManager>` and accessed via `managers.getPlugin<T>('range')`.

**Built-in plugins:**
- **Range** (`app/src/plugins/range.ts` → `app/src/managers/plugins/range/`) — start/end time selection with tab UI
- **Timezone** (`app/src/plugins/timezone.ts` → `app/src/managers/plugins/timezone/`) — timezone dropdown with keyboard navigation
- **Wheel** (`app/src/plugins/wheel.ts` → `app/src/managers/plugins/wheel/`) — scroll wheel UI mode, drag handling, popover support

### Event flow

`EventEmitter<TimepickerEventMap>` is the internal bus. All internal communication goes through it. Key events:

- `show`, `open`, `cancel`, `confirm`, `clear` — lifecycle
- `select:hour`, `select:minute`, `select:am`, `select:pm` — clock selection
- `range:confirm`, `range:switch`, `range:validation` — range plugin
- `timezone:change` — timezone plugin
- `wheel:scroll:start`, `wheel:scroll:end` — wheel plugin
- `animation:clock`, `animation:start`, `animation:end` — animation coordination
- `error` — missing plugin or validation errors

The `Lifecycle.setupCallbackBridge()` method wires user-provided `callbacks.*` options to internal events (e.g., `callbacks.onConfirm` → `emitter.on('confirm', ...)`).

### Options structure (v4.0.0+, breaking change from v3)

Options are organized into logical groups. Types are defined in `app/src/types/options.d.ts`:

- `clock` — type (12h/24h), increments, disabledTime, currentTime, smoothHourSnap
- `ui` — theme, mode (clock/wheel/compact-wheel), animation, backdrop, mobile, editable, inline, clearButton, cssClass
- `labels` — all UI text (am, pm, ok, cancel, time, etc.)
- `behavior` — focusTrap, focusInputAfterClose, delayHandler, id
- `callbacks` — onConfirm, onCancel, onOpen, onUpdate, onSelectHour, etc.
- `timezone` — timezone plugin config
- `range` — range plugin config
- `clearBehavior` — clear button config
- `wheel` — placement, hideFooter, commitOnScroll, hideDisabled, ignoreOutsideClick

Options are merged via `mergeOptions()` in `app/src/utils/options/`.

### Build pipeline

1. **tsup** (`app/tsup.config.ts`) — compiles TypeScript → ESM (`.js`) + CJS (`.cjs`), minified, target ES2022. Four entry points: `index`, `plugins/range`, `plugins/timezone`, `plugins/wheel`. Output goes to `../dist/`. SVG files are loaded as text strings.
2. **rollup** (`app/rollup.config.js`) — two jobs:
   - SCSS → CSS: compiles `app/src/styles/` to `dist/css/` (index.css, main.css, 9 theme files)
   - TypeScript → `.d.ts`: generates declaration bundles via `rollup-plugin-dts`
3. **webpack** (`app/webpack.config.js`) — only for the local dev server (`npm run start`), not used in production build.

### CSS and theming

- `main.css` — core styles required for all modes
- `index.css` — includes main.css + default theme
- Theme files are standalone: `theme-dark.css`, `theme-crane.css`, `theme-m3-green.css`, etc.
- SCSS source: `app/src/styles/` with variables in `variables.scss`, mixins in `_mixins.scss`, effects in `_effects.scss`
- Available themes: basic, crane, crane-straight, m2, m3-green, dark, glassmorphic, pastel, ai, cyberpunk
- CSS class prefix: `tp-ui-` (e.g., `tp-ui-wrapper`, `tp-ui-clock-face`, `tp-ui-range-from`)

### DOM structure

`TimepickerUI` wraps the target `<input>` in a `<div class="tp-ui">` container. The modal is created dynamically on open and removed on close. Template HTML is generated in `app/src/utils/template/` — the wheel template is separate (`template/wheel.ts`).

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

## Coding Conventions

- ESLint with `typescript-eslint` recommended rules + Prettier
- `linebreak-style: windows` enforced
- `@typescript-eslint/no-explicit-any: off` — `any` is permitted
- `no-nested-ternary: error` — no nested ternaries
- Unused vars checked but rest siblings ignored
- No default exports except `TimepickerUI` itself (re-exported from `timepicker/index.ts`)

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
