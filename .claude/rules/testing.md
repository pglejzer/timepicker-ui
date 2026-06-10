---
paths:
  - "app/tests/**/*.ts"
---

# Testing rules

Applies when working in `app/tests/`. Pairs with `.claude/rules/architecture.md`.

- **Jest + ts-jest on jsdom.** `isolatedModules`, 10s timeout. CSS imports resolve to
  `tests/__mocks__/styleMock.ts`, SVG to `svgMock.ts` - rely on those, don't hand-roll
  style/SVG mocks. Shared setup in `tests/setup.ts` (jest-dom matchers).
- **Mirror the source tree.** `src/managers/ClockManager.ts` -> `tests/unit/managers/ClockManager.test.ts`.
  Edge-case-heavy suites use the `.edge.test.ts` suffix. Tests may use the `@/` alias
  (`@/` -> `app/src/`); existing specs mostly use deep relative paths - prefer `@/` for new tests.
- **Test through the public surface and the manager contract.** Drive behavior via
  `CoreState` + `EventEmitter` events and assert on emitted events / DOM / state, not private
  internals. Pure `engine/` functions get direct input->output assertions.
- **Cover meaningful branches:** 12h vs 24h, disabled times, plugin present vs missing, SSR
  guards, destroy/cleanup, keyboard (Arrow/Home/End/PageUp-Down), ARIA states.
- **Never weaken an assertion just to make a failing test pass.** If behavior legitimately
  changed, assert the new correct attribute/class/event that proves the same behavior.
- Coverage is collected from `src/**/*.{ts,tsx}` excluding `.d.ts`, `src/types/`, `src/styles/`.
- Don't run the full suite per task while iterating - run focused specs; the user runs the full
  `npm test` at the end. No git.
