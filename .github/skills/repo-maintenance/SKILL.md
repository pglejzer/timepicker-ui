---
name: repo-maintenance
description: >
  Full repository maintenance pipeline that orchestrates all project agents in sequence -
  code review, accessibility, bundle size, security, API stability, test coverage, ecosystem,
  and release preparation. Acts as a quality gate before publishing or merging major changes.
  Use when: maintenance, health check, pre-release audit, quality gate, full pipeline,
  repo health, pre-merge check, release readiness, audit all.
---

# Repository Maintenance Pipeline

You are a **repository maintenance orchestrator** for the **timepicker-ui** library.
Your job is to run a multi-stage quality pipeline by delegating to specialized agents,
collecting their reports, enforcing validation gates, and optionally preparing a release.

## When to Use This Skill

- Before merging a large PR or feature branch
- Before preparing a new release
- Periodic repo health checks
- After major refactoring to verify nothing regressed
- When onboarding to verify the repo is in a healthy state

## Pipeline Overview

```
Stage 1: Code Review       → architecture, types, SSR, performance
Stage 2: Accessibility     → ARIA, keyboard, focus, screen reader
Stage 3: Bundle Size       → tree-shaking, side effects, size regression
Stage 4: Security          → dependencies, DOM injection, secrets
Stage 5: API Stability     → export diff against last git tag
Stage 6: Test Coverage     → generate missing tests
Stage 7: Ecosystem         → compatibility risks, modernization
Stage 8: Release (gated)   → version bump, changelog, docs
```

Stages 1–5 are **read-only analysis** - they produce reports but do not modify code.
Stage 6 may **create new test files** if gaps are found.
Stage 7 is **research-only** - it produces recommendations.
Stage 8 is **gated** - it only runs if all previous stages pass AND the user confirms.

## Detailed Stage Definitions

### Stage 1 - Code Review

**Agent**: `code-review`
**Tools**: read, search (read-only)
**Goal**: Detect architecture violations, type safety issues, SSR safety issues, and performance problems.

**Delegate prompt**:

> Run a full code review of `app/src/`. Report all findings grouped by priority:
> P0 Architecture Violations, P0 Type Safety, P1 SSR Safety, P2 Performance, P3 Accessibility.
> Include file paths, line numbers, and concrete fix suggestions.

**Gate criteria**:

- **PASS**: Zero P0 findings
- **WARN**: P0 = 0, but P1/P2 findings exist (continue with warnings noted)
- **FAIL**: Any P0 finding → stop pipeline, report blockers to user

### Stage 2 - Accessibility

**Agent**: `accessibility`
**Tools**: read, search (read-only)
**Goal**: Detect WCAG 2.1 AA compliance issues - ARIA, keyboard navigation, focus management, screen reader support.

**Delegate prompt**:

> Run a full accessibility audit of `app/src/`. Cover keyboard navigation, screen reader compatibility,
> focus visibility, hit target sizes, ARIA correctness, and CSS accessibility impacts.
> Report findings grouped by priority with file paths and fix suggestions.

**Gate criteria**:

- **PASS**: Zero P0 findings (keyboard and screen reader categories)
- **WARN**: P0 = 0, but P1/P2 findings exist
- **FAIL**: Any P0 finding → stop pipeline, report blockers to user

### Stage 3 - Bundle Size

**Agent**: `bundle-optimizer`
**Tools**: read, search, execute
**Goal**: Detect bundle size regressions, side-effect leaks, and tree-shaking failures.

**Delegate prompt**:

> Audit `app/src/` for bundle size issues. Check for: unnecessary imports, top-level side effects,
> barrel re-exports that defeat tree-shaking, and plugin code leaking into the core bundle.
> If benchmark infrastructure is available, run `npm run bench` and report sizes.
> Report findings with estimated KB impact.

**Gate criteria**:

- **PASS**: No side-effect leaks, no new dependencies, core stays under baseline
- **WARN**: Minor size increase (<5%) without side-effect issues
- **FAIL**: Side-effect leak in core, or size increase >10% → stop pipeline

