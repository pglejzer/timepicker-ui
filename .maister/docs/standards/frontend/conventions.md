# Code Conventions

### Centralized Timing Constants
All animation/delay/timeout durations come from the `TIMINGS` object in `app/src/constants/timings.ts` — never hardcode a timeout or transition duration inline. Sources: code, docs.

### File Naming: PascalCase Classes, camelCase Utilities
File names match their primary export: PascalCase for files exporting a class (managers, engines, state, controllers — e.g. `AngleEngine.ts`, `CoreState.ts`), camelCase/lowercase for utility/function modules and barrels (`parse.ts`, `predicates.ts`, `node.ts`, `index.ts`). Source: code (~84% consistency).

### Relative Imports in src (No `@/` Alias)
Source files (`app/src/`) use RELATIVE import paths, never the `@/` alias — the alias exists only for tests. Split type-only imports with `import type`. Verified: 0 of ~90 src files use `@/`. Source: code.

### Synchronous, Guard-Based Code
The library is fully synchronous (no `async/await` in src). Prefer early-return guards (`if (this.core.isDestroyed) return;`, null checks, optional chaining) over exceptions; reserve `try/catch` for fail-safe boundaries (init, setValue, timezone formatting) that recover. Emit user-facing `error` events only from dedicated spots. Source: code.
