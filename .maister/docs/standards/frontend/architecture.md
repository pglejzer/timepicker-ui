# Core Architecture Standards

These rules preserve the composition pattern and the manager/plugin contracts. They are the heart of the codebase — follow them when extending the core.

### Composition Pattern (No Business Logic in TimepickerUI)
`TimepickerUI` (public API) holds no business logic. It composes `CoreState` (state bag), `Managers` (owns the 8 managers + plugin managers), and `Lifecycle` (init/mount/unmount/destroy), all sharing ONE `CoreState` and ONE `EventEmitter<TimepickerEventMap>` by reference. Business logic lives in managers, orchestration in Lifecycle, state in CoreState. Sources: docs (code-corroborated).

### Manager Contract
Every manager and plugin manager: constructor `(core: CoreState, emitter: EventEmitter<TimepickerEventMap>)`, stores both, exposes `destroy()` that tears down its own listeners/timeouts, single responsibility. Verified across all 8 built-ins + 3 plugin managers. Sources: code, docs.

### Communicate Only via CoreState and the Event Bus
Managers never reference each other directly. Cross-cutting behavior goes through shared `CoreState` or a new namespaced event on the `EventEmitter` bus — never a direct manager→manager call. Subscriptions register cleanup (often via the `bindEmitter` helper pushing into a `cleanupHandlers` array) and are torn down in `destroy()`. Event namespaces: lifecycle, clock selection (`select:*`), `range:*`, `timezone:*`, `wheel:*`, `animation:*`, `error`. Sources: code, docs.

### User Callbacks Go Through the Callback Bridge
User-facing `callbacks.*` options are wired to internal events via `Lifecycle.setupCallbackBridge()`. Do not call user callbacks directly from managers; add new ones at the bridge. Source: docs.

### Public API Stability
The public API (`create/open/close/destroy/getValue/setValue/update/on/once/off`) and statics (`getById/getAllInstances/isAvailable/destroyAll`) are a promise — don't change signatures or the `getValue()` shape without flagging a breaking change. Keep `instanceRegistry` consistent (register on create, remove on destroy). Source: docs.

### Grouped Options (v4) + mergeOptions
Options are grouped (`clock, ui, labels, behavior, callbacks, timezone, range, clearBehavior, wheel`) in `app/src/types/options.d.ts` and merged via `mergeOptions()` in `app/src/utils/options/`. A new option needs: a type in its group, a default in the merge, and a consumer. Source: docs.

### Plugins Stay Tree-Shakeable
Core code must NEVER statically import a plugin, and cross-plugin imports are forbidden — plugins communicate via CoreState + namespaced events. A user who doesn't import a plugin must not pay for its code. Emit `error` when a required plugin is missing. Sources: docs (config-corroborated by the multi-entry build).

### Default Export per Manager; Named Exports Elsewhere
NOTE — this documents actual code, which diverges from older docs that said "no default exports except TimepickerUI". In practice: class-based managers (the 8 built-ins + 3 plugin managers) use `export default` and are re-aggregated through barrels with `export { default as X }`. `TimepickerUI` is also a default export (the package's public default). Everything else — utils, engines, CoreState, Lifecycle, controllers, types, plugin definitions — uses NAMED exports. Sources: code (17 `export default`: 11 managers + TimepickerUI re-exports + entry barrels), docs (drift noted).
