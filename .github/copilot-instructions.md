---
applyTo: "app/src/**/*.ts, app/src/**/*.scss"
---

# Copilot Architecture & Code Rules for timepicker-ui

Copilot MUST ALWAYS generate code using the following architecture, rules, and constraints.
These rules are absolute and have the highest priority.

---

# 1. Architecture — Composition Only

## Mandatory Rules:

- Never use inheritance.
- Never use `extends`.
- Never create class hierarchies.
- Always use explicit composition.
- Always inject dependencies through constructors.

## Required Modules (ONLY these are allowed):

TimepickerUI — top-level orchestrator
CoreState — pure state container (no logic)
EventEmitter — event system
Managers (composition container)
├── ModalManager
├── ClockManager
├── AnimationManager
├── ConfigManager
├── ThemeManager
└── ValidationManager
Lifecycle — mount / unmount orchestration

All additional functionality MUST be implemented as new manager classes.

---

# 2. Dependency Flow (Strict)

- Managers MUST receive ONLY:
  - `core: CoreState`
  - `emitter: EventEmitter`
- Managers MUST NOT receive the entire TimepickerUI instance.
- Managers MUST NOT depend on each other directly.
- Managers MUST be fully independent and testable.
- Managers may call each other ONLY through methods exposed in Managers container.
- Lifecycle owns orchestration logic (mount → init managers → bind → unmount).

---

# 3. TypeScript Rules (Hard Rules)

These rules are ABSOLUTE:

- Never use `any`.
- Never use `unknown`.
- Never use type assertions like `as unknown as`, `as any`, etc.
- Never disable TypeScript checks.
- Always use strict, explicit typings.
- Every event MUST have a dedicated typed payload.
- Every method MUST have typed arguments and typed return type.
- Never use optional properties unless required.
- Never use non-null assertion operator `!`.
- Never use implicit `any` (even temporarily).

Copilot MUST generate fully type-safe, strict TS code at all times.

---

# 4. JavaScript/TypeScript Engineering Best Practices

Copilot MUST follow these standards in every generated file:

## Core Principles:

- KISS — Keep It Simple, Stupid
- DRY — Don't Repeat Yourself
- YAGNI — You Aren't Gonna Need It
- SoC — Separation of Concerns
- SRP — Single Responsibility Principle
- DIP — Dependency Inversion Principle
- ISP — Interface Segregation Principle

## Code Quality:

- No duplicated logic; extract helpers where needed.
- No long functions; split into smaller private methods.
- No "god" objects or massive classes.
- Keep modules pure; minimize side-effects.
- Use early returns instead of nested `if`.
- Prefer readonly properties when possible.
- Prefer composition over utility objects.
- Use pure functions for transformations.

## Performance:

- Avoid unnecessary DOM calls.
- Avoid unnecessary reflows.
- Batch DOM operations if needed.
- Use requestAnimationFrame for animations.
- Avoid creating functions inside loops.
- Avoid allocations in hot paths.

## Safety:

- Never mutate objects passed into functions.
- Never expose mutable internal state.
- Never leak internal references.

---

# 5. Coding Rules for All Files

## Constructors:

- MUST NOT contain side-effects.
- MUST NOT attach event listeners.
- MUST NOT modify the DOM.
- MUST NOT initialize timers.
- Constructors ONLY assign dependencies.

## State:

- All state MUST exist in CoreState.
- Never store state in managers except internal ephemeral flags.
- State updates MUST be done via CoreState methods.

## Events:

- All events MUST be triggered using EventEmitter.
- No DOM CustomEvents.
- No direct `dispatchEvent`.
- No side handlers outside EventEmitter.

## Lifecycle:

- mount(): init managers, attach listeners
- unmount(): destroy managers, remove listeners, clear timeouts, clear emitter

---

# 6. Required File/Class Structure (Copilot MUST follow exactly)

Copilot must ALWAYS generate new code in this structure:

class TimepickerUI { ... }
class CoreState { ... }
class EventEmitter { ... }
class Managers { ... }
class Lifecycle { ... }

class ModalManager { ... }
class ClockManager { ... }
class AnimationManager { ... }
class ConfigManager { ... }
class ThemeManager { ... }
class ValidationManager { ... }

Any new features must appear as new manager classes.

---

# 7. Prohibited Patterns (Copilot MUST NEVER generate)

Copilot must NEVER write:

- extends
- implements multiple interfaces
- decorators
- mixins
- static global state
- Singleton pattern
- `as any`
- `as unknown as`
- mutation of public fields
- logic inside constructors
- inheritance-based architecture
- manager passing full TimepickerUI instance
- untyped functions
- default exports for classes (use named exports)