### Stage 4 - Security

**Agent**: `security`
**Tools**: read, search, execute
**Goal**: Detect dependency vulnerabilities, unsafe DOM patterns, XSS vectors, and secret exposure.

**Delegate prompt**:

> Run a full security audit. Steps:
>
> 1. Run `npm audit` in `app/` and report findings by severity.
> 2. Scan `app/src/` for innerHTML, outerHTML, insertAdjacentHTML, eval, new Function.
> 3. Trace user-configurable options to their DOM insertion points.
> 4. Search for hardcoded secrets, API keys, or tokens across the entire repo.
> 5. Check option merging for prototype pollution vectors.
>    Report all findings by severity: Critical, High, Medium, Low.

**Gate criteria**:

- **PASS**: No Critical or High findings
- **WARN**: Only Medium/Low findings
- **FAIL**: Any Critical or High finding → stop pipeline, report blockers to user

### Stage 5 - API Stability

**Agent**: `api-stability`
**Tools**: read, search, execute
**Goal**: Compare current public API exports against the previous git tag to detect breaking changes.

**Delegate prompt**:

> Compare the public API surface between the latest git tag and HEAD.
>
> 1. Resolve the latest tag via `git describe --tags --abbrev=0`.
> 2. Diff entry points: `app/src/index.ts`, `app/src/range.ts`, `app/src/timezone.ts`.
> 3. Diff public types in `app/src/types/`.
> 4. Diff public class methods in `TimepickerUI.ts`, `EventEmitter.ts`, `PluginRegistry.ts`.
> 5. Diff default option values.
> 6. Diff CSS classes and variables in `app/src/styles/`.
>    Classify each change as breaking or non-breaking, and determine the required semver bump.

**Gate criteria**:

- **PASS**: No breaking changes, or only additive changes (patch/minor)
- **WARN**: Breaking changes exist but are intentional (user must confirm major bump)
- **FAIL**: Unintentional breaking changes detected → stop pipeline, report to user

### Stage 6 - Test Coverage

**Agent**: `test-writer`
**Tools**: read, edit, search, execute, agent
**Goal**: Identify untested public API surface and generate missing tests.

**Delegate prompt**:

> Analyze test coverage for `app/src/`. Steps:
>
> 1. List all managers and public classes in `app/src/`.
> 2. List all existing test files in `app/tests/unit/`.
> 3. Identify managers or classes with no corresponding test file.
> 4. For each gap, generate a test file following project conventions:
>    - Location: `app/tests/unit/<domain>/ClassName.test.ts`
>    - Pattern: CoreState + EventEmitter instantiation, manager under test, afterEach cleanup
>    - Test public API only, use `jest.spyOn`, typed assertions, no `any`
> 5. Run `cd app && npm test` to verify new tests pass.

**Gate criteria**:

- **PASS**: All new tests pass, no regressions in existing tests
- **WARN**: Some tests skipped due to missing DOM setup (note for followup)
- **FAIL**: New tests fail or existing tests regress → stop pipeline

### Stage 7 - Ecosystem

**Agent**: `ecosystem`
**Tools**: read, search, web
**Goal**: Detect ecosystem changes and compatibility risks that affect the library.

**Delegate prompt**:

> Research current ecosystem status for timepicker-ui. Check:
>
> 1. Framework compatibility: React (latest), Vue 3, Angular, Svelte, Astro, Next.js SSR
> 2. TypeScript: latest stable version compatibility with project tsconfig
> 3. Browser APIs: any new APIs (Temporal, Popover, Anchor Positioning) reaching baseline
> 4. Build tooling: tsup, Rollup, Vite - any breaking updates or deprecations
> 5. Node.js: current LTS compatibility
>    Report recommendations ranked by impact-to-effort ratio.

**Gate criteria**:

- **PASS**: No critical compatibility risks
- **WARN**: Recommendations exist but none are urgent
- This stage never blocks the pipeline - it is informational only

### Stage 8 - Release (Gated)

**Agent**: `release`
**Tools**: read, edit, search, execute
**Goal**: Bump version, update changelog, update documentation.

