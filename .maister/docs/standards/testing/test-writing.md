## Test Writing

### Test Behavior
Focus on what code does, not how it does it, to allow safe refactoring.

### Clear Names
Use descriptive names explaining what's tested and expected (`shouldReturnErrorWhenUserNotFound`).

### Mock External Dependencies
Isolate tests by mocking databases, APIs, and external services.

### Fast Execution
Keep unit tests fast (milliseconds) so developers run them frequently.

### Risk-Based Testing
Prioritize testing based on business criticality and likelihood of bugs.

### Balance Coverage and Velocity
Adjust test coverage based on project needs and team workflow.

### Critical Path Focus
Ensure core user workflows and critical business logic are well-tested.

### Appropriate Depth
Match edge case testing to the risk profile of the code.

### Jest + ts-jest on jsdom
Tests run with Jest using the `ts-jest` preset in a `jsdom` environment (`isolatedModules: true`, `testTimeout: 10000`). CSS imports resolve to `tests/__mocks__/styleMock.ts` and SVG imports to `svgMock.ts` — rely on these mocks, don't hand-roll them. A shared `tests/setup.ts` runs after the framework is installed (jest-dom matchers). Sources: config, docs.

### Tests Mirror the Source Tree
Each test mirrors its source path (e.g. `src/managers/ClockManager.ts` → `tests/unit/managers/ClockManager.test.ts`). Edge-case-heavy suites use the `.edge.test.ts` suffix. Use BDD-style nested `describe()` blocks (outer = unit, inner = method/scenario) with `it('should ...')` and Arrange-Act-Assert. Note on imports: docs prescribe the `@/` alias for tests, but actual practice is mostly deep relative imports (`../../../src/...`) — only 2 of ~90 files use `@/`; prefer the alias for new tests for readability. Sources: config, code, docs.

### Test Through the Public Surface
Drive behavior via `CoreState` + `EventEmitter` events and assert on emitted events / DOM / state, not private internals. Pure `engine/` functions get direct input→output assertions. Cover meaningful branches (12h vs 24h, disabled times, plugin present vs missing, SSR guards, destroy/cleanup). Never weaken an assertion just to make a failing test pass. Sources: code, docs.

### Coverage Scope
Coverage is collected from `src/**/*.{ts,tsx}` excluding `.d.ts`, `src/types/`, and `src/styles/`. Reporters: text, lcov, html. Source: config.
