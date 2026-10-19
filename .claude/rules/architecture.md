# architecture.md - timepicker-ui shared rules

The single source of truth every subagent reads before touching code. Pairs with
the root `CLAUDE.md` (full repo map + commands). When this file and `CLAUDE.md`
disagree, `CLAUDE.md` wins - flag the drift instead of silently following one.

`timepicker-ui` is a **zero-dependency, framework-agnostic, SSR-safe** time picker
(v4.6.0, published to npm). Analog clock, scroll wheel, and compact-wheel UI modes.
Three optional plugins (range, timezone, wheel) tree-shaken out unless imported.
12 built-in CSS themes. **All source/build/test work happens in `app/`.**

## 1. Composition pattern - TimepickerUI

`TimepickerUI` (public API) holds no business logic. It composes three objects, all
sharing the same `CoreState` instance and `EventEmitter<TimepickerEventMap>` by
reference:

- **CoreState** - state bag: degrees, options, DOM refs, flags, getters/setters.
- **Managers** - creates and owns all 8 managers + plugin managers.
- **Lifecycle** - init / mount / unmount / destroy orchestration.

Shared state + the emitter are the **primary coupling mechanism**. Managers never
reference each other directly - they communicate through `CoreState` and events.

A static `instanceRegistry` (`Map<string, TimepickerUI>`) backs `getById()`,
`getAllInstances()`, `destroyAll()`.

## 2. Manager contract

Every manager: constructor `(core: CoreState, emitter: EventEmitter)`, exposes
`destroy()`, single responsibility. The 8 built-ins:

| Manager | Responsibility |
|---|---|
| AnimationManager | open/close CSS transition classes (`TIMINGS` constants) |
| ModalManager | modal/backdrop DOM creation+removal, scrollbar lock |
| ConfigManager | merge options, disabled time, mobile detection, input value sync |
| ThemeManager | apply theme CSS classes to wrapper + modal |
| ValidationManager | disabled hours/minutes/intervals, error display |
| EventManager | DOM events: click, touch, drag, keyboard, focus trap, backdrop |
| ClockManager | clock face init, hand rotation, hour/minute tip rendering |
| ClearButtonManager | clear button visibility, click, plugin clear delegation |

**ClockManager internals** (`app/src/managers/clock/`) are layered - keep the layers
clean:
- `engine/` - **pure math, no DOM**: AngleEngine, ClockEngine, HourEngine, MinuteEngine
- `controller/` - ClockController orchestrates engine + renderer
- `renderer/` - ClockRenderer does DOM rendering of tips
- `handlers/` - ClockEventHandler, ClockStyleHandler, ClockTimeHandler,
  ClockSystemInitializer, DragHandlers

## 3. Plugin system

Registry pattern. A plugin is a plain object implementing `Plugin`:

```typescript
interface Plugin {
  name: string;
  factory: (core: CoreState, emitter: EventEmitter) => PluginManager;
  optionsExtender?: (options: Record<string, unknown>) => void;
  templateProvider?: (options, instanceId) => string;
  clearHandler?: (core, emitter) => void;
}
```

Register once at startup (`PluginRegistry.register(RangePlugin)`). `Managers`
iterates `PluginRegistry.getAll()`, instantiates each factory, stores managers in a
`Map<string, PluginManager>`, accessed via `managers.getPlugin<T>('range')`.

Built-ins: **range** (`plugins/range.ts` -> `managers/plugins/range/`), **timezone**
(`plugins/timezone.ts` -> `managers/plugins/timezone/`), **wheel** (`plugins/wheel.ts`
-> `managers/plugins/wheel/`). Plugins MUST stay tree-shakeable - no top-level import
of a plugin from core code.

## 4. Event flow

`EventEmitter<TimepickerEventMap>` is the internal bus; all internal communication
goes through it. Key events:

