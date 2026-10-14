# timepicker-ui

A time picker for web forms. Attach it to an `<input>` and users pick a time on a clock face or a scroll wheel.

[![npm version](https://badge.fury.io/js/timepicker-ui.svg)](https://badge.fury.io/js/timepicker-ui)
[![downloads](https://img.shields.io/npm/dm/timepicker-ui)](https://npmcharts.com/compare/timepicker-ui?minimal=true)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://img.shields.io/npm/l/timepicker-ui)
[![Coverage Status](https://coveralls.io/repos/github/pglejzer/timepicker-ui/badge.svg?branch=main)](https://coveralls.io/github/pglejzer/timepicker-ui?branch=main)
[![Tests](https://github.com/pglejzer/timepicker-ui/actions/workflows/tests.yml/badge.svg)](https://github.com/pglejzer/timepicker-ui/actions/workflows/tests.yml)
[![Socket Badge](https://badge.socket.dev/npm/package/timepicker-ui/4.5.0)](https://badge.socket.dev/npm/package/timepicker-ui/4.5.0)

[Live demo](https://timepicker-ui.vercel.app/) · [Documentation](https://timepicker-ui.vercel.app/docs) · [Changelog](./CHANGELOG.md) · [React wrapper](https://github.com/pglejzer/timepicker-ui-react)

## Why timepicker-ui

- Zero dependencies.
- ~26 KB gzipped core. The range and timezone plugins are about 3-4 KB each, the wheel plugin about 9 KB, and a plugin only gets bundled if you import it ([bundle stats](https://timepicker-ui.vercel.app/bundle-stats)).
- [Clock](https://timepicker-ui.vercel.app/examples/basic/getting-started), [wheel](https://timepicker-ui.vercel.app/examples/plugins/wheel) or compact wheel (a small dropdown under the input).
- Plain JS API, so it works the same in React, Vue, Angular, Svelte or without a framework.
- Doesn't touch `window` or `document` on import, so it's safe in Next.js, Nuxt and other SSR setups.
- Keyboard and screen reader support. All texts, the screen-reader ones included, can be translated via `labels`.

## Features

- 12h / 24h, hour and minute steps, [disabled times](https://timepicker-ui.vercel.app/docs/features/disabled-time)
- Optional [seconds](https://timepicker-ui.vercel.app/docs/features/seconds) (`HH:MM:SS`) in the clock, wheel and compact wheel
- [12 themes](https://timepicker-ui.vercel.app/docs/features/themes) (Material 2/3, Crane, Dark, Cyberpunk, Blueprint, ...)
- [Inline mode](https://timepicker-ui.vercel.app/docs/features/inline-mode), [clear button](https://timepicker-ui.vercel.app/docs/features/clear-button), [mobile layout](https://timepicker-ui.vercel.app/docs/features/mobile)
- [Time ranges](https://timepicker-ui.vercel.app/examples/plugins/range) and [timezones](https://timepicker-ui.vercel.app/examples/plugins/timezone) via plugins
- [TypeScript](https://timepicker-ui.vercel.app/docs/api/typescript) types included

## Installation

```bash
npm install timepicker-ui
```

## Quick start

```html
<input id="timepicker" type="text" />
```

```javascript
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

const input = document.querySelector("#timepicker");
const picker = new TimepickerUI(input, {
  clock: { type: "24h" },
  ui: { theme: "dark" },
  callbacks: {
    onConfirm: (data) => console.log("Selected:", data),
  },
});
picker.create();
```

No global CSS reset is needed: the picker sets `box-sizing: border-box` on its own elements ([details](https://timepicker-ui.vercel.app/docs/installation)).

## API

```javascript
picker.create();               // render the picker and attach it to the input
picker.open();
picker.close();
picker.destroy();
picker.getValue();             // { hour, minutes, seconds, type, time }, seconds only with clock.showSeconds
picker.setValue("14:30");      // "2:30 PM" works too
picker.setValue("14:30:15");   // with clock.showSeconds
picker.setOptions({ ui: { theme: "crane" } });

picker.on("confirm", (data) => {});
picker.on("cancel", (data) => {});
picker.on("open", () => {});
picker.on("update", (data) => {});
picker.on("clear", (data) => {});
picker.on("error", (data) => {});
picker.once("confirm", handler);
picker.off("confirm", handler);

TimepickerUI.getById("my-id");
TimepickerUI.getAllInstances();
TimepickerUI.isAvailable("#timepicker");
TimepickerUI.destroyAll();
```

Docs: [methods](https://timepicker-ui.vercel.app/docs/api/methods), [events](https://timepicker-ui.vercel.app/docs/api/events)

## Options

Grouped by area. Pass only what you need, the rest has defaults ([full list](https://timepicker-ui.vercel.app/docs/api/options)).

```typescript
new TimepickerUI(input, {
  clock: {
    type: "12h" | "24h" | "auto", // default "12h"; "auto" follows the browser locale
    incrementHours: 1,
    incrementMinutes: 1,
    showSeconds: false,         // true adds seconds (HH:MM:SS)
    incrementSeconds: 1,
    disabledTime: { hours: [], minutes: [], seconds: [], ranges: "" },
    defaultTime: "now" | { time, updateInput },
  },
  ui: {
    theme: "basic" | "dark" | "m3-green" | "crane" | "blueprint" | ...,
    mode: "clock" | "wheel" | "compact-wheel",   // default "clock"
    animation: true,
    backdrop: true,
    initialView: "clock",       // or "keyboard"
    editable: false,
    inline: { enabled: false, container: "#picker" | element, showButtons: false, autoUpdate: false },
    clearButton: false,         // or { clearInput: false } to keep the input value on Clear
    cssClass: "",
  },
  labels: { am, pm, ok, cancel, clear, clockTitle, hour, minute, second, rangeFrom, rangeTo, timezone, ... },
  behavior: { focusTrap: true, returnFocus: false, delayHandler: 0, id: "" },
  callbacks: { onConfirm, onCancel, onOpen, onUpdate, onSelectHour, onSelectMinute, onSelectSecond, onSelectPeriod, onClear, onError, ... },
  wheel: { placement: "auto" | "top" | "bottom", hideFooter: false, commitOnScroll: false, hideDisabled: false, ignoreOutsideClick: false },
  range: { enabled: false, minDuration, maxDuration },
  timezone: { enabled: false, default, list },
});
```

## Themes

[Preview all of them](https://timepicker-ui.vercel.app/examples/themes/basic): `basic`, `crane`, `crane-straight`, `m3-green`, `m2`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`, `blueprint`, `blueprint-dark`.

`main.css` is required and already includes `basic`. The rest are separate files:

```javascript
import "timepicker-ui/main.css";
import "timepicker-ui/theme-dark.css";

new TimepickerUI(input, { ui: { theme: "dark" } });
```

Or import `timepicker-ui/index.css` to get all of them. Writing your own theme: [styling guide](https://timepicker-ui.vercel.app/docs/advanced/styling).

## Plugins

Range, timezone and wheel ship as separate imports. Register them once before creating pickers. You need `WheelPlugin` for the `wheel` and `compact-wheel` modes.

```javascript
import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";
import { TimezonePlugin } from "timepicker-ui/plugins/timezone";
import { WheelPlugin } from "timepicker-ui/plugins/wheel";

PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);
PluginRegistry.register(WheelPlugin);

new TimepickerUI(input, { range: { enabled: true } });
```

## Upgrading

From 4.4, 4.5 adds optional seconds (`clock.showSeconds`) and fixes many bugs. It also renames many options to clearer names, for example `ui.initialView` instead of `ui.mobile`, and adds `setOptions()` in place of `update()`. The old names keep working until 5.0, and the [options page](https://timepicker-ui.vercel.app/docs/api/options) lists every pair. A few changes can affect an existing setup: the AM/PM part of the value is always `AM` / `PM` whatever `labels.am` / `labels.pm` say, out-of-range `clock.disabledTime.ranges` edges such as `25:00` are reported as errors, the old `.tp-ui-ripple` classes are gone, and some focus-ring and radius tokens changed. The [CHANGELOG](./CHANGELOG.md) lists them under "Check before upgrading".

From 4.3 nothing breaks. 4.4 adds the `blueprint` and `blueprint-dark` themes, 16 new `labels.*` for screen-reader text, and Home/End/PageUp/PageDown keys. See the [CHANGELOG](./CHANGELOG.md).

From 3.x, options are now grouped (`clock`, `ui`, `labels`, ...), events go through `picker.on()`, and CSS class names changed. There's a [migration guide](https://timepicker-ui.vercel.app/docs/migration-guide).

From 2.x, you have to import the CSS yourself and some event names changed ([legacy guide](https://timepicker-ui.vercel.app/docs/legacy-migration)).

## Frameworks

React:

```tsx
import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

function TimePicker() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const picker = new TimepickerUI(ref.current);
    picker.create();
    return () => picker.destroy();
  }, []);
  return <input ref={ref} />;
}
```

There's also a [React wrapper](https://github.com/pglejzer/timepicker-ui-react) ([docs](https://timepicker-ui.vercel.app/react)). Vue and Angular examples are in the [quick start docs](https://timepicker-ui.vercel.app/docs/quick-start).

## Coming in 5.0

5.0.0 is planned but has no release date yet. 4.5.0 prepares for it. Planned changes:

- Plugins will be built and registered differently. `PluginRegistry.register(...)` and the exported plugin types (`PluginRegistry`, `Plugin`, `PluginManager`, `PluginFactory`, `TemplateProvider`, `ClearHandler`, `CoreState`, `EventEmitter`) will change. The built-in range, timezone and wheel plugins stay. A migration guide ships with 5.0.
- CSS class names keep the `tp-ui-` prefix, but the part after it is reworked to follow Material Design component naming. Custom CSS that targets these classes will need updating. 5.0 ships a table of old and new names.
- The options renamed in 4.5.0 lose their old names, for example `ui.mobile` (now `ui.initialView`) and `clock.smoothHourSnap` (now `clock.discreteHourJump`). The [options page](https://timepicker-ui.vercel.app/docs/api/options) lists every pair. The `select:am` / `select:pm` events go too (use `select:period`), and so does `update()` (use `setOptions()`).
- `behavior.returnFocus` becomes `true` by default: on close, focus goes back to the input, or to the `data-open` element that opened the picker. Set `behavior.returnFocus: true` now to return focus to the input.
- Code that is no longer needed is removed, including backward-compatibility paths for the deprecated items and dead code. This reduces bundle size and load cost for the core and each plugin. No size target is set yet. 4.5.0 already removes internal dead code that has no effect on the public API or markup. 5.0 removes the rest together with the items below.
- Items deprecated in 4.5.0 are removed:
  - `OptionTypes` (use `TimepickerOptions`)
  - `clock.currentTime.locales`
  - `getValue().degreesHours` and `getValue().degreesMinutes`
  - `labels.toggleLabel`, `labels.format24Label`, `labels.timezoneSelectorLabel`
  - the legacy `focusInputAfterCloseModal` option (use `behavior.returnFocus`)
  - the `hide` event and `HideEventData` (never emitted)
  - the `range:get-disabled-time` and `range:update-disabled` events (never emitted)
  - `ErrorEventData.rejectedHour` and `rejectedMinute` (always `undefined`)
- Also removed, because they do nothing or mislead:
  - internal events in the public `TimepickerEventMap` (`range:minute:commit`, `animation:*`) and its catch-all index signature, so `on('typo')` becomes a type error
  - `behavior.delayHandler` (it only delays closing and never debounced buttons)
  - `TimepickerUI.isAvailable()` (same as `document.querySelector(...) !== null`)
  - the undocumented DOM getters `hour`, `minutes`, `okButton`, `cancelButton`, `clockHand`
  - the callback arguments of `open(cb)` and `destroy()` in both forms, `destroy(cb)` and `destroy({ callback })` (use `once('open')` or run the code after the call)
  - `RangeManager`, `TimezoneManager` and `WheelManager` exported from the plugin entry points (you can't get an instance today, and the new plugin API replaces them)
- Changed events and options:
  - `select:hour`, `select:minute` and `select:second` fire once when a value of their unit is picked, in every mode. Today, in clock mode, they fire when a field is activated, so picking an hour fires `select:minute`. To follow face changes, use `switch:face`, which 4.5.0 already emits
  - `ui.footer` replaces `ui.inline.showButtons` and `wheel.hideFooter`: `false` hides OK, Cancel and Clear in every mode, and `true` shows them in inline mode too
  - `behavior.commitOnChange` replaces `ui.inline.autoUpdate` and `wheel.commitOnScroll`: each picked value is written to the input and emits `confirm`, and the picker stays open
  - `wheel.ignoreOutsideClick` moves to `behavior.ignoreOutsideClick` and works in every mode, the clock modal included
  - the minute announcement reads `labels.minute`, so its default changes from `Minutes` to `Minute`
  - `ui.cssClass` is applied to one element instead of two
- Package and CSS:
  - the plugins no longer ship UMD builds (the UMD core never exposed `PluginRegistry`, so they could not be registered from a `<script>` tag). The core UMD build stays
  - about 50 CSS custom properties that no rule reads are removed, for example `--tp-tertiary-container`, `--tp-on-tertiary-container`, `--tp-radius`, `--tp-hover-bg` and 18 of the 34 `--tp-size-*` tokens. 5.0 lists them all
  - the `./plugins/*` wildcard in `package.json` `exports` is removed, while `./plugins/range`, `./plugins/timezone` and `./plugins/wheel` stay
  - `crane-straight` becomes a variant of `crane` with square corners (option name not decided)
  - `ui.keyboardIcon` / `ui.clockIcon` take an element or a factory function instead of an HTML string

Details are on the [roadmap](https://timepicker-ui.vercel.app/docs/roadmap).

## Development

See [`app/README.md`](./app/README.md).

## Contributing

Issues and PRs welcome on [GitHub](https://github.com/pglejzer/timepicker-ui/issues).

## License

MIT © [Piotr Glejzer](https://github.com/pglejzer)
