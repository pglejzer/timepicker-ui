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
- **`ClockController` owns the hand angle** (engine math -> controller state -> renderer); don't
  recompute angles in the renderer. `CoreState.degreesHours` / `degreesMinutes` / `degreesSeconds`
  are legacy values for the deprecated `getValue()` degree fields and the `open` payload; the clock
  never reads them.
- All timing/animation comes from `TIMINGS` (`app/src/constants/timings.ts`) - never hardcode a
  timeout or transition duration. Gate JS-driven motion on `prefersReducedMotion()`.
- Clock tips are decorative (`aria-hidden`, `tabindex="-1"`, no `role="option"`). Keyboard users
  set the time through the hour/minute/second spinbutton inputs or the dial itself:
  `.tp-ui-clock-face` is an APG slider (`tabindex="0"`) whose name and value mirror the active
  field through `syncClockSlider` (`utils/accessibility`). Move the `active` class between time
  fields only through `activateField` (`managers/events/timeFields.ts`), which syncs the dial; a
  same-face value change goes through `ClockSystem.setValueIfShown` (no tip rebuild, no
  `animation:clock`), only a real face switch animates. Don't re-add list/option ARIA to tips.
- SSR-safe: guard DOM access (`isNode`/`isDocument`); nothing at module top level.
- Structural/logic changes here are `clock-engine-dev`'s scope; a11y semantics flow through the
  `accessibility` concern; CSS through `styling-themes`.