- Lifecycle: `show`, `open`, `cancel`, `confirm`, `clear`
- Clock selection: `select:hour`, `select:minute`, `select:second`, `select:am`, `select:pm`
- Range: `range:confirm`, `range:switch`, `range:validation`
- Timezone: `timezone:change`
- Wheel: `wheel:scroll:start`, `wheel:scroll:end`
- Animation: `animation:clock`, `animation:start`, `animation:end`
- `error` - missing plugin or validation errors

`setupCallbackBridge()` (`timepicker/LifecycleCallbacks.ts`) wires user `callbacks.*` options to internal events
(e.g. `callbacks.onConfirm` -> `emitter.on('confirm', ...)`). User-facing callbacks go
through this bridge - do not call user callbacks directly from managers.

## 5. Options structure (v4.0.0+)

Grouped, defined in `app/src/types/options.d.ts`, merged via `mergeOptions()` in
`app/src/utils/options/`:

- `clock` - type (12h/24h), incrementHours / incrementMinutes / incrementSeconds, showSeconds, autoSwitchToSeconds, disabledTime, currentTime, smoothHourSnap
- `ui` - theme, mode, animation, backdrop, mobile, editable, inline, clearButton, cssClass
- `labels` - all UI text
- `behavior` - focusTrap, focusInputAfterClose, delayHandler, id
- `callbacks` - onConfirm, onCancel, onOpen, onUpdate, onSelectHour, ...
- `timezone`, `range`, `clearBehavior`, `wheel` - plugin/feature config

All timing/delay values live in `app/src/constants/timings.ts` (`TIMINGS`). Change
animation behavior there, never hardcode timeouts.

## 6. Working agreement (applies to every agent)

- **CRLF line endings** on all new/edited files (library, `.claude/`, docs-app). ESLint enforces
  `linebreak-style: windows` on `src/**/*.ts`. Edit keeps CRLF; Write creates LF, so list every
  file you created in your report - the main agent converts them.
- **Git is the user's job** (HARD RULES in `CLAUDE.md`). Subagents run no git at all; the
  main agent only reads (`status`, `diff`, `log`, `show`, ...) and never adds, commits,
  pushes, branches, merges, resets, stashes or checks out without the user's explicit
  approval for that one operation. End state: nothing staged, nothing committed.
- **Packages are the user's job.** Never `npm install` / `ci` / `uninstall` / `update`;
  propose the command and wait for the user to run it.
- **Subagents never run anything** (HARD RULES in `CLAUDE.md`): no build / test / lint /
  typecheck / dev server / browser / `/verify` / review, no git. Verify changes by reading
  code and reasoning about them; report what you changed and which commands, specs and
  routes the main agent should run. The main agent runs all verification once, at the very
  end (including `/verify`, quick profile by default, when HARD RULES §5 calls for it - not for
  demo examples or micro changes); the user decides on commits.
- **Local only.** Never publish, deploy or push (`npm publish`, `vercel`, `git push`, ...).
- **Zero-dependency & SSR-safe.** No new runtime dependencies. No bare `window` /
  `document` access at module top level - guard for SSR.
- **Default exports** only for `TimepickerUI` and the manager classes (built-in and plugin
  managers); named exports everywhere else.
- **No nested ternaries** (`no-nested-ternary`). `any` is permitted but prefer types.
- **No code comments.** Don't add inline/explanatory comments in `app/src` - they clutter
  the source and the user doesn't want them. Let the code self-document (clear names,
  small functions). The ONLY acceptable comments are doc-comments on TypeScript
  options/public types (e.g. JSDoc on entries in `app/src/types/options.d.ts`). Don't add
  section/`/* ... */` banner comments; remove a comment only if it's clearly stale, and
  don't strip the existing option/type docs.
- **Don't break a theme's visual identity / Material Design 3.** No `font-weight: 700` or
  strikethrough as state cues - MD3 uses state layers / tonal containers / opacity (see
  the `styling-themes` agent for detail).
- Stay in your declared scope (see each agent's `description`). If a change needs to
  cross into another agent's territory, say so rather than reaching over.
