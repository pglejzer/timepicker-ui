# System Architecture

## Overview

`timepicker-ui` is a client-side library organized around a **composition pattern** with an **event-driven manager layer** and a **registry-based plugin system**. The public `TimepickerUI` class holds no business logic itself — it composes three collaborating objects that share a single state bag and a typed event bus by reference. Managers never call each other directly; all coordination flows through shared `CoreState` and the `EventEmitter`.

## Architecture Pattern

**Pattern**: Composition + event-driven manager layer + plugin registry.

`TimepickerUI` (public API) composes:

```
TimepickerUI
├── CoreState   — state bag: degrees, options, DOM refs, flags, getters/setters
├── Managers    — creates and owns all 8 built-in managers + plugin managers
└── Lifecycle   — init / mount / unmount / destroy orchestration
```

All three receive the **same** `CoreState` instance and `EventEmitter<TimepickerEventMap>` by reference — this shared state plus the emitter is the primary coupling mechanism. A static `instanceRegistry` (`Map<string, TimepickerUI>`) backs `getById()`, `getAllInstances()`, and `destroyAll()`.

Every manager follows one contract: constructor `(core: CoreState, emitter: EventEmitter)`, exposes `destroy()`, single responsibility.

## System Structure

### Public API / Composition core
- **Location**: `app/src/timepicker/`
- **Purpose**: Public class and its three composed collaborators; lifecycle callbacks and `setValue` logic.
- **Key Files**: `TimepickerUI.ts`, `CoreState.ts`, `Managers.ts`, `Lifecycle.ts`, `LifecycleCallbacks.ts`, `SetValue.ts`

### Built-in managers
- **Location**: `app/src/managers/`
- **Purpose**: Eight single-responsibility managers — AnimationManager, ModalManager, ConfigManager, ThemeManager, ValidationManager, EventManager, ClockManager, ClearButtonManager.
- **Key Files**: `AnimationManager.ts`, `ModalManager.ts`, `ConfigManager.ts` (+ `config/` handlers), `ThemeManager.ts`, `ValidationManager.ts`, `EventManager.ts` (+ `events/` handlers), `ClearButtonManager.ts`

### Clock subsystem (layered)
- **Location**: `app/src/managers/clock/`
- **Purpose**: Analog clock split into clean layers — pure math, orchestration, DOM rendering, and interaction.
  - `engine/` — pure math, no DOM: `AngleEngine`, `ClockEngine`, `HourEngine`, `MinuteEngine`
  - `controller/` — `ClockController` orchestrates engine + renderer
  - `renderer/` — `ClockRenderer` renders clock-face tips to the DOM
  - `handlers/` — `ClockEventHandler`, `ClockStyleHandler`, `ClockTimeHandler`, `ClockSystemInitializer`, `DragHandlers`

### Plugin system
- **Location**: `app/src/core/PluginRegistry.ts`, `app/src/plugins/`, `app/src/managers/plugins/`
- **Purpose**: Registry pattern for optional, tree-shakeable features. A `Plugin` is a plain object (`name`, `factory`, optional `optionsExtender` / `templateProvider` / `clearHandler`). Registered once at startup; `Managers` iterates `PluginRegistry.getAll()`, instantiates each factory, and stores managers in a `Map`, accessed via `managers.getPlugin<T>(name)`.
- **Key Files**: `plugins/range.ts` → `managers/plugins/range/`, `plugins/timezone.ts` → `managers/plugins/timezone/`, `plugins/wheel.ts` → `managers/plugins/wheel/`

### Shared utilities & types
- **Location**: `app/src/utils/`, `app/src/types/`, `app/src/constants/`
- **Purpose**: `EventEmitter`, option merge/validation (`utils/options/`), time parsing (`utils/time/`), template generation (`utils/template/`), accessibility helpers; grouped option type definitions; centralized `TIMINGS` constants.
- **Key Files**: `utils/EventEmitter.ts`, `utils/options/`, `utils/time/parse.ts`, `utils/template/`, `types/options.d.ts`, `constants/timings.ts`

### Styles
- **Location**: `app/src/styles/`
- **Purpose**: SCSS source for core styles and 10 standalone themes, compiled to CSS by rollup.
- **Key Files**: `index.scss`, `main.scss`, `variables.scss`, `_mixins.scss`, `themes/`

## Data Flow

1. **Construction** — `new TimepickerUI(selector, options)` creates `CoreState`, `Managers`, and `Lifecycle`, all sharing one `CoreState` and `EventEmitter`.
2. **Options merge** — `mergeOptions()` (`utils/options/`) normalizes grouped options (`clock`, `ui`, `labels`, `behavior`, `callbacks`, `timezone`, `range`, `clearBehavior`, `wheel`) into `CoreState`.
3. **Init / open** — `Lifecycle` orchestrates DOM creation (ModalManager), theming (ThemeManager), event binding (EventManager), and clock/wheel rendering (ClockManager / wheel plugin).
4. **Interaction** — DOM events captured by EventManager / clock handlers emit internal events (`select:hour`, `select:minute`, `confirm`, `cancel`, etc.) on the bus.
5. **Coordination** — managers react to events and read/write `CoreState`; they never reference each other directly.
6. **Callback bridge** — `Lifecycle.setupCallbackBridge()` wires user `callbacks.*` options to internal events (e.g. `callbacks.onConfirm` → `emitter.on('confirm', …)`). Managers do not call user callbacks directly.
7. **Destroy** — `Lifecycle` tears down listeners and DOM; each manager's `destroy()` is invoked; the instance is removed from `instanceRegistry`.

### Key internal events
- Lifecycle: `show`, `open`, `cancel`, `confirm`, `clear`
- Clock selection: `select:hour`, `select:minute`, `select:am`, `select:pm`
- Range: `range:confirm`, `range:switch`, `range:validation`
- Timezone: `timezone:change`
- Wheel: `wheel:scroll:start`, `wheel:scroll:end`
- Animation: `animation:clock`, `animation:start`, `animation:end`
- `error` — missing plugin or validation errors

## External Integrations

None at runtime — zero-dependency and framework-agnostic. The library only touches the host page's DOM. SSR safety is preserved by avoiding bare `window`/`document` access at module top level.

## Database Schema

Not applicable — no persistence layer.

## Configuration

- User configuration is passed as grouped options to the constructor / `update()` and merged via `mergeOptions()`.
- Animation and delay timing is centralized in `app/src/constants/timings.ts` (`TIMINGS`) — never hardcoded in managers.
- Build configuration: `tsup.config.ts` (JS), `rollup.config.js` (CSS + `.d.ts`), `webpack.config.js` (dev server), plus `tsconfig.*.json` variants.

## Deployment Architecture

- **Library**: built by tsup + rollup into `dist/` (ESM + CJS bundles, `.d.ts` declarations, standalone CSS themes) and published to npm.
- **Docs site**: separate Next.js 16 app in `docs-app/`, deployed on Vercel — independent of the library's build.

---
*Based on codebase analysis performed 2026-06-08*
