# Clock Subsystem Layering

### Keep Clock Layers Clean
The clock subsystem (`app/src/managers/clock/`) is layered: `engine/` is pure math with no DOM (AngleEngine, ClockEngine, HourEngine, MinuteEngine); `controller/` orchestrates engine + renderer; `renderer/` (ClockRenderer) is the only place that touches clock-face DOM; `handlers/` own events and CSS. Cross-layer changes route through the controller, not sideways. Degrees in `CoreState` are the source of truth for hand rotation — do not recompute angles in the renderer. Source: docs.
