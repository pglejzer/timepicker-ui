---
paths:
  - "app/src/managers/clock/**/*.ts"
---

# Clock subsystem rules

Applies in `app/src/managers/clock/`. Pairs with `.claude/rules/architecture.md`.

- **Keep the layers clean:**
  - `engine/` - **pure math, no DOM** (AngleEngine, ClockEngine, HourEngine, MinuteEngine).
    Never import the DOM/`document` here; engine is unit-tested as input->output.
  - `controller/` - `ClockController` orchestrates engine + renderer.
  - `renderer/` - `ClockRenderer` is the **only** place that touches clock-face DOM.
  - `handlers/` - events (click/drag), CSS, time selection, startup.
- Cross-layer changes route **through the controller**, not sideways.
- **Degrees in `CoreState` are the source of truth** for hand rotation - don't recompute angles
  in the renderer.
- All timing/animation comes from `TIMINGS` (`app/src/constants/timings.ts`) - never hardcode a
  timeout or transition duration. Gate JS-driven motion on `prefersReducedMotion()`.
- Clock tips are decorative (`aria-hidden`, `tabindex="-1"`, no `role="option"`); the keyboard
  path is the hour/minute spinbutton inputs. Don't re-add list/option ARIA to tips.
- SSR-safe: guard DOM access (`isNode`/`isDocument`); nothing at module top level.
- Structural/logic changes here are `clock-engine-dev`'s scope; a11y semantics flow through the
  `accessibility` concern; CSS through `styling-themes`.