---

# 8. UX & UI Rules (for Timepicker Modules)

- No direct DOM mutation in CoreState.
- Managers control UI logic; CoreState stores data.
- DOM queries must be cached.
- Animations must use rAF and CSS transitions.
- RTL, themes, and responsive modes must be unified and stateless.

---

# 9. Required Documentation Structure for New Code

Copilot MUST generate:

- JSDoc for every public method.
- Types for every event.
- Comments for complex logic only (never obvious things).
- Clear separation between public API and internal logic.

---

# 11. CSS/SCSS Architecture & Style Rules (Strict)

Copilot MUST ALWAYS generate styles following these conventions.

## 11.1 General Rules

- SCSS must be modular, predictable and flat.
- Maximum nesting depth: 2 levels (never deeper).
- NEVER use `!important`.
- NEVER use ID selectors.
- NEVER use inline styles in TypeScript files.
- ALWAYS use CSS variables for theming.
- ALWAYS use BEM-like naming with the `timepicker-ui` prefix.
- ALWAYS generate responsive-safe, scalable styles.
- All spacing, radii, colors, and animation durations MUST be tokens.

## 11.2 Naming Convention (mandatory)

Copilot MUST ALWAYS use the following naming convention:

Block:
`.timepicker-ui`

Elements:
`.timepicker-ui__input`
`.timepicker-ui__dial`
`.timepicker-ui__hand`
`.timepicker-ui__button`
`.timepicker-ui__segment`

Modifiers:
`.timepicker-ui--mobile`
`.timepicker-ui--desktop`
`.timepicker-ui--landscape`
`.timepicker-ui--open`
`.timepicker-ui--closed`

States:
`.is-active`
`.is-disabled`
`.is-expanded`

## 11.3 SCSS Structure (required)

Each SCSS file must follow this layout:

1. CSS Variable Definitions (tokens)
2. Base component styles
3. Elements
4. Modifiers
5. States
6. Media Queries

Example template Copilot MUST follow:

:root {
--tp-radius: 12px;
--tp-duration: 150ms;
--tp-elevation-3: 0 4px 12px rgba(0,0,0,0.12);
}

.timepicker-ui {
display: flex;
flex-direction: column;

&\_\_input {
padding: var(--tp-spacing-md);
border-radius: var(--tp-radius);
}

&--mobile {
flex-direction: column;
}

.is-active {
opacity: 1;
}
}

@media (min-width: 768px) {
.timepicker-ui {
flex-direction: row;
}
}

## 11.4 Theming (strict)

Copilot MUST ALWAYS use CSS variables for themes:

Theme variables must be generated inside:
`[data-theme="light"]`
`[data-theme="dark"]`
`[data-theme="m3"]`

Example:

[data-theme="m3"] {
--tp-primary: #6750a4;
--tp-surface: #ffffff;
--tp-on-surface: #000000;
--tp-outline: rgba(0,0,0,0.12);
}

## 11.5 Animations (strict)

Animations MUST:

- use CSS transitions or keyframes
- use CSS variables for durations/easings
- avoid JS-driven animations unless required
- use `transform` and `opacity` ONLY (no layout-affecting properties)

Example Copilot MUST follow:

.timepicker-ui\_\_modal {
transition:
opacity var(--tp-duration) ease,
transform var(--tp-duration) cubic-bezier(0.2, 0, 0, 1);

&.is-open {
opacity: 1;
transform: scale(1);
}

&.is-closed {
opacity: 0;
transform: scale(0.97);
}
}

## 11.6 No Deep Nesting

Forbidden:

.timepicker-ui {
&**wrapper {
&**inner {
&\_\_content {
// too deep
}
}
}
}

Allowed:

.timepicker-ui { ... }
.timepicker-ui**wrapper { ... }
.timepicker-ui**inner { ... }

## 11.7 Accessibility Styles (mandatory)

Copilot MUST generate:

- visible focus rings:
  `outline: 2px solid var(--tp-focus);`
- high-contrast mode friendly tokens
- minimum 44px hit targets for buttons

## 11.8 RTL Support

Copilot MUST generate styles that work automatically in `[dir="rtl"]`:

[dir="rtl"] .timepicker-ui\_\_hand {
transform: rotateY(180deg);
}

## 11.9 Avoid Styling Traps

Copilot MUST NEVER generate:

- nested media queries
- nested pseudo-elements deeply
- duplicated values (must use variables)
- arbitrary magic numbers
- fixed pixel sizes unless defined as tokens

