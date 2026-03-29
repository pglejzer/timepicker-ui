# timepicker-ui

Highly customizable time picker with clock and wheel modes, built for modern frameworks and SSR. Works with any framework or vanilla JavaScript.

[![npm version](https://badge.fury.io/js/timepicker-ui.svg)](https://badge.fury.io/js/timepicker-ui)
[![downloads](https://img.shields.io/npm/dm/timepicker-ui)](https://npmcharts.com/compare/timepicker-ui?minimal=true)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://img.shields.io/npm/l/timepicker-ui)
[![Coverage Status](https://coveralls.io/repos/github/pglejzer/timepicker-ui/badge.svg?branch=main)](https://coveralls.io/github/pglejzer/timepicker-ui?branch=main)
[![Tests](https://github.com/pglejzer/timepicker-ui/actions/workflows/tests.yml/badge.svg)](https://github.com/pglejzer/timepicker-ui/actions/workflows/tests.yml)
[![Socket Badge](https://badge.socket.dev/npm/package/timepicker-ui/4.3.0)](https://badge.socket.dev/npm/package/timepicker-ui/4.3.0)

[Live Demo](https://timepicker-ui.vercel.app/) • [Documentation](https://timepicker-ui.vercel.app/docs) • [Changelog](./CHANGELOG.md) • [React Wrapper](https://github.com/pglejzer/timepicker-ui-react)

## Why timepicker-ui?

- **Zero dependencies** - no bloat, no supply-chain risk
- **Multiple UI modes** - analog clock, scroll wheel, compact popover - not just one layout
- **Plugin architecture** - range picker, timezone selector, wheel mode - import only what you need
- **SSR safe** - works in Next.js, Nuxt, Remix, Astro without hacks
- **Any framework** - React, Vue, Angular, Svelte, or plain JS - same API everywhere
- **Accessible** - ARIA attributes, keyboard navigation, focus trap, screen reader support

## Features

- [10 built-in themes](https://timepicker-ui.vercel.app/docs/features/themes) (Material, Crane, Dark, Glassmorphic, Cyberpunk, and more)
- [Analog clock](https://timepicker-ui.vercel.app/examples/basic/getting-started), [wheel](https://timepicker-ui.vercel.app/examples/plugins/wheel), and [compact-wheel](https://timepicker-ui.vercel.app/examples/plugins/wheel) picker modes
- [Inline mode](https://timepicker-ui.vercel.app/docs/features/inline-mode), [clear button](https://timepicker-ui.vercel.app/docs/features/clear-button), [disabled time ranges](https://timepicker-ui.vercel.app/docs/features/disabled-time)
- [Mobile-first](https://timepicker-ui.vercel.app/docs/features/mobile) with touch & keyboard support
- Framework agnostic - React, Vue, Angular, Svelte, vanilla JS
- Full [TypeScript support](https://timepicker-ui.vercel.app/docs/api/typescript), SSR compatible, true tree-shaking

## Installation

Full guide: [Installation docs](https://timepicker-ui.vercel.app/docs/installation)

```bash
npm install timepicker-ui
```

## Quick Start

Full guide: [Quick Start docs](https://timepicker-ui.vercel.app/docs/quick-start)

```html
<input id="timepicker" type="text" />
```

```javascript
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

const picker = new TimepickerUI(document.querySelector("#timepicker"), {
  clock: { type: "24h" },
  ui: { theme: "dark" },
  callbacks: {
    onConfirm: (data) => console.log("Selected:", data),
  },
});
picker.create();
```

> **Global CSS required** - make sure your project includes `box-sizing: border-box` (most frameworks do this by default).

## API

Full reference: [Methods](https://timepicker-ui.vercel.app/docs/api/methods) · [Events](https://timepicker-ui.vercel.app/docs/api/events) · [TypeScript](https://timepicker-ui.vercel.app/docs/api/typescript)

```javascript
picker.create();           // Initialize
picker.open();             // Open programmatically
picker.close();            // Close
picker.destroy();          // Clean up
picker.getValue();         // Get current time string
picker.setValue("14:30");  // Set time
picker.update({ ... });    // Update options at runtime

// Events
picker.on("confirm", (data) => {});
picker.on("cancel", (data) => {});
picker.on("open", () => {});
picker.on("update", (data) => {});
picker.on("clear", (data) => {});
picker.on("error", (data) => {});
picker.once("confirm", handler);
picker.off("confirm", handler);

// Static
TimepickerUI.getById("my-id");
TimepickerUI.getAllInstances();
TimepickerUI.destroyAll();
```

## Options Overview

Options are grouped into logical namespaces. Full reference: [Options docs](https://timepicker-ui.vercel.app/docs/api/options) · [Configuration guide](https://timepicker-ui.vercel.app/docs/configuration)

```typescript
new TimepickerUI(input, {
  clock: {
    type: "12h" | "24h",        // default: "12h"
    incrementHours: 1,
    incrementMinutes: 1,
    disabledTime: { hours: [], minutes: [], interval: "" },
    currentTime: boolean | object,
  },
  ui: {
    theme: "basic" | "dark" | "m3-green" | "crane" | ...,  // 10 themes
    mode: "clock" | "wheel" | "compact-wheel",             // default: "clock"
    animation: true,
    backdrop: true,
    mobile: false,
    editable: false,
    inline: { enabled: false, containerId: "", showButtons: true, autoUpdate: false },
    clearButton: false,
    cssClass: "",
  },
  labels: { am, pm, ok, cancel, time, mobileTime, mobileHour, mobileMinute, clear },
  behavior: { focusTrap: true, focusInputAfterClose: false, delayHandler: 300, id: "" },
  callbacks: { onConfirm, onCancel, onOpen, onUpdate, onSelectHour, onSelectMinute, onSelectAM, onSelectPM, onError, onClear },
  wheel: { placement: "auto" | "top" | "bottom", hideFooter: false, commitOnScroll: false, hideDisabled: false, ignoreOutsideClick: false },
});
```

## Themes

Browse all themes: [Theme docs](https://timepicker-ui.vercel.app/docs/features/themes) · [Live examples](https://timepicker-ui.vercel.app/examples/themes/basic) · [Custom styling](https://timepicker-ui.vercel.app/docs/advanced/styling)

Available: `basic`, `crane`, `crane-straight`, `m3-green`, `m2`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`

```javascript
import "timepicker-ui/main.css"; // always required
import "timepicker-ui/theme-dark.css"; // theme-specific stylesheet

new TimepickerUI(input, { ui: { theme: "dark" } });
```

## Plugins

Docs: [Plugins overview](https://timepicker-ui.vercel.app/docs/features/plugins) · Examples: [Range](https://timepicker-ui.vercel.app/examples/plugins/range) · [Timezone](https://timepicker-ui.vercel.app/examples/plugins/timezone) · [Wheel](https://timepicker-ui.vercel.app/examples/plugins/wheel)

```javascript
import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";
import { TimezonePlugin } from "timepicker-ui/plugins/timezone";
import { WheelPlugin } from "timepicker-ui/plugins/timezone";

// Register once at app startup
PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);
PluginRegistry.register(WheelPlugin);

new TimepickerUI(input, { range: { enabled: true } });
```

## Upgrading

- **v3 → v4** - grouped options, EventEmitter API, CSS classes renamed. See [Migration Guide](https://timepicker-ui.vercel.app/docs/migration-guide) · [Breaking Changes](./readme/BREAKING_CHANGES_V4.md) · [CHANGELOG](./CHANGELOG.md)
- **v2 → v3** - CSS must be imported manually, event names changed. See [Legacy Migration](https://timepicker-ui.vercel.app/docs/legacy-migration) · [CHANGELOG](./CHANGELOG.md)

## Framework Integration

Full examples: [React](https://timepicker-ui.vercel.app/react) · [Vue / Angular / Svelte](https://timepicker-ui.vercel.app/docs/quick-start)

**React (quick example)**

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

> There is also a dedicated [React wrapper package](https://github.com/pglejzer/timepicker-ui-react).

## Development

See [`app/README.md`](./app/README.md) for local development setup.

## Contributing

Contributions welcome! [Open an issue or PR](https://github.com/pglejzer/timepicker-ui/issues).

## License

MIT © [Piotr Glejzer](https://github.com/pglejzer)