**Entry conditions** (ALL must be true):

1. Stages 1–6 passed (no FAIL status)
2. API stability report determined the correct semver bump type
3. User explicitly confirms: "proceed with release"

**Delegate prompt**:

> Prepare release for timepicker-ui. Steps:
>
> 1. Bump type: [patch|minor|major] (from Stage 5 API stability report).
> 2. Bump version in root `package.json`.
> 3. Add changelog entry to `CHANGELOG.md` with all user-facing changes.
> 4. Update `README.md` if API surface changed.
> 5. Update docs-app pages if configuration or events changed.
> 6. Run `cd app && npm run test:ci` to verify.
> 7. Summarize the release.

**Gate criteria**:

- **PASS**: Version bumped, changelog written, tests pass
- **FAIL**: Tests fail after docs update → revert and report

## Pipeline Execution Rules

### Sequencing

Run stages **in order** (1 → 2 → 3 → 4 → 5 → 6 → 7 → 8). Each stage depends on the previous passing.

### Gate Enforcement

After each stage, evaluate the gate criteria:

| Result   | Action                                                          |
| -------- | --------------------------------------------------------------- |
| **PASS** | Proceed to next stage                                           |
| **WARN** | Log warnings, proceed to next stage                             |
| **FAIL** | Stop the pipeline immediately, present all blockers to the user |

### User Checkpoints

Pause and ask the user before:

1. **Stage 6** (test-writer) - "Stages 1–5 passed. Proceed to generate missing tests?"
2. **Stage 8** (release) - "All stages passed. Semver bump: [type]. Proceed with release?"

### Partial Runs

The user may request a subset of stages:

| User says                 | Run stages                    |
| ------------------------- | ----------------------------- |
| "run full maintenance"    | 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 |
| "run health check"        | 1 → 2 → 3 → 4 → 5             |
| "run pre-release check"   | 1 → 2 → 3 → 4 → 5 → 7 → 8     |
| "run code quality check"  | 1 → 2                         |
| "run security and bundle" | 3 → 4                         |
| "prepare release"         | 5 → 8 (assumes checks passed) |
| "generate missing tests"  | 6 only                        |

### Progress Reporting

After each stage, report:

```
## Stage X: [Name] - [PASS|WARN|FAIL]

**Findings**: X issues (Y critical, Z warnings)
**Details**: [summary of key findings]
**Gate**: [PASS|WARN|FAIL] → [proceeding to Stage X+1 | pipeline stopped]
```

### Final Summary

After all stages complete (or pipeline stops), produce:

```
## Pipeline Summary

| Stage | Agent            | Status | Findings |
| ----- | ---------------- | ------ | -------- |
| 1     | code-review      | PASS   | 0 P0     |
| 2     | accessibility    | WARN   | 0 P0, 3 P1 |
| 3     | bundle-optimizer | PASS   | -        |
| 4     | security         | PASS   | 2 Low    |
| 5     | api-stability    | PASS   | minor bump |
| 6     | test-writer      | PASS   | 3 tests added |
| 7     | ecosystem        | PASS   | 2 recommendations |
| 8     | release          | PASS   | v4.2.0 prepared |

**Overall**: PASS / WARN / FAIL
**Blockers**: [list or "none"]
**Warnings**: [list or "none"]
**Next steps**: [actionable items]
```

## Constraints

### MUST

- Run stages in the defined order
- Stop on any FAIL gate - never skip a failed stage
- Ask for user confirmation before test generation (Stage 6) and release (Stage 8)
- Respect each agent's tool restrictions (code-review and accessibility are read-only)
- Report exact file paths and line numbers for all findings
- Track cumulative state across stages (e.g., semver bump type from Stage 5 feeds Stage 8)

### MUST NOT

- Modify source code during read-only stages (1, 2, 5, 7)
- Auto-proceed past user checkpoints
- Run Stage 8 (release) if any previous stage FAILed
- Skip stages in a full run - every stage must execute
- Suppress or hide warnings - always surface them in the final summary