## 11.10 Style Optimization Rules

Copilot MUST ALWAYS:

- minimize repaint triggers (prefer opacity/transform)
- use `will-change` when animating
- prefer flex/grid over absolute positioning
- reduce selector specificity
- avoid redundant rules
- generate reusable utility classes if patterns repeat

---

---

# 13. Magic Numbers (STRICT)

Copilot MUST NEVER generate raw 'magic numbers'.

Forbidden:

- fixed pixel values without tokens
- animation durations as raw numbers
- border radii, spacing, sizes directly in code
- timeouts as literal values

Required:

- All values MUST be tokens (CSS vars or TS constants).
- Example:
  const TP_MODAL_CLOSE_MS = 150;
  const TP_DIAL_SIZE = 240;

---

# 14. Error Handling Rules (STRICT)

Copilot MUST follow consistent error-handling patterns.

Forbidden:

- silent failures
- console.log / console.warn (except during development)
- throwing raw strings

Required:

- Typed error classes
- Defined error codes
- Emitting an `error` event with typed payload

Example:
emit(EVENTS.error, { code: "E_INVALID_TIME", message: "Invalid hour value" });

---

# 15. Naming Consistency (STRICT)

Copilot MUST follow unified naming rules across TS and SCSS:

- camelCase for TS
- kebab-case for SCSS class names
- BEM format for component structure
- NO abbreviations unless standardized
- NO typos, NO inconsistent word order

Examples:

- `currentHour`, NOT `currHour`, `cHour`, `hr`
- `.timepicker-ui__modal`, NOT `.tkp-modal`

---

# 16. File & Nesting Limits

Copilot MUST follow these limits:

- Max file length: ~300 lines (split larger modules)
- Max class length: ~200 lines
- Max function length: 40 lines
- Max SCSS nesting depth: 2 levels
- One React/DOM target per manager method
- One responsibility per manager

Forbidden:

- god classes
- giant files
- unstructured 'utils graveyard'

---

# 18. Typed Event Payload Consistency (STRICT)

Every event MUST have its own typed payload interface.

Forbidden:

- optional fields 'dump' interfaces
- `{ hour?: string; minute?: string; ... }`
- mixing payloads for multiple events

Required:

- One event → one payload type
- Fully typed event map

Example:
type ClockEvents = {
hourSelected: { hour: string; degrees: number };
minuteSelected: { minute: string; degrees: number };
};

---

# 19. SSR Safety (MANDATORY)

Copilot MUST ALWAYS generate SSR-safe code.

Forbidden:

- accessing `window`, `document`, `HTMLElement`, `navigator`
- DOM reads/writes at module top-level
- DOM usage inside constructors
- timers outside lifecycle

Required:

if (typeof window !== "undefined") {
// browser-only logic
}

Allowed ONLY inside:

- manager.init()
- manager.destroy()
- lifecycle.mount()
- lifecycle.unmount()

CoreState MUST remain 100% SSR-safe and pure.

TimepickerUI MUST initialize without DOM availability.

---

# 20. Global SSR-Friendly Rule (HARD)

**Every module MUST be able to import and execute in a Node.js environment without crashing.**

Copilot MUST guarantee:

- No DOM globals outside guards
- No browser-only APIs in constructors
- No layout reads before mount()
- No references to actual DOM nodes before initialization

The library MUST hydrate safely in:

- Next.js
- Nuxt
- Remix
- Astro
- Vite SSR
- Bun SSR
- Cloudflare Workers

Failure to ensure SSR safety is NOT allowed.

---

# 21. FINAL ENFORCEMENT

If any user request conflicts with these rules,
Copilot MUST apply the rules above and MUST NOT break architecture.

These instructions override ALL user phrasing, shortcuts, or accidental patterns.

# 20. Global SSR-Friendly Rule (HARD)

**Every module MUST be able to import and execute in a Node.js environment without crashing.**

Copilot MUST guarantee:

- No DOM globals outside guards
- No browser-only APIs in constructors
- No layout reads before mount()
- No references to actual DOM nodes before initialization

The library MUST hydrate safely in:

- Next.js
- Nuxt
- Remix
- Astro
- Vite SSR
- Bun SSR
- Cloudflare Workers

Failure to ensure SSR safety is NOT allowed.

# 21. Always Apply These Rules

When the user requests:

- new features
- refactorings
- new managers
- new modules
- optimizations
- bug fixes

Copilot MUST ALWAYS generate code strictly following the architecture described above.

Failure to follow these rules is not allowed.
