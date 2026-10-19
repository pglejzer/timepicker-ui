# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.6.0] - 2026-10-19

### Added

- `ui.inline.embedded` renders the inline picker as a `role="group"` with no `aria-modal`, shadow or minimum height. It never takes or traps focus. Default `false`
- Range methods `setRange({ from, to })`, `getRange()` and `setActivePart(part)`. They need RangePlugin, and `setRange` emits `range:validation`. The types `TimeOfDay`, `RangeTimeValue` and `RangeTimeState` are exported
- `range.linked: false` makes From and To independent: no To-before-From limit, no `minDuration` / `maxDuration` check, and the To tab is enabled at once. Default `true`
- `clock.isTimeDisabled(time)` disables times with a function (hour 0-23), combined with `clock.disabledTime`. A function that throws counts as enabled, and its error is rethrown
- `refreshDisabledTime()` re-applies disabled times after the data behind `isTimeDisabled` changes, without re-rendering
- `on()` and `once()` return a function that removes the handler

## [4.5.0] - 2026-10-14

### Check before upgrading

These changes can affect an existing setup. Each one is described under Changed.

- The `.tp-ui-ripple` / `.tp-ui-ripple-effect` classes and the `ripple` keyframes are removed
- `--tp-wheel-highlight-radius`, `--tp-popover-radius` and `--tp-btn-radius` are no longer defined on `:root`
- `--tp-focus-ring-halo` is no longer read, and `--tp-shadow-focus-ring` defaults to `none`
- The AM/PM value is always `AM` / `PM`, whatever `labels.am` / `labels.pm` are set to
- Out-of-range `clock.disabledTime.interval` edges such as `25:00` are now rejected and reported through `error` / `callbacks.onError`
- `setValue()` with a string that is not a time now emits `error` / `callbacks.onError` instead of being ignored
- The scroll lock now styles `<html>`, and `<body>` only when it scrolls. CSS that relied on the `padding-right` added to `body` should use `--tp-scrollbar-gap`
- With CSS anchor positioning, the compact-wheel popover gets `tp-ui-popover-anchored` and no inline `top`, `left` or `width`. Review CSS that positions `.tp-ui-popover` by hand
- With `ui.inline.showButtons: true`, inline OK and Cancel no longer remove the picker from its container
- `behavior.delayHandler` defaults to `0` instead of `300`, so the picker closes without a pause

### Security

- Label text in `labels.*`, `range.fromLabel` / `range.toLabel` and `timezone.label` is now HTML-escaped, so it cannot inject markup. The icon options `ui.keyboardIcon` and `ui.clockIcon` (`ui.iconTemplate` / `ui.iconTemplateMobile`) still accept HTML

### Added

- Optional seconds: `clock.showSeconds: true` adds a seconds field, face and wheel column, and values become `HH:MM:SS` (`HH:MM:SS AM` in 12h). Off by default, with no change when off
- `clock.incrementSeconds` (`1`, `5`, `10`, `15`, `20` or `30`, default `1`) sets the seconds step, and `clock.autoSwitchToSeconds` (default `true`) moves to the seconds face after a minute is picked
- `clock.disabledTime.seconds` disables the listed seconds in every minute, and `clock.disabledTime.interval` edges can include seconds. Edges without seconds cover the whole minute, so existing intervals still work
- `labels.second` (default `"Second"`) names the seconds field, its caption in the keyboard view, its wheel column and its announcement
- `select:second` event and `callbacks.onSelectSecond`, with the `SelectSecondEventData` type
- With seconds on, `getValue()` and the `open`, `confirm` and `update` payloads include `seconds`, the `error` payload includes `inputSecond`, and `setValue()` accepts `'14:30:15'`. Values without seconds read as `:00`
- Range with seconds: `range:confirm` and `range:validation` include `durationSeconds`. `duration` stays in whole minutes, and `range.minDuration` / `range.maxDuration` are compared with the exact length
- The modal gets the `tp-ui-has-seconds` class when seconds are shown, and new CSS tokens such as `--tp-wheel-column-width-seconds` size the seconds layout
- Clearer option names, such as `ui.initialView: 'keyboard'` for `ui.mobile: true` and `ui.viewSwitch` for `ui.enableSwitchIcon`. The old names work until 5.0, and the [options page](https://timepicker-ui.vercel.app/docs/api/options) lists every pair
- `setOptions()`, the `select:period` and `switch:face` events with `callbacks.onSelectPeriod` and `callbacks.onSwitchFace`, and `clock.type: 'auto'`, which picks 12h or 24h from the browser locale
- `ui.appendTo` (where the modal goes) and `ui.inline.container` (where the inline picker renders) accept an element as well as a CSS selector
- Keyboard control of the clock face: arrow keys, PageUp / PageDown and Home / End change the value, and Enter or Space moves to the next face. See the accessibility page
- `--tp-mobile-landscape-width`, `--tp-mobile-landscape-height`, `--tp-mobile-landscape-height-range` and `--tp-mobile-landscape-height-timezone` set the mobile keyboard view size in landscape
- `--tp-focus-ring` sets the focus ring color, falling back to `--tp-primary`
- `labels.announceCleared` (default `"Time cleared"`) sets the text announced after Clear
- `ui.inline.autoUpdate` now works: an inline picker updates its input as you pick
- `callbacks.onShow`, `callbacks.onSwitchView`, `callbacks.onWheelScrollStart` and `callbacks.onWheelScrollEnd`, so every public event now has a matching callback
- Material Design 3 press feedback: a ripple plus hover, focus and pressed state layers, tuned with `--tp-state-hover-opacity`, `--tp-state-focus-opacity`, `--tp-state-pressed-opacity` and `--tp-ripple-opacity`. With `prefers-reduced-motion`, a press shows the pressed layer without the ripple
- `--tp-dropdown-option-hover-text` sets the text color of a hovered or focused timezone option
- `--tp-scrollbar-gap` on `<html>` holds the removed scrollbar width while a picker locks the page. Use it to pad fixed or sticky elements
- `--tp-popover-edge-margin` (default `4px`) sets the smallest gap between the compact-wheel popover and the viewport's side edges

### Changed

- The AM/PM value is always `AM` or `PM`. `labels.am` / `labels.pm` only change the shown and announced text, not the input value or `getValue().type`
- `update({ options })` now applies every option group, including `range`, `timezone`, `wheel` and `clearBehavior`, and inline pickers re-render with new labels
- Inline OK and Cancel (`ui.inline.showButtons: true`) keep the picker visible. OK writes the value to the input and emits `confirm`. Cancel restores the input's value and emits `cancel`. `close()` still removes it
- `clock.disabledTime.interval` rejects out-of-range edges such as `13:00 PM` and reports them through `error` / `callbacks.onError`. On `create()` the picker does not open, and `update()` keeps the old options. Lowercase `am` / `pm` are accepted
- `setValue()` converts a time in the other clock format (`'14:30'` becomes `02:30 PM` in 12h). A string that is not a time emits `error` / `callbacks.onError`. An empty string is still ignored
- Clock and wheel modes now agree on disabled times at interval edges
- Range "to" face: times before "from" and inside disabled intervals are both disabled, and in 12h mode `clock.disabledTime.hours` / `minutes` apply too
- Text and focus contrast meet WCAG AA in `pastel`, `ai`, `m2`, `m3-green`, `crane` and `crane-straight`, and `dark` accents follow `--tp-primary`
- Every control shows one 3px focus ring. The gap ring and halo are removed: `--tp-focus-ring-halo` is no longer read and `--tp-shadow-focus-ring` defaults to `none`
- The picker sets `box-sizing: border-box` on its own elements, so it no longer depends on a page-wide reset
- Hover on unselected AM/PM buttons and the view-switch icon now shows only the state layer
- The warning-sign glyph before the validation message is removed. Screen readers read it aloud and it could not be turned off
- `--tp-wheel-highlight-radius`, `--tp-popover-radius` and `--tp-btn-radius` are no longer defined on `:root`, so theme values reach them. Setting them still works, but reading them with `var()` outside the picker gets no value
- The old ripple is replaced: `.tp-ui-ripple`, `.tp-ui-ripple-effect` and the `ripple` keyframes are removed. Move custom CSS to the new state and ripple tokens
- The compact-wheel popover (`wheel.placement`) uses the Popover API and CSS anchor positioning, so a parent's `overflow: hidden` or `z-index` no longer clips or covers it. Browsers without anchor positioning use a script fallback
- `--tp-popover-gap`, `--tp-popover-min-width` and `--tp-popover-max-width` now take effect. New popover styling hooks: the `tp-ui-popover-anchored` and `tp-ui-popover-constrained` classes and the `data-popover-request` attribute
- The scroll lock (`ui.enableScrollbar: false`, the default) now sets `overflow-y: hidden` on `<html>`, and on `<body>` only when it scrolls. Only the element that lost its scrollbar gets `padding-right`
- The legacy `'Spacebar'` key value no longer counts as Space. Only very old browsers, such as old Edge and Internet Explorer, send it
- The picker opens and closes without a pause: it fades in over 200 ms and out over 150 ms, both starting on the click
- With `prefers-reduced-motion` or `ui.animation: false`, the picker opens and closes at once, with no wait
- `behavior.delayHandler` now defaults to `0` instead of `300`. Set it to `300` to keep the old pause before closing
- In mobile landscape, switching between the keyboard and clock views no longer jumps: the picker resizes smoothly while its content cross-fades
- `ui.animation: false` and `prefers-reduced-motion` now also stop the clock hand from animating when the face switches

### Deprecated

Each item below still works unless its entry says otherwise. All of them are removed in 5.0.

- The old names of renamed options, such as `ui.mobile` or `labels.hourLabel`: use the new names listed on the [options page](https://timepicker-ui.vercel.app/docs/api/options). `select:am` / `select:pm`: use `select:period`. `update()`: use `setOptions()`
- `OptionTypes` type: use `TimepickerOptions`
- `clock.currentTime.locales`: has no effect, the library formats the value
- `getValue().degreesHours` / `getValue().degreesMinutes`: internal clock-hand angles. Use `hour` / `minutes`
- `labels.toggleLabel`: has no effect now that the view switch is one button. Use `labels.switchToKeyboard` / `labels.switchToClock`
- `labels.format24Label` and `labels.timezoneSelectorLabel`: they never had an effect. The timezone selector label comes from `labels.timezone`
- `focusInputAfterCloseModal` in the legacy option type: use `behavior.returnFocus`
- The `hide` event and the `HideEventData` type: never emitted
- The `range:get-disabled-time` and `range:update-disabled` events: never emitted
- `ErrorEventData.rejectedHour` and `ErrorEventData.rejectedMinute`: always `undefined`

### Fixed

- Clicking a disabled hour no longer switches the clock to the minutes view
- Reopening a picker, range pickers included, no longer stacks event handlers
- `callbacks.onClear` fires once per clear instead of twice
- `close(true)` commits the current selection to the input, like the OK button
- Once OK, Cancel or Escape starts a close, further input is ignored: a double-click or second Escape no longer fires `confirm` / `cancel` twice
- While the picker is closing, `getValue()` returns the input value and `destroy()` cancels the pending close
- Enter or a click on the input while the picker fades out is ignored, instead of firing `show` / `callbacks.onShow` without opening the picker
- Inline wheel pickers with `wheel.commitOnScroll`: Cancel right after a scroll no longer fires `confirm` / `callbacks.onConfirm` after `cancel`
- Callbacks passed later through `update({ options: { callbacks } })` take effect, replaced callbacks stop firing, and inline pickers no longer fire `onOpen` again after `update()`
- Changing `clock.type` or `clock.showSeconds` through `update()` rewrites the input in the new format, range values (`from - to`) included, so `getValue()` reads it correctly
- `update()` on an open modal or popover re-renders it with the new options right away. An unconfirmed selection resets to the input value
- When the user opens the picker, `show` / `callbacks.onShow` now fire before `open` / `callbacks.onOpen`. `picker.open()` still emits only `open`
- Opening the picker on an invalid value shows and announces the error (`labels.invalidTimeFormat`) inside the dialog, and the input gets `aria-invalid` and `aria-describedby`
- An invalid `clock.disabledTime`, including an interval without `-`, is reported through `error` / `callbacks.onError` instead of silently breaking the picker
- The Clear button is enabled on the first open after page load
- Opener elements with a quote or backslash in their `data-open` value no longer break the picker
- Passing a wrapper element instead of the input to `new TimepickerUI()` makes the wrapper the picker root, so `data-open` buttons inside it open the picker
- `setValue()` accepts zero-padded 12h hours such as `'03:45 PM'` and 12h values longer than 8 characters. While the clock is open, it updates the whole face, not only the hand
- `getValue().degreesHours` / `degreesMinutes` and the `open` payload degrees now follow clicks and drags on the clock
- `clock.currentTime: true` keeps the AM/PM part in 12h locales
- `clock.smoothHourSnap`: on release, the hand animates to the hour instead of jumping. With reduced motion it moves without animation
- Closing the picker during a clock drag, for example with Escape while the mouse button is held, no longer emits `update` events afterwards
- Arrow keys on the minute field step by `clock.incrementMinutes`. Arrow keys and typed values on the time fields skip disabled times, and OK stays disabled while the shown time is disabled
- `clock.incrementHours` now works with the default `clock.smoothHourSnap: true`, in wheel and compact-wheel modes, and with the hour field's arrow keys, PageUp / PageDown and Home / End
- Holding an arrow key no longer freezes the clock hand
- Key presses no longer slow down pages with several open or inline pickers
- The view-switch control is one button with one Tab stop, a label that says what it does and stays localized, a focus ring and a 40px target
- `ui.iconTemplateMobile` goes inside the view-switch button, like `ui.iconTemplate`, instead of replacing it on the first mobile render
- Clock drag announcements use `labels.announceHour` / `labels.announceMinute`
- The hour and minute fields' `aria-valuenow` / `aria-valuetext` and the AM/PM `aria-pressed` now stay in sync with the shown time
- Empty range tabs no longer read the `--:--` placeholder aloud, also after Clear
- After switching views, the decorative clock numbers stay hidden from screen readers, and on mobile the clock face is no longer hidden
- After switching views, the hour and minute fields' accessible names follow the view: `labels.mobileHour` / `mobileMinute` in the keyboard view, `labels.hourLabel` / `minuteLabel` in the clock view
- Focus rings show only during keyboard use, and now appear on the hour and minute fields in every theme, the mobile Cancel and Clear buttons and the timezone dropdown
- High-contrast styles now apply with `prefers-contrast: more`. They used `prefers-contrast: high`, which browsers never match
- Forced colors (Windows High Contrast): the selection stays visible in system colors, and disabled clock numbers use `GrayText`
- `--tp-font-family` now sets the picker font as documented, and the time fields and buttons inherit it
- Wheel: the `:` separator is visible in the `basic` and `m2` themes
- Wheel: keyboard navigation skips disabled items, disabled options have `aria-disabled="true"`, and zero-padded `clock.disabledTime.minutes` strings such as `'05'` work
- Wheel: the header hour and minute fields move the columns and stay in sync when disabled times move a column
- Wheel: a time between a column's steps, such as `10:07` with `clock.incrementMinutes: 5`, now lands on the nearest item instead of a wrong one
- `crane-straight`: the wheel selection highlight and the popover are square again, and the `m2` popover uses its 4px radius
- Compact-wheel: the AM/PM column shows `labels.am` / `labels.pm` and opens on the input's period, and interval-disabled minutes follow the selected hour and period
- Compact-wheel: `getValue()` while the picker is open returns the wheel selection
- Compact-wheel: Clear no longer flips AM/PM, or jumps back to the input value with `clearBehavior.clearInput: false`
- Compact-wheel: the popover is as wide as its columns, so 12h with seconds fits, and it scrolls inside a short viewport
- Compact-wheel: with `wheel.placement: 'top'` or `'bottom'`, the popover switches sides when fewer than three wheel rows fit, instead of covering the input
- Compact-wheel: with `dir="rtl"` set only on a container, the popover lines up with the input's right edge, with or without CSS anchor positioning
- Compact-wheel: without CSS anchor positioning, the `--tp-popover-*` gap, margin and width tokens now work in `rem`, `em` or `calc()`, not only `px`
- Types and docs: `wheel.placement` has no default (the JSDoc said `'auto'`). Without it, compact-wheel opens as a modal, as before
- Range: a range can be completed with the keyboard alone, and focus moves to the hour field after the From time is committed
- Range: OK stays disabled while the range is outside `range.minDuration` / `range.maxDuration`, also when picked with the pointer
- Timezone: a `timezone.default` missing from the list falls back to the browser's zone if listed, otherwise the first option, instead of an empty label
- Timezone: Clear resets the selected zone, and the trigger then shows `timezone.label` instead of the English "Timezone..." or `undefined...`
- Timezone: screen readers no longer read "check mark" as part of the selected zone name
- Timezone: the closed field is mirrored in right-to-left pages, with the arrow on the left
- Contrast: hovered and focused timezone options in `crane` / `crane-straight` and the `pastel` footer buttons are now readable
- Opening a modal picker no longer shifts the page sideways or overwrites its `padding-right`, and pages that scroll on `<html>` are locked too
- Layout: the 12h header no longer overflows by 2px and fits phones 330px wide or narrower
- Layout: inline pickers follow the theme's corner radius and no longer leave empty space: 500px in compact-wheel and mobile, or a 48px footer band with `ui.inline.showButtons: false`
- Mobile landscape: the keyboard view size follows the orientation after rotating, and uses the taller timezone height when range and timezone are both on
- After `update()` sets `ui.mobile: false`, the desktop time fields are no longer left editable
- A press that starts inside the picker and ends over the backdrop, such as dragging the clock hand, no longer closes it
- The landscape layout now applies to any landscape viewport up to 480px tall. Current large phones, such as the iPhone 16 Pro Max, got the portrait card cut off
- When the clock switches faces, the highlighted number follows the hand instead of turning white before the hand arrives

### Upcoming in 5.0

5.0 will change how plugins are built and registered, and will rename the part of each CSS class after the `tp-ui-` prefix to follow Material Design component naming. It also removes the items deprecated above and other unused API, and ships with a migration guide. See the [roadmap](https://timepicker-ui.vercel.app/docs/roadmap) for details.

In 5.0, `behavior.returnFocus` defaults to `true`: on close, focus goes back to the input, or to the `data-open` element that opened the picker. Set `behavior.returnFocus: true` now to return focus to the input.

---

## [4.4.0] - 2026-06-10

### Added

- Two new built-in themes - `blueprint` (light precision-instrument look: cobalt-blue accent, white surfaces, hairline borders) and `blueprint-dark` (cobalt accent on near-black neutrals). Enable via `ui.theme: 'blueprint'` / `'blueprint-dark'` and import the matching `timepicker-ui/theme-blueprint.css` / `timepicker-ui/theme-blueprint-dark.css` stylesheet. Brings the bundled theme count from 10 to 12, each still tree-shakeable as a separate CSS file
- 16 new accessibility `labels.*` options for fully localizable screen-reader and ARIA text: `hourLabel`, `minuteLabel`, `clockLabel`, `periodLabel`, `timeLabel`, `format24Label`, `rangeSelectionLabel`, `switchToKeyboardLabel`, `switchToClockLabel`, `toggleLabel`, `timezoneSelectorLabel`, `announceHour`, `announceMinute`, `announceAmSelected`, `announcePmSelected`, and `invalidTimeFormat`. All optional, with English defaults - previously these strings were hardcoded
- Home / End / PageUp / PageDown key support on the hour and minute spinbuttons (clock mode) and on the wheel columns, in addition to the existing Arrow keys, for faster keyboard time selection

### Changed

- Screen-reader announcements and ARIA labels across the clock, wheel, range, timezone, and modal now read from the `labels` group instead of hardcoded English, so all assistive-technology text can be localized
- Spinbutton inputs now expose `aria-valuetext` and keep it in sync on every change for more accurate screen-reader output
- Focus trap now skips elements marked `aria-disabled` / `aria-hidden`, so keyboard tabbing only lands on genuinely actionable controls

### Fixed

- Improved focus-ring visibility with a new high-contrast focus halo, so the focused control is clearly distinguishable on every theme
- Native browser spinner buttons no longer appear on the clock-mode time inputs in Firefox - number inputs now render cleanly and consistently across browsers (`-moz-appearance: textfield` + `-webkit-appearance` reset). Thanks to [@in-omnibus](https://github.com/in-omnibus) for reporting and proposing the fix ([#166](https://github.com/pglejzer/timepicker-ui/issues/166))
- Fix the page scroll lock not releasing after rapid open/close cycles (or with multiple pickers on a page), which could leave the whole page unscrollable; body scroll locking is now reference-counted across instances
- Missing `theme-crane-straight.css` entry in the package `exports` map - the documented `import 'timepicker-ui/theme-crane-straight.css'` subpath now resolves instead of throwing `ERR_PACKAGE_PATH_NOT_EXPORTED`

---

## [4.3.0] - 2026-03-26

### Added

- Plugin `templateProvider` hook allowing plugins to register their own modal templates without core static imports
- Plugin `clearHandler` hook allowing plugins to register custom clear logic executed when the clear button is pressed
- Exported `TemplateProvider` and `ClearHandler` types from the public API
- `getTemplateProvider()` and `getClearHandler()` methods on `PluginRegistry`

### Changed

- Plugin system refactored for true tree-shaking: unused plugins (wheel, range, timezone) are completely excluded from the final bundle when not imported
- Wheel template is no longer statically bundled with core - it is registered by the WheelPlugin at import time
- Range and timezone clear logic moved from core ClearButtonManager to plugin-provided clear handlers
- Core no longer statically imports any plugin implementation modules
- `sideEffects` field corrected to exclude plugin files, enabling bundlers to eliminate unused plugin code

---

## [4.2.2] - 2026-03-24

### Fixed

- `WheelOptions` was not exported from the public API - wheel mode configuration type is now accessible for TypeScript consumers

---

## [4.2.1] - 2026-03-18

### Fixed

- Plugin type declarations (`range.d.ts`, `timezone.d.ts`, `wheel.d.ts`) used `never` for factory parameters, causing `PluginRegistry.register()` to reject plugins in strict TypeScript projects

---

## [4.2.0] - 2026-03-18

### Added

- Wheel mode - scroll-spinner interface replacing the analog clock face. Enable via `ui.mode: 'wheel'`
- Compact-wheel mode - headerless wheel picker without the hour/minute inputs header. Enable via `ui.mode: 'compact-wheel'`
- Wheel mode supports 12h/24h, all themes, disabled time, setValue/getValue, and keyboard navigation
- Wheel mode emits all standard events (`select:hour`, `select:minute`, `update`, `confirm`, `cancel`, `clear`, `select:am`, `select:pm`, `error`) - no separate API needed
- `wheel:scroll:start` event - fires when a wheel column starts scrolling (includes `column` field)
- `wheel:scroll:end` event - fires when a wheel column snaps to a value (includes `column`, `value`, `previousValue` fields)
- Exported `WheelScrollStartEventData` and `WheelScrollEndEventData` types
- `wheel.placement` option (`'auto'` | `'top'` | `'bottom'`) for popover positioning in compact-wheel mode
- `wheel.hideDisabled` option to completely remove disabled hours/minutes from the wheel list instead of dimming them (wheel and compact-wheel modes only)
- `wheel.commitOnScroll` option to auto-commit time at the end of wheel scrolling without pressing OK
- `wheel.ignoreOutsideClick` option to prevent the picker from closing when clicking outside its area (wheel and compact-wheel modes only)
- `autoCommit` field on `ConfirmEventData` to distinguish auto-committed from manual confirmations
- Clear button to reset time selection. Enabled by default via `ui.clearButton` option
- `clearBehavior.clearInput` option to control whether clearing also empties the input field value
- `labels.clear` option to customize the clear button text
- `onClear` callback and `clear` event with `previousValue` payload
- Clear button automatically disables when no time is selected and re-enables on interaction
- Clock hands reset to neutral position (12:00) and confirm button disables after clearing
- Screen reader announcement when time is cleared
- Exported `ClearEventData` and `ClearBehaviorOptions` types
- `WheelOptions` is now a top-level key (`wheel`) instead of being nested inside `ui.wheel`

### Fixed

- Race condition when rapidly clicking the input to open the timepicker - multiple clicks before the modal fully opened could cause the picker to remain invisible in the DOM or permanently block the input element
- Range plugin landscape layout - From/To header tabs were mispositioned in landscape orientation. Fixed with proper absolute positioning within the grid layout
- Timezone plugin landscape layout - timezone picker was broken in landscape orientation. Implemented CSS Grid layout that properly positions the header, timezone selector, and clock face side by side
- AM/PM border color in landscape mode - hardcoded black border replaced with theme-aware `var(--tp-border)` variable
- Compact-wheel popover viewport detection - popover did not flip from bottom to top early enough near viewport edge. Added 16px safety threshold, switched from `window.innerHeight` to `document.documentElement.clientHeight` for accurate visible viewport measurement, and improved fallback to prefer the side with more available space
- `PluginFactory` type now correctly accepts `CoreState` and `EventEmitter` parameters instead of using `any` or `never` workarounds. Removed internal `PluginInput` interface and unsafe type assertions from the plugin registry

---

## [4.1.7] - 2026-03-08

### Fixed

- Range plugin 12h mode: AM/PM state desynchronization when switching between From/To tabs. Clock now correctly syncs internal AM/PM state with saved range values

---

## [4.1.6] - 2026-02-14

### Fixed

- Range plugin: minutes were incorrectly disabled for all hours in TO picker instead of only for the FROM hour. Now minutes are blocked only when TO hour equals FROM hour (both 12h and 24h modes)
- setValue() method not working correctly when called programmatically after initialization

---

## [4.1.5] - 2026-02-10

### Fixed

- DisabledTime update() method not recalculating state - update() now properly calls getDisableTime() to refresh disabled time state after options change

---

## [4.1.4] - 2026-02-09

### Fixed

- Additional mobile hover state fix specifically for iOS devices - v4.1.3 didn't resolve the issue on all mobile devices, especially iOS Safari. Enhanced CSS specificity and touch-action properties to completely prevent hover state persistence
- Range mode validation - OK button now correctly disabled when end time is before or equal to start time. AM/PM changes automatically trigger validation to prevent invalid range selection

---

## [4.1.3] - 2026-02-09

### Fixed

- Mobile hover state persistence on hour and minute inputs after touch events
- Mobile hover state persistence on AM/PM buttons after touch events
- Range mode AM/PM state when switching from filled "from" to empty "to" selection
- Range mode input value updating during selection instead of only on confirm
- Missing mobile class on wrapper-type-time, AM/PM buttons and input-ripple-wrapper elements when toggling mobile view
- Input readonly attribute not being removed when switching from desktop to mobile view with enableSwitchIcon
- Mobile input validation now works dynamically when switching views - blur handlers check readonly attribute instead of static options

### Added

- Exported Range plugin types: RangeOptions, RangeConfirmEventData, RangeSwitchEventData, RangeValidationEventData for better TypeScript support

---

## [4.1.2] - 2026-02-08

### Fixed

- Range button text visibility for crane, crane-straight, dark and cyberpunk themes. Added missing on-surface color variable for proper contrast
- Documentation examples corrected to use correct timezone option property name. Changed from incorrect defaultTimezone to default as defined in TimezoneOptions interface

### Added

- Auto-switch from hours to minutes on desktop when hour is selected. Hour and minute input elements automatically update active state and focus when autoSwitchToMinutes is enabled

---

## [4.1.1] - 2026-02-01

### Fixed

- **Mobile input validation** - Fixed issue where invalid time values (e.g., "169:70") could be entered via keyboard in mobile mode. Hour and minute inputs now automatically clamp to valid ranges (1-12 for 12h, 0-23 for 24h, 0-59 for minutes)

### Internal

- **Test coverage** - Expanded test suite to 1100+ tests with 90%+ code coverage. Added comprehensive tests for managers, handlers, plugins, and edge cases

---

## [4.1.0] - 2026-01-31

### Added

- **Range Plugin** - New! Select time ranges with start/end pickers, duration calculation, min/max validation, and automatic time blocking when "from" is selected

  ```javascript
  import { PluginRegistry } from "timepicker-ui";
  import { RangePlugin } from "timepicker-ui/plugins/range";

  PluginRegistry.register(RangePlugin);

  const picker = new TimepickerUI(input, {
    range: { enabled: true, minDuration: 30, maxDuration: 480 },
  });
  ```

- **Timezone Plugin** - New! Timezone selector with searchable dropdown, UTC offset display, and CSS variable theming

  ```javascript
  import { PluginRegistry } from "timepicker-ui";
  import { TimezonePlugin } from "timepicker-ui/plugins/timezone";

  PluginRegistry.register(TimezonePlugin);

  const picker = new TimepickerUI(input, {
    timezone: { enabled: true, default: "America/New_York" },
  });
  ```

- **Plugin architecture** - Tree-shakeable plugin system. Import only what you need for smaller bundles
- **Smooth hour snapping** - New `smoothHourSnap` option (default: true) enables fluid hour dragging with animation. Clock hand moves continuously between hours and snaps to nearest hour on release

### Changed

- **Smooth hour dragging is now default** - `smoothHourSnap` defaults to true for better UX. Set to false for legacy discrete jump behavior

---

## [4.0.3] - 2026-01-23

### Fixed

- **Desktop/mobile view switching** - Fixed `enableSwitchIcon` toggle not updating label text, icon, and Hour/Minute labels. Now correctly switches between "Select time" ↔ "Enter time", keyboard ↔ schedule icons, and shows/hides Hour/Minute labels when toggling views

---

## [4.0.2] - 2025-11-23

### Fixed

- **Firefox compatibility** - Fixed `TouchEvent is not defined` error in `DragHandlers`. Changed from `instanceof TouchEvent` to `'touches' in event` check for cross-browser compatibility

### Added

- **Exported grouped option types** - Added exports for `TimepickerOptions`, `ClockOptions`, `UIOptions`, `LabelsOptions`, `BehaviorOptions`, `CallbacksOptions` to support type-safe option composition
- **onUpdate event emissions** - Added missing `onUpdate` event emissions in `EventManager` and `ClockManager` for real-time value synchronization

---

## [4.0.1] - 2025-11-21

### Fixed

#### TypeScript Callback Types

- **Fixed generic types for callbacks** - All callback functions in `CallbacksOptions` now have proper generic types instead of `unknown`
- **Type-safe event payloads** - `onConfirm`, `onOpen`, `onUpdate`, and other callbacks now correctly infer event data types
- **Improved IntelliSense** - Full autocomplete for event data properties without requiring manual type annotations

**Before (4.0.0):**

```typescript
// Callbacks had unknown types
onConfirm?: TimepickerEventCallback; // eventData: unknown
```

**After (4.0.1):**

```typescript
// Callbacks are now properly typed
onConfirm?: TimepickerEventCallback<ConfirmEventData>; // eventData: { hour?: string, minutes?: string, type?: string }
```

**Impact:** Developers now get full type safety and IntelliSense for callback parameters without needing manual type assertions.

---

## [4.0.0] - 2025-11-21

### Breaking Changes

#### CSS Class Names Renamed

All CSS classes have been renamed from `timepicker-ui-*` to `tp-ui-*` for shorter, cleaner class names.

**Migration:**

```css
/* v3 */
.timepicker-ui-wrapper {
}
.timepicker-ui-modal {
}
.timepicker-ui-clock-face {
}
.timepicker-ui-hour {
}
.timepicker-ui-minutes {
}

/* v4 */
.tp-ui-wrapper {
}
.tp-ui-modal {
}
.tp-ui-clock-face {
}
.tp-ui-hour {
}
.tp-ui-minutes {
}
```

**Impact:** If you have custom CSS targeting timepicker classes, you must update all class names.

#### Grouped Options Structure

All options are now organized into logical groups (`clock`, `ui`, `labels`, `behavior`, `callbacks`) for better maintainability and clarity.

**Migration:**

```javascript
// v3
new TimepickerUI(input, {
  clockType: "12h",
  theme: "dark",
  enableSwitchIcon: true,
  onConfirm: (data) => console.log(data),
});

// v4
new TimepickerUI(input, {
  clock: { type: "12h" },
  ui: { theme: "dark", enableSwitchIcon: true },
  callbacks: { onConfirm: (data) => console.log(data) },
});
```

#### Legacy DOM Events Removed

Custom DOM events (`timepicker:confirm`, `timepicker:open`, etc.) have been completely removed. Use EventEmitter API or callback options instead.

**Migration:**

```javascript
// v3 - Removed
input.addEventListener("timepicker:confirm", (e) => console.log(e.detail));

// v4 - EventEmitter API
picker.on("confirm", (data) => console.log(data));

// v4 - Or callback options
new TimepickerUI(input, {
  callbacks: { onConfirm: (data) => console.log(data) },
});
```

#### setTheme() Method Removed

Programmatic theme customization via `setTheme()` has been removed. Use CSS classes with CSS variable overrides instead.

**Migration:**

```javascript
// v3 - Removed
picker.setTheme({ primaryColor: "#ff0000" });

// v4 - Use CSS classes
new TimepickerUI(input, { ui: { cssClass: "my-theme" } });
```

```css
/* Define theme in CSS */
.tp-ui-wrapper.my-theme {
  --tp-primary: #ff0000;
  --tp-bg: #000000;
}
```

### Added

- **EventEmitter API with Callback Bridge** - Callbacks automatically connected to EventEmitter for unified event handling
  - All 9 callback options (`onOpen`, `onCancel`, `onConfirm`, `onUpdate`, `onSelectHour`, `onSelectMinute`, `onSelectAM`, `onSelectPM`, `onError`) automatically bridge to EventEmitter
  - Type-safe event handling with `on()`, `off()`, `once()` methods
  - Automatic cleanup on destroy - no memory leaks
  - Better TypeScript support with typed event payloads
- **SSR-Safe Architecture** - All modules can be imported in Node.js environments (Next.js, Nuxt, Remix compatible)
  - No DOM globals accessed during module initialization
  - All browser-only code guarded with `typeof window !== "undefined"`
  - Safe to import in server-side rendering environments
  - Tested compatibility with Next.js, Nuxt, Remix, Astro
- **Composition-Based Architecture** - Pure composition with managers, no inheritance, follows SOLID principles
  - CoreState - pure state container (no logic)
  - EventEmitter - event system
  - Managers - ModalManager, ClockManager, AnimationManager, ConfigManager, ThemeManager, ValidationManager
  - Lifecycle - mount/unmount orchestration
  - No `extends`, no class hierarchies, fully testable
- **Auto-Focus Improvements** - Modal auto-focuses on open, minutes auto-focus when switching with `autoSwitchToMinutes`
  - Focus trap now auto-focuses wrapper element when modal opens (no Tab press needed)
  - When `autoSwitchToMinutes` enabled, minute input receives focus automatically
  - Improved keyboard accessibility and navigation
- **TypeScript Enhancements** - Fully typed event payloads, grouped options types, stricter type safety
  - No `any` types in codebase (strict TypeScript)
  - Grouped options interfaces: `ClockOptions`, `UIOptions`, `LabelsOptions`, `BehaviorOptions`, `CallbacksOptions`
  - Typed event payloads for all 9 events
  - Better IDE autocomplete and type checking

### Changed

- **Architecture** - Refactored to composition-only pattern with CoreState, Managers, Lifecycle, EventEmitter
  - Removed all inheritance and `extends` usage
  - Pure composition with dependency injection through constructors
  - Managers receive only `core: CoreState` and `emitter: EventEmitter`
  - Fully independent, testable managers
- **Bundle Size** - Reduced from 80 KB to 63.3 KB ESM (-20.9%)
  - Removed setTheme() method and programmatic theming (-1.43 KB)
  - Removed theme-custom from production bundle
  - Optimized manager implementations
  - Tree-shaking friendly architecture
- **Theme Count** - Reduced from 11 to 10 themes (removed redundant custom theme)
  - Removed `theme-custom` from production (users create custom themes via CSS variables)
  - Available themes: `basic`, `crane`, `crane-straight`, `m3-green`, `m2`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`
- **Event System** - Unified under EventEmitter, callbacks bridge to events automatically
  - Single source of truth for all events
  - Callbacks automatically emit EventEmitter events via `setupCallbackBridge()`
  - No more dual event systems (DOM events removed)
- **Options API** - Complete restructure into logical groups
  - 40+ flat options → 5 groups: `clock`, `ui`, `labels`, `behavior`, `callbacks`
  - Better organization and discoverability
  - Easier to understand and maintain

### Removed

- **Legacy DOM Events** - `timepicker:*` custom events no longer dispatched
  - Removed: `timepicker:open`, `timepicker:cancel`, `timepicker:confirm`, `timepicker:update`
  - Removed: `timepicker:select-hour`, `timepicker:select-minute`, `timepicker:select-am`, `timepicker:select-pm`, `timepicker:error`
  - Migration: Use `picker.on()` EventEmitter API or callback options
- **setTheme() Method** - Programmatic theme setting removed, use CSS instead
  - Removed: `picker.setTheme({ primaryColor, backgroundColor, ... })`
  - Removed: `applyThemeToWrapper()` private method
  - Removed: `pendingThemeConfig` state property
  - Migration: Use CSS classes with CSS variable overrides
- **theme-custom** - Removed from production bundle (users can create custom themes via CSS)
  - No longer compiled into main.css
  - Still available in dev mode (webpack.config.js)
  - Users create custom themes using CSS variables

### Fixed

- **Focus Trap** - Now auto-focuses wrapper on modal open (no longer requires Tab press)
  - Modal wrapper receives focus immediately when opened
  - Improved keyboard accessibility
  - No need to press Tab to start navigating
- **Auto-Switch Focus** - `autoSwitchToMinutes` now properly focuses minute input
  - When hour is selected and `autoSwitchToMinutes: true`, minute input receives focus
  - Added `minutesElement?.focus()` after `minutesElement?.click()`
  - Better UX for keyboard-only users
- **SSR Compatibility** - No DOM globals accessed during module initialization
  - All DOM access guarded with `typeof window !== "undefined"`
  - Safe to import in Next.js, Nuxt, Remix, Astro
  - No crashes during server-side rendering
- **currentTime Parsing** - Simplified time parsing logic
  - Removed complex Date parsing that caused issues
  - Direct time string handling for better reliability
- **Dynamic Updates** - Fixed useEffect pattern in React examples
  - Proper dependency arrays to prevent infinite loops
  - Correct cleanup in return statement

---

## [3.2.0] - 2025-11-14

### Added

- **Material Design 3 Ripple Effect** - Interactive ripple animation on buttons and inputs
  - Ripple effect on AM/PM buttons with Material Design 3 styling
  - Ripple effect on hour and minute input fields
  - CSS-based animation using `::before` pseudo-element
  - Configurable via `data-md3-ripple` attribute
  - 500ms cubic-bezier animation with primary color gradient

- **Material Design 3 Color System** - Complete M3 color token implementation
  - New CSS variables: `--timepicker-primary-container`, `--timepicker-on-primary-container`
  - New CSS variables: `--timepicker-tertiary-container`, `--timepicker-on-tertiary-container`
  - New CSS variables: `--timepicker-am-pm-text-selected`, `--timepicker-am-pm-text-unselected`
  - Updated hover/focus states using M3 color specifications
  - All 8 themes updated with complete M3 variable sets

- **New Theme: M2 (Legacy)** - Material Design 2 theme with original color scheme
  - Preserves classic timepicker appearance
  - Available via `theme: 'm2'` option
  - Includes all M3 variables mapped to M2 equivalents

- **Modular SCSS Architecture** - Better maintainability and organization
  - Split `main.scss` into 14 focused partial files
  - Partials: `_modal`, `_wrapper`, `_header`, `_body`, `_footer`, `_clock`, `_time-inputs`, `_am-pm`, `_buttons`, `_keyboard-icon`, `_utilities`, `_animations`, `_inline`, `_accessibility`, `_ripple`
  - Each partial has its own `@use '../variables.scss'` import
  - Easier to maintain and extend individual components

- **Mobile Clock Face Toggle** - New interactive mobile view expansion feature
  - Click keyboard icon to expand/collapse clock face on mobile view
  - Smooth 3-phase RAF (RequestAnimationFrame) animations for expansion
  - 400ms cubic-bezier transitions for professional UX
  - Automatic state management with `isAnimating` flag to prevent animation conflicts

- **Desktop to Mobile View Switching** - `enableSwitchIcon` functionality
  - Switch between desktop and mobile views dynamically
  - Click schedule/keyboard icon to toggle between view modes
  - Smooth animations with `.desktop-to-mobile` transition class
  - Synchronized state with `_isMobileView` flag for accurate rendering

- **Local SVG Icon Assets** - No external dependencies required
  - Added `keyboard.svg` and `schedule.svg` to project assets
  - Default icons no longer require Material Icons from Google
  - Webpack configuration: `type: 'asset/source'` for inline SVG
  - Rollup configuration: Custom SVG plugin using `fs.readFileSync()`
  - TypeScript module declarations in `custom.d.ts` for SVG imports

- **Dynamic Label and Icon Switching** - Context-aware UI updates
  - Label changes: `timeLabel` ↔ `mobileTimeLabel` based on active view
  - Icon changes: keyboard ↔ schedule SVG based on active view
  - Input readonly state: editable on mobile, readonly on desktop (unless `editable: true`)
  - ARIA labels update automatically: "Show clock face" / "Hide clock face"

- **New ClockSystem Architecture** - Complete refactor of clock rendering engine
  - Three-layer separation: Engine (pure math) → Controller (state) → Renderer (DOM)
  - **Engine Layer**: Pure mathematical functions with zero side effects
    - `AngleEngine` - Angle calculations with proper atan2() usage
    - `HourEngine` - Hour value conversions with 12h/24h logic
    - `MinuteEngine` - Minute value conversions with interval support
    - `ClockEngine` - Coordinator for pointer input processing
  - **Renderer Layer**: Pure DOM operations with Map-based caching
    - `ClockRenderer` - DOM element creation, positioning, and state updates
    - Map cache for tip elements to avoid recreating DOM
    - Fragment API for batch DOM updates
  - **Controller Layer**: State management with callback pattern
    - `ClockController` - Manages hour/minute/AM-PM state
    - Callback pattern (`onHourChange`, `onMinuteChange`) for loose coupling
  - **Handlers Layer**: Event capture with RAF batching
    - `DragHandlers` - Cross-platform mouse/touch event handling
    - RequestAnimationFrame batching for smooth dragging
  - **Facade Layer**: Public API through `ClockSystem`
    - Clean API: `switchToHours()`, `switchToMinutes()`, `setHour()`, `setMinute()`, `setAmPm()`
    - Dual wrapper support: `tipsWrapper` (outer) + `tipsWrapperFor24h` (inner) for 24h mode

### Changed

- **Theme naming** - Renamed `m3` theme to `m3-green` for clarity
  - Breaking: Update `theme: 'm3'` to `theme: 'm3-green'` in your code
  - TypeScript types updated to reflect new theme names
  - All references in codebase updated

- **Option naming** - Renamed `switchToMinutesAfterSelectHour` to `autoSwitchToMinutes` for consistency
  - Breaking: Update `switchToMinutesAfterSelectHour: true` to `autoSwitchToMinutes: true` in your code
  - Option controls automatic switch to minutes after selecting hour
  - TypeScript types updated to reflect new option name

- **24-hour clock layout** - Improved spacing for inner ring numbers
  - Increased inner ring size from 160px to 200px (width and height)
  - Better tap targets for 13-24 hour values
  - Improved accessibility for touch devices

- **AM/PM styling** - Enhanced visual feedback with M3 colors
  - Separate colors for selected (`--timepicker-am-pm-text-selected`: #633B48)
  - Separate colors for unselected (`--timepicker-am-pm-text-unselected`: #49454F)
  - Active state uses `--timepicker-am-pm-active` background color
  - Improved hover states for better UX

- **Input wrapper structure** - Better ripple effect support
  - Hour and minute inputs wrapped in `.timepicker-ui-input-wrapper` div
  - Wrapper has `position: relative` for ripple positioning
  - Wrapper dimensions match input (96x80px desktop, 96x70px mobile)
  - Maintains all existing input functionality

- **Template Unification** - Merged mobile and desktop templates
  - Single `getModalTemplate()` function with `mobileClass` conditional
  - Hour/minute text labels always rendered in DOM (CSS `display` controls visibility)
  - Removed `wrapper-landscape` class, unified to `mobile-clock-wrapper`
  - Simplified template logic while maintaining full functionality

- **Clock Face Rendering** - Improved state synchronization
  - `_isMobileView` flag must be set before calling `setHoursToClock`/`setMinutesToClock`
  - Getters (`clockFace`, `tipsWrapper`, `clockHand`) branch on `_isMobileView`
  - Proper clock face rebuild using `setHoursToClock`/`setMinutesToClock` instead of just transform
  - Fixed tips rendering in correct clock face element (mobile vs desktop)

- **ConfigManager Refactoring** - Modular architecture (KISS/DRY principles)
  - Split 433-line monolith into 4 focused modules (~87% reduction)
  - `TimeoutManager` (22 lines) - Timeout and RAF management
  - `ViewSwitcher` (58 lines) - Mobile ↔ desktop view switching logic
  - `MobileClockFaceToggler` (243 lines) - Clock face expand/collapse logic
  - `InitializationManager` (106 lines) - Timepicker initialization
  - Main `ConfigManager.ts` reduced from 433 to 56 lines
  - Composition over inheritance pattern with dependency injection

- **Code Quality Improvements** - KISS and DRY optimization
  - Reduced method duplication: `switchToMobileView`/`switchToDesktopView` → `switchView(isMobile: boolean)`
  - Extracted repeated logic: `updateIconAndLabel()`, `toggleViewClasses()`, `updateReadonlyState()`
  - DRY for disabled time: `getDisabledTimeForClock()` helper method
  - Longest method reduced from 225 lines to 18 lines (-92%)
  - Conditional classList operations: `classList[isMobile ? 'add' : 'remove']('class')`

### Fixed

- **Mobile landscape CSS selectors** - Fixed `:not()` pseudo-class usage
  - Changed from `:not(.timepicker-ui-wrapper + .mobile)` to `:not(.mobile)`
  - Corrected sibling combinator that was preventing proper mobile styling
  - Mobile landscape orientation now works correctly

- **Clock Face State Bugs** - Synchronization and rendering issues
  - Fixed clock face not updating when switching mobile ↔ desktop
  - Fixed tips rendering outside clock face ("cyferki są po lewej na dole zamist w clockFACE")
  - Fixed state losing values after first toggle
  - Fixed `_isMobileView` not being synchronized with UI state
  - Fixed getters returning wrong elements (desktop vs mobile clock face)

- **Animation Performance** - Removed performance bottlenecks
  - Removed `will-change` CSS properties causing resize lag ("przy rezsie strasznie mi się tnie")
  - Optimized RAF animation timing for smooth 60fps transitions
  - Proper cleanup of animation frames on component destroy

- **Template Rendering** - Edge cases and initialization
  - First initialization: `data-clock-initialized` attribute prevents re-initialization
  - Subsequent toggles: Proper state update with 100ms setTimeout for clock face rebuild
  - State reset on modal close: `_isMobileView` properly cleared

- **ClockSystem Critical Bugs** - Complete fix of clock rendering issues
  - **Angle Jump Bug (15° → 00/12)**: Fixed incorrect `Math.atan2()` parameter order
    - Changed from `atan2(deltaX, deltaY)` to `atan2(deltaY, deltaX) + 90°`
    - Proper angle calculation prevents clock hand jumping at 15° positions
  - **Disabled Minutes Not Grayed**: Fixed comparison logic in Engine layer
    - Engine uses multiple comparison types (string, number) in disabled checks
    - Visual disabled state now correctly reflects disabledTime configuration
  - **24h Positioning Wrong**: Fixed wrapper dimension calculations
    - Calculate dimensions from `targetWrapper.offsetWidth` not `clockFace`
    - Proper sizing for both outer (12,1-11) and inner (00,13-23) circles
  - **Inner/Outer Circle Reversed**: Corrected hour mapping for 24h mode
    - Inner circle: `hourValue === 0 || hourValue >= 13` (00, 13-23)
    - Outer circle: `baseIndex === 0 ? 12 : baseIndex` (12, 1-11)
  - **Disabled Intervals Logic Reversed**: Fixed boolean returns
    - Return `true` when time IS in interval (disabled)
    - Return `false` when time NOT in interval (enabled)
  - **AM/PM Switch No Update**: Added re-render trigger
    - `setAmPm()` triggers `renderTips()` + `setHandAngle()` + `setActiveValue()`
    - Clock face updates immediately when switching AM/PM
  - **Clock Hand Size Wrong for 24h**: Always large for hours mode
    - `setCircleSize(true)` for all hours, not `!isInner`
    - Consistent visual appearance regardless of inner/outer selection

- **24h Click Area Overlap**: Fixed accidental selection of wrong hours
  - Reduced `isInnerCircle` threshold from `0.6` to `0.5` for precise detection
  - Decreased hour-time-24 elements from 32px to 28px to prevent overlap
  - Updated ClockRenderer calculations to use correct tip sizes
  - Clicking "00" no longer jumps to "12"

- **ClockFace Disappears Before Modal Close**: Fixed poor UX during closing
  - Moved `destroyClockSystem()` to `setTimeout(300ms)` after animation
  - ClockSystem destroyed AFTER modal close animation completes
  - ClockFace remains visible throughout entire closing transition

- **24h Wrapper Shows on Minutes**: Fixed mobile/desktop toggle bug
  - Added show/hide logic for `tipsWrapperFor24h` in `switchToHours/switchToMinutes`
  - `switchToMinutes()` always hides 24h wrapper (minutes don't need dual circles)
  - `switchToHours()` shows 24h wrapper only when `clockType === '24h'`
  - Works correctly regardless of toggle method (input click, icon click, keyboard)

### Performance

- **CSS organization** - Faster build times with modular SCSS
  - Clearer separation of concerns
  - Easier to tree-shake unused styles in the future
  - Better caching during development

- **Modular Code Structure** - Better maintainability and testing
  - Single Responsibility Principle: Each manager has one clear purpose
  - Easier unit testing with isolated, focused modules
  - Improved debugging: Know exactly where to find logic
  - Consistent with EventManager folder structure pattern

- **Animation Optimization** - Smooth 60fps transitions
  - Multi-phase RAF scheduling for smooth expand/collapse animations
  - Batched DOM updates to minimize layout thrashing
  - `isAnimating` flag prevents concurrent animation conflicts
  - Proper cleanup prevents memory leaks from abandoned animation frames

- **ClockSystem Performance Gains** - 75-80% improvement in clock operations
  - **Rendering**: 15ms → 3ms (-80%) with Map-based caching and Fragment API
  - **Drag Operations**: 8ms → 2ms (-75%) with RAF batching and angle skip (<0.1°)
  - **Code Size**: ~1200 LOC → ~905 LOC (-25%) with better separation of concerns
  - **Memory Leaks**: Fixed with proper cleanup in `destroy()` chain
  - Zero functional usage of deprecated ClockFaceManager/ClockFaceManagerPool
  - Removed all `acquire()`, `release()`, `clear()` calls from old pooling system

### Developer Experience

- **Better theming API** - More intuitive theme naming
  - Clear distinction between M2 (legacy) and M3 themes
  - Named variants (m3-green) make theme selection clearer
  - Easier to add custom theme variants

- **Improved CSS maintainability** - Modular SCSS structure
  - Find styles faster with focused partial files
  - Easier to contribute to specific components
  - Better organization for future features

- **Better Code Organization** - Folder structure for large managers
  - `configmanager/` subfolder following EventManager pattern
  - Clear separation: TimeoutManager, ViewSwitcher, MobileClockFaceToggler, InitializationManager
  - Index file for clean imports: `import { TimeoutManager } from './configmanager'`
  - Each module is self-contained and independently testable

- **TypeScript Best Practices** - Type safety improvements
  - SVG module declarations for webpack/rollup compatibility
  - Proper typing for all manager constructors and methods
  - No breaking changes to public API
  - Full backward compatibility maintained

### Migration Guide

**Breaking Change:**

```javascript
// Old (v3.1.x and earlier)
const picker = new TimepickerUI(input, {
  theme: "m3",
});

// New (v3.2.0+)
const picker = new TimepickerUI(input, {
  theme: "m3-green", // Renamed for clarity
});
```

**New Features (Optional):**

```javascript
// Mobile clock face toggle (automatic on mobile view)
// Click keyboard icon to expand/collapse clock face

// Desktop to mobile switching
const picker = new TimepickerUI(input, {
  enableSwitchIcon: true, // Shows toggle icon
});

// Custom icons (optional, defaults to built-in SVGs)
const picker = new TimepickerUI(input, {
  iconTemplate: "<svg>...</svg>", // Desktop icon
  iconTemplateMobile: "<svg>...</svg>", // Mobile icon
});

// Custom labels (optional)
const picker = new TimepickerUI(input, {
  timeLabel: "Select time", // Desktop label
  mobileTimeLabel: "Enter Time", // Mobile label
});
```

**Bundler Configuration:**

- Webpack: SVG assets use `type: 'asset/source'` (inline)
- Rollup: Custom SVG plugin reads files via `fs.readFileSync()`
- No changes needed for existing projects

---

## [3.1.2] - 2025-11-07

- Fix problems with `var(--timepicker-text);`

---

## [3.1.2] - 2025-11-07

- Fix problem with input color

## [3.1.1] - 2025-11-07

### Added

- Virtual DOM caching for clock face tips - Reuses DOM elements instead of recreating them on each render for 25% performance improvement
- RequestAnimationFrame batching for DOM updates - Smoother animations and reduced layout thrashing
- Input sanitization - Security enhancement to prevent XSS attacks in time input fields

### Changed

- Clock face rendering now uses element pooling with Map-based cache
- DOM updates are batched using RAF for better performance during clock hand animations
- User input is sanitized before processing in setValue and event handlers

### Performance

- Reduced DOM operations by caching clock tip elements
- Eliminated unnecessary innerHTML clearing on every render
- Improved animation smoothness with RAF-based update scheduling

## [3.1.0] - 2025-11-07

### Added

- **EventEmitter API** - Modern event handling system with `on()`, `once()`, and `off()` methods
  - Subscribe to events: `picker.on('confirm', callback)`
  - One-time events: `picker.once('open', callback)`
  - Unsubscribe: `picker.off('confirm', callback)`
  - Type-safe event handling with full TypeScript support
- **New event names** for EventEmitter: `confirm`, `cancel`, `open`, `update`, `select:hour`, `select:minute`, `select:am`, `select:pm`, `error`
- **Exported EventEmitter class** - Available for advanced users who want to use it separately
- **Dual event system** - Both EventEmitter and DOM events fire simultaneously for backward compatibility

### Changed

- Event system refactored to use internal EventEmitter for better memory management
- DOM events (`timepicker:*`) are now considered legacy and will be removed in v4.0.0

### Deprecated

- **DOM events** (e.g., `timepicker:confirm`, `timepicker:cancel`) - Use EventEmitter API instead
- These events will be removed in v4.0.0

### Fixed

- Fixed TypeScript compilation errors in event managers
- Fixed `undefined` checks for optional managers (`clockManager`, `animationManager`, `configManager`)
- Fixed type safety issues with `_disabledTime` interface - added missing `minutes` property
- Fixed event handler type mismatches in `openElement` iteration

### Migration Guide

```javascript
// Old way (deprecated, will be removed in v4)
input.addEventListener("timepicker:confirm", (e) => {
  console.log(e.detail);
});

// New way (recommended)
picker.on("confirm", (data) => {
  console.log(data);
});
```

---

## [3.0.2] - 2025-07-25

### Fixed

- Fixed an issue where switching between desktop and mobile views caused the timepicker instance to stop working.
  The `destroy()` method was incorrectly called during the transition, unintentionally removing the instance.

---

## [3.0.1] - 2025-07-25

### Fixed

- Fixed all incorrect paths to CSS, JS, and TypeScript declaration files across all environments (Angular, React, Vanilla, etc.)
- Improved Angular integration example for clarity

---

## [3.0.0] - 2025-07-25

### Added

- **New `OptionTypes`**:
  - `inline` mode (`inline.enabled`, `containerId`, `showButtons`, `autoUpdate`)
  - `cssClass` – allows adding custom class to wrapper
  - New themes: `ai`, `cyberpunk`, `glassmorphic`, `pastel`, `dark`, `m3`

- **New Callback API**:
  - `onConfirm`, `onCancel`, `onOpen`, `onUpdate`, `onSelectHour`, `onSelectMinute`, `onSelectAM`, `onSelectPM`, `onError`

- **New DOM events** (replacing old ones):
  - `timepicker:open`, `timepicker:confirm`, `timepicker:cancel`, `timepicker:update`, `timepicker:error`, `timepicker:select-hour`, etc.

- **TypeScript types**: Full typings via `OptionTypes`, `TimepickerUI`, event payloads
- **Public API methods**: `.create()`, `.open()`, `.close()`, `.update()`, `.destroy()`, `.getValue()`, `.setValue()`

### Changed

- **Event system rewritten** – legacy DOM events (e.g. `confirm`, `cancel`) have been replaced with namespaced events (`timepicker:*`)
- **Cleaner destroy()** – no more DOM cloning or breaking React/Vue refs
- **Improved mobile/desktop switch UX**
- **New modular class structure** under the hood

### Fixed

- `destroy()` no longer removes original input element (breaking change fix)
- Fixed incorrect disabled hour rendering in some edge cases
- Fixed scrollbar issues with backdrop
- Improved focus trap logic

### Removed

- Old unnamed DOM events (`confirm`, `cancel`, `update`, etc.)
- Implicit theme logic – now explicit via `theme` option
- Legacy error handler structures

---

## [2.6.1] - 2022-11-17

### Add

- added new value to the property `theme` called `m3`.
  Theme `m3` based on the new Material Design v3. Material Design 3 is still not release in offical version for WEB but you can use it if you want.
  There is new version of [Material Design 3](https://m3.material.io/components/time-pickers/overview).
  If new version M3 will be released this design will get improve.

---

## [2.6.0] - 2022-11-16

### Change

- changed invoke of `close()` method. These method has to invoke with double parentheses `close()()`. The first parentheses doesn't have any parameters, the second has the same what had in the previous method.

### Add

- added `delayHandler` prop to avoid delay on buttons

### Fix

- fixed problem with 0NaN error when using touch input. Thanks to @grizzlymannn

---

## [2.5.0] - 2022-05-06

### Change

- changed logic about `hour` and `minutes`. Previous version used divs as buttons, the current version is using `inputs` instead divs.
- removed `preventDefault` option, to use `editable` option is enough to set this option to `true`

### Add

- added `debounce` function to close/open timepicker

### Fix

- fixed problem with `edtiable` options durning change hour/minutes on desktop/mobile

---

## [2.4.5] - 2022-04-02

### Fix

- fixed unnecessary change code to `disable Time`

---

## [2.4.4] - 2022-04-02

### Fix

- fixed problem with `focusTrap` with React about eval error

---

## [2.4.3] - 2022-04-02

### Fix

- fixed problem with `minutes` option in `currentTime`

### Add

- added `focusTrap` to turn off/on focus traping on picker. The default value is set to true
- added possibility to open picker by click enter if input is focused

---

## [2.4.2] - 2022-03-29

### Fix

- fixed problem with `currentTime` about displaying wrong hour in the picker
- fixed problem with `editable` option when switch during desktop/mobile options

### Add

- added `OptionTypes` to allows to import types from package

---

## [2.4.1] - 2022-03-26

### Add

- added new `currentTime` option

### Fix

- fixed landscape on the mobile view

### Update

- updated comments in code to methods/options to show properly descriptions in codes editors

---

## [2.4.0] - 2022-03-22

### Add

- added new update method
- added new destroy method
- added new option `disabledTime` that allows to set to timepicker disabled time

### Update

- updated a methods open, close with new parameters and callbacks

---

## [2.3.0] - 2022-03-05

### Fix

- fixed problem with [switchToMinutesAfterSelectHour](https://github.com/pglejzer/timepicker-ui/issues/13) option
- fixed problem with [update](https://github.com/pglejzer/timepicker-ui/issues/12) event
- fixed problem with [animation](https://github.com/pglejzer/timepicker-ui/issues/11) option name
- fixed problem with [iconTemplete and iconTemplateMobile](https://github.com/pglejzer/timepicker-ui/issues/9) names
- fixed problem with [switching mobile/desktop view](https://github.com/pglejzer/timepicker-ui/issues/9)
- fixed problem to set options with data-attributes

### Change

- changed option name from `selectLabelTime` to `labelTime`

### Add

- added [UMD version](https://github.com/pglejzer/timepicker-ui/issues/8)
- added new options `mobileTimeLabel` to change time label on mobile version

---

## [2.2.3] - 2021-09-26

### Update

- Update README.md and links

---

## [2.2.2] - 2021-09-25

### Fixed

- Fixed hand circle SCSS on the crane mode
- Fixed am/om SCSS on the crane mode

### Update

- Update typings, remove alomost all @ts-ignore and any types.

---

## [2.2.1] - 2021-09-24

### Fixed

- Fixed scss with landscape version
- Fixed class active to hour/minutes

---

## [2.2.0] - 2021-09-23

### Added

- Version 24h
- Input validation

### Update

- Change scss styles
- Update types

---

## [2.1.1] - 2021-01-24

### Fixed

- Fixed problem with transition

---

## [2.1.0] - 2021-01-24

### Added

- Added new option <code>animated</code> to turn on/off animations on picker on start/close.
- Added new option <code>editable</code> to edit hour/minutes on the web mode.
- Added new option <code>preventDefault</code> to turn on/off defaults events to clock face events.

### Change

- Change docs example
- Removed unnecessary option <code>inputTemplate</code> from options types.

### Fixed

- Fixed problem with events on remove

---

## [2.0.2] - 2021-01-21

### Fixed

- Fixed problem with close event.

---

## [2.0.1] - 2021-01-18

### Fixed

- Fixed problem with keyboard icon click on mobile.

---

## [2.0.0] - 2021-01-17

### Changed

- Everything was rewritten to TypeScript

### Fixed

- Fixed problems with move events on mobile.

---

## [1.2.0] - 2020-11-05

### Changed

- Fixed return values of <code>type</code> in the events

### Added

- Added the possibility to have multiple open elements on init

[1.1.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.0.0...v1.1.0
