# timepicker-ui

Modern time picker library built with TypeScript. Works with any framework or vanilla JavaScript.

[![npm version](https://badge.fury.io/js/timepicker-ui.svg)](https://badge.fury.io/js/timepicker-ui)
[![downloads](https://img.shields.io/npm/dm/timepicker-ui)](https://npmcharts.com/compare/timepicker-ui?minimal=true)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://img.shields.io/npm/l/timepicker-ui)
[![Coverage Status](https://coveralls.io/repos/github/pglejzer/timepicker-ui/badge.svg?branch=main)](https://coveralls.io/github/pglejzer/timepicker-ui?branch=main)
[![Tests](https://github.com/pglejzer/timepicker-ui/actions/workflows/tests.yml/badge.svg)](https://github.com/pglejzer/timepicker-ui/actions/workflows/tests.yml)

[Live Demo](https://timepicker-ui.vercel.app/) • [Documentation](https://timepicker-ui.vercel.app/docs) • [React Wrapper](https://github.com/pglejzer/timepicker-ui-react) • [Changelog](./CHANGELOG.md)

**Upgrading from v3?** Check the [upgrade guide](#upgrade-guide-v3--v4) below.
**Upgrading from v2?** Check the [v2 → v3 upgrade guide](#upgrade-guide-v2--v3).

## Features

- 10 built-in themes (Material, Crane, Dark, Glassmorphic, Cyberpunk, and more)
- Mobile-first design with touch support
- Framework agnostic - works with React, Vue, Angular, Svelte, or vanilla JS
- Full TypeScript support
- Inline mode for always-visible timepicker
- ARIA-compliant and keyboard accessible
- SSR compatible
- Lightweight with tree-shaking support

## Plugins

Optional features available as separate imports to reduce core bundle size:

```javascript
import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";
import { TimezonePlugin } from "timepicker-ui/plugins/timezone";

// Register plugins before creating instances
PluginRegistry.register(RangePlugin);
PluginRegistry.register(TimezonePlugin);
```

Register plugins once at app startup, then use features via options.

```javascript
import { TimepickerUI, PluginRegistry } from "timepicker-ui";
import { RangePlugin } from "timepicker-ui/plugins/range";

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: { enabled: true },
});
```

## Contributions

Contributions welcome! Feel free to [open an issue or PR](https://github.com/pglejzer/timepicker-ui/issues).

## Installation

```bash
npm install timepicker-ui
```

## Important: Global CSS Required

Your app needs this global CSS rule for correct styling:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Most projects include this by default.

## Quick Start

### Basic Usage

```html
<input id="timepicker" type="text" />
```

```javascript
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

const input = document.querySelector("#timepicker");
const picker = new TimepickerUI(input);
picker.create();
```

### With Options

```javascript
const picker = new TimepickerUI(input, {
  ui: {
    theme: "dark",
    animation: true,
    backdrop: true,
  },
  clock: {
    type: "24h",
  },
  callbacks: {
    onConfirm: (data) => {
      console.log("Selected time:", data);
    },
  },
});
picker.create();
```

### React Example

```tsx
import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

function TimePickerComponent() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const picker = new TimepickerUI(inputRef.current, {
        callbacks: {
          onConfirm: (data) => {
            console.log("Time selected:", data);
        },
      });
      picker.create();

      return () => picker.destroy();
    }
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

## Configuration

Full documentation available at [timepicker-ui.vercel.app/docs](https://timepicker-ui.vercel.app/docs)

### Options Structure (v4.0.0 Breaking Change)

**Options are now organized into 5 logical groups:**

```typescript
const picker = new TimepickerUI(input, {
  clock: ClockOptions, // Clock behavior (type, increments, disabled time)
  ui: UIOptions, // Appearance (theme, animation, mobile, inline)
  labels: LabelsOptions, // Text labels (AM/PM, buttons, headers)
  behavior: BehaviorOptions, // Behavior (focus, delays, ID)
  callbacks: CallbacksOptions, // Event handlers
});
```

### Clock Options

| Property              | Type           | Default     | Description                     |
| --------------------- | -------------- | ----------- | ------------------------------- |
| `type`                | `12h` / `24h`  | `12h`       | Clock format                    |
| `incrementHours`      | number         | `1`         | Hour increment step             |
| `incrementMinutes`    | number         | `1`         | Minute increment step           |
| `smoothHourSnap`      | boolean        | `true`      | Smooth hour dragging with snap  |
| `autoSwitchToMinutes` | boolean        | `true`      | Auto-switch after hour selected |
| `disabledTime`        | object         | `undefined` | Disable specific hours/minutes  |
| `currentTime`         | boolean/object | `undefined` | Set current time to input       |

### UI Options

| Property              | Type    | Default     | Description                     |
| --------------------- | ------- | ----------- | ------------------------------- |
| `theme`               | string  | `basic`     | Theme (11 themes available)     |
| `animation`           | boolean | `true`      | Enable animations               |
| `backdrop`            | boolean | `true`      | Show backdrop overlay           |
| `mobile`              | boolean | `false`     | Force mobile version            |
| `enableSwitchIcon`    | boolean | `false`     | Show desktop/mobile switch icon |
| `editable`            | boolean | `false`     | Allow manual input editing      |
| `enableScrollbar`     | boolean | `false`     | Enable scroll when picker open  |
| `cssClass`            | string  | `undefined` | Additional CSS class            |
| `appendModalSelector` | string  | `""`        | Custom container selector       |
| `iconTemplate`        | string  | SVG         | Desktop switch icon template    |
| `iconTemplateMobile`  | string  | SVG         | Mobile switch icon template     |
| `inline`              | object  | `undefined` | Inline mode configuration       |

### Labels Options

| Property       | Type   | Default       | Description         |
| -------------- | ------ | ------------- | ------------------- |
| `am`           | string | `AM`          | AM label text       |
| `pm`           | string | `PM`          | PM label text       |
| `ok`           | string | `OK`          | OK button text      |
| `cancel`       | string | `Cancel`      | Cancel button text  |
| `time`         | string | `Select time` | Desktop time label  |
| `mobileTime`   | string | `Enter Time`  | Mobile time label   |
| `mobileHour`   | string | `Hour`        | Mobile hour label   |
| `mobileMinute` | string | `Minute`      | Mobile minute label |

### Behavior Options

| Property               | Type    | Default        | Description             |
| ---------------------- | ------- | -------------- | ----------------------- |
| `focusInputAfterClose` | boolean | `false`        | Focus input after close |
| `focusTrap`            | boolean | `true`         | Trap focus in modal     |
| `delayHandler`         | number  | `300`          | Click delay (ms)        |
| `id`                   | string  | auto-generated | Custom instance ID      |

### Callbacks Options

| Property         | Type     | Description              |
| ---------------- | -------- | ------------------------ |
| `onConfirm`      | function | Time confirmed           |
| `onCancel`       | function | Cancelled                |
| `onOpen`         | function | Picker opened            |
| `onUpdate`       | function | Time updated (real-time) |
| `onSelectHour`   | function | Hour selected            |
| `onSelectMinute` | function | Minute selected          |
| `onSelectAM`     | function | AM selected              |
| `onSelectPM`     | function | PM selected              |
| `onError`        | function | Error occurred           |

### Migration from v3.x to v4.0.0

**All options must be moved into groups:**

```diff
// v3.x (DEPRECATED)
-const picker = new TimepickerUI(input, {
-  clockType: '24h',
-  theme: 'dark',
-  animation: true,
-  incrementMinutes: 5,
-  amLabel: 'AM',
-  onConfirm: (data) => {}
-});

// v4.0.0 (NEW)
+const picker = new TimepickerUI(input, {
+  clock: {
+    type: '24h',
+    incrementMinutes: 5
+  },
+  ui: {
+    theme: 'dark',
+    animation: true
+  },
+  labels: {
+    am: 'AM'
+  },
+  callbacks: {
+    onConfirm: (data) => {}
+  }
+});
```

**Full migration table:**

| v3.x (flat)                 | v4.0.0 (grouped)                |
| --------------------------- | ------------------------------- |
| `clockType`                 | `clock.type`                    |
| `incrementHours`            | `clock.incrementHours`          |
| `incrementMinutes`          | `clock.incrementMinutes`        |
| `manualMinuteSwitch`        | `clock.manualMinuteSwitch`      |
| `disabledTime`              | `clock.disabledTime`            |
| `currentTime`               | `clock.currentTime`             |
| `theme`                     | `ui.theme`                      |
| `animation`                 | `ui.animation`                  |
| `backdrop`                  | `ui.backdrop`                   |
| `mobile`                    | `ui.mobile`                     |
| `enableSwitchIcon`          | `ui.enableSwitchIcon`           |
| `editable`                  | `ui.editable`                   |
| `enableScrollbar`           | `ui.enableScrollbar`            |
| `cssClass`                  | `ui.cssClass`                   |
| `appendModalSelector`       | `ui.appendModalSelector`        |
| `iconTemplate`              | `ui.iconTemplate`               |
| `iconTemplateMobile`        | `ui.iconTemplateMobile`         |
| `inline`                    | `ui.inline`                     |
| `amLabel`                   | `labels.am`                     |
| `pmLabel`                   | `labels.pm`                     |
| `okLabel`                   | `labels.ok`                     |
| `cancelLabel`               | `labels.cancel`                 |
| `timeLabel`                 | `labels.time`                   |
| `mobileTimeLabel`           | `labels.mobileTime`             |
| `hourMobileLabel`           | `labels.mobileHour`             |
| `minuteMobileLabel`         | `labels.mobileMinute`           |
| `focusInputAfterCloseModal` | `behavior.focusInputAfterClose` |
| `focusTrap`                 | `behavior.focusTrap`            |
| `delayHandler`              | `behavior.delayHandler`         |
| `id`                        | `behavior.id`                   |
| `onConfirm`                 | `callbacks.onConfirm`           |
| `onCancel`                  | `callbacks.onCancel`            |
| `onOpen`                    | `callbacks.onOpen`              |
| `onUpdate`                  | `callbacks.onUpdate`            |
| `onSelectHour`              | `callbacks.onSelectHour`        |
| `onSelectMinute`            | `callbacks.onSelectMinute`      |
| `onSelectAM`                | `callbacks.onSelectAM`          |
| `onSelectPM`                | `callbacks.onSelectPM`          |
| `onError`                   | `callbacks.onError`             |

### Themes

Available themes: `basic`, `crane`, `crane-straight`, `m3-green`, `m2`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`

```javascript
import "timepicker-ui/main.css"; // Required base styles
import "timepicker-ui/theme-dark.css"; // Specific theme

const picker = new TimepickerUI(input, {
  ui: {
    theme: "dark",
  },
});
```

### Disabled Time

```javascript
const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      hours: [1, 3, 5, 8],
      minutes: [15, 30, 45],
      interval: "10:00 AM - 2:00 PM",
    },
  },
});
```

### Inline Mode

```javascript
const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      containerId: "timepicker-container",
      showButtons: false,
      autoUpdate: true,
    },
  },
});
```

## API Methods

### Instance Methods

```javascript
const picker = new TimepickerUI(input, options);

picker.create(); // Initialize
picker.open(); // Open programmatically
picker.close(); // Close
picker.destroy(); // Clean up
picker.getValue(); // Get current time
picker.setValue("14:30"); // Set time
picker.update({ options }); // Update configuration
```

### Static Methods

```javascript
TimepickerUI.getById("my-id"); // Get instance by ID
TimepickerUI.getAllInstances(); // Get all instances
TimepickerUI.destroyAll(); // Destroy all instances
```

## Events

Listen to timepicker events using the **EventEmitter API** (v4+) or callback options:

### EventEmitter API (Recommended)

```javascript
const picker = new TimepickerUI(input);
picker.create();

picker.on("confirm", (data) => {
  console.log("Time confirmed:", data);
});

picker.on("cancel", (data) => {
  console.log("Cancelled:", data);
});

picker.on("open", () => {
  console.log("Picker opened");
});

picker.on("update", (data) => {
  console.log("Time updated:", data);
});

picker.on("select:hour", (data) => {
  console.log("Hour selected:", data.hour);
});

picker.on("select:minute", (data) => {
  console.log("Minute selected:", data.minutes);
});

picker.on("select:am", (data) => {
  console.log("AM selected");
});

picker.on("select:pm", (data) => {
  console.log("PM selected");
});

picker.on("error", (data) => {
  console.log("Error:", data.error);
});

picker.once("confirm", (data) => {
  console.log("This runs only once");
});

picker.off("confirm", handler);
```

### Legacy DOM Events (v3.x Only)

⚠️ **Only Available in v3.x - Completely Removed in v4.0.0**

DOM events (e.g., `timepicker:confirm`) were removed in v4.0.0. Use the **EventEmitter API** shown above or **callback options** instead.

**v3.x code (no longer works in v4):**

```javascript
input.addEventListener("timepicker:confirm", (e) => {
  console.log("Time:", e.detail);
});
```

**v4.0.0 alternatives:**

```javascript
// Option 1: EventEmitter API
picker.on("confirm", (data) => {
  console.log("Time:", data);
});

// Option 2: Callback options
const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => {
      console.log("Time:", data);
    },
  },
});
```

Removed events: `timepicker:open`, `timepicker:cancel`, `timepicker:confirm`, `timepicker:update`, `timepicker:select-hour`, `timepicker:select-minute`, `timepicker:select-am`, `timepicker:select-pm`, `timepicker:error`

## Upgrade Guide: v3 → v4

### Breaking Changes

**1. CSS Class Names Renamed**

All CSS classes have been shortened from `timepicker-ui-*` to `tp-ui-*`:

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
.timepicker-ui-am {
}
.timepicker-ui-pm {
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
.tp-ui-am {
}
.tp-ui-pm {
}
```

**Impact:** If you have custom CSS targeting timepicker elements, update all class selectors.

**2. Grouped Options Structure**

All options are now organized into logical groups for better maintainability:

```javascript
// v3
const picker = new TimepickerUI(input, {
  clockType: "12h",
  theme: "dark",
  enableSwitchIcon: true,
  mobile: true,
  animation: true,
  backdrop: true,
  focusTrap: true,
  editable: true,
  onConfirm: (data) => console.log(data),
});

// v4 - Grouped options
const picker = new TimepickerUI(input, {
  clock: {
    type: "12h",
    incrementHours: 1,
    incrementMinutes: 1,
    currentTime: { time: new Date(), updateInput: true },
    disabledTime: { hours: [1, 2, 3] },
    manualMinuteSwitch: false,
  },
  ui: {
    theme: "dark",
    enableSwitchIcon: true,
    mobile: true,
    animation: true,
    backdrop: true,
    editable: true,
    cssClass: "my-custom-class",
    inline: { enabled: false },
  },
  labels: {
    time: "Select Time",
    am: "AM",
    pm: "PM",
    ok: "OK",
    cancel: "Cancel",
  },
  behavior: {
    focusTrap: true,
    focusInputAfterClose: false,
    delayHandler: 300,
  },
  callbacks: {
    onConfirm: (data) => console.log(data),
    onCancel: (data) => console.log(data),
    onOpen: (data) => console.log(data),
    onUpdate: (data) => console.log(data),
    onSelectHour: (data) => console.log(data),
    onSelectMinute: (data) => console.log(data),
    onSelectAM: (data) => console.log(data),
    onSelectPM: (data) => console.log(data),
    onError: (data) => console.log(data),
  },
});
```

**2. Legacy DOM Events Removed**

DOM events have been completely removed. Use EventEmitter API or callback options:

```javascript
// v3 - Deprecated (removed in v4)
input.addEventListener("timepicker:confirm", (e) => {
  console.log(e.detail);
});

// v4 - EventEmitter API (recommended)
picker.on("confirm", (data) => {
  console.log(data);
});

// v4 - Or use callback options
const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => console.log(data),
  },
});
```

**3. setTheme() Method Removed**

Programmatic theme setting via `setTheme()` has been removed. Use CSS classes instead:

```javascript
// v3 - Removed in v4
picker.setTheme({
  primaryColor: "#ff0000",
  backgroundColor: "#000000",
});

// v4 - Use CSS classes with CSS variables
const picker = new TimepickerUI(input, {
  ui: { cssClass: "my-custom-theme" },
});
```

```css
/* Define custom theme in CSS */
.tp-ui-wrapper.my-custom-theme {
  --tp-primary: #ff0000;
  --tp-bg: #000000;
  --tp-surface: #f0f0f0;
}
```

**4. SSR-Safe Architecture**

All modules are now SSR-safe and can be imported in Node.js environments without crashing.

### Migration Steps

1. **Update option structure** - Move options into `clock`, `ui`, `labels`, `behavior`, `callbacks` groups
2. **Replace DOM events** - Switch to `picker.on()` EventEmitter API or callback options
3. **Remove setTheme() calls** - Use CSS classes with CSS variable overrides
4. **Test SSR compatibility** - If using Next.js/Nuxt/Remix, verify hydration works correctly

### New in v4

- **Composition-based architecture** - No inheritance, pure composition with managers
- **EventEmitter API** - Type-safe event handling with `on()`, `off()`, `once()`
- **Callback bridge** - Callbacks automatically connected to EventEmitter
- **SSR compatibility** - All modules can be imported in Node.js
- **Better TypeScript types** - Fully typed event payloads and options
- **Smaller bundle** - Removed unused code, optimized build (63.3 KB ESM)
- **Focus improvements** - Auto-focus on modal open, auto-focus on minute switch

### Bundle Size Comparison

- v3: 80 KB ESM
- v4: 63.3 KB ESM (-20.9%)

---

## Upgrade Guide: v2 → v3

### Breaking Changes

**1. CSS must be imported manually**

```javascript
// v3 - Required
import "timepicker-ui/main.css";
```

**2. Event names changed**

```javascript
// v2
input.addEventListener("show", ...);
input.addEventListener("accept", ...);

// v3
input.addEventListener("timepicker:open", ...);
input.addEventListener("timepicker:confirm", ...);
```

**3. Use callbacks instead of events**

```javascript
// v3 - Recommended
const picker = new TimepickerUI(input, {
  onConfirm: (data) => console.log(data),
  onCancel: (data) => console.log("Cancelled"),
});
```

**4. destroy() behavior**

```javascript
// v2 - Removed input from DOM
picker.destroy();

// v3 - Only destroys picker, keeps input
picker.destroy();
```

### New in v3

- Inline mode
- Instance management (`getById`, `destroyAll`)
- Direct callbacks
- 5 new themes
- `getValue()` and `setValue()` methods
- Better TypeScript support
- **EventEmitter API** for modern event handling (`on`, `off`, `once`)

### Migration to EventEmitter (v3.x)

Starting in v3.x, we recommend using the new EventEmitter API instead of DOM events:

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

Benefits:

- Cleaner API without prefixes
- Better TypeScript support
- No DOM pollution
- Memory-efficient (automatic cleanup on destroy)
- Supports `once()` for one-time listeners

## Framework Integration

### React

```jsx
import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

function App() {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} placeholder="Select time" />;
}
```

### Vue 3

```vue
<template>
  <input ref="pickerInput" placeholder="Select time" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";

const pickerInput = ref(null);

onMounted(() => {
  if (!pickerInput.value) return;
  const picker = new TimepickerUI(pickerInput.value);
  picker.create();
});
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { TimepickerUI } from "timepicker-ui";

@Component({
  selector: "app-root",
  template: `<input #timepickerInput placeholder="Select time" />`,
})
export class App implements AfterViewInit {
  @ViewChild("timepickerInput") inputRef!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    const picker = new TimepickerUI(this.inputRef.nativeElement);
    picker.create();
  }
}
```

Add to `angular.json` styles:

```json
"styles": ["src/styles.css", "timepicker-ui/main.css"]
```

## Development

Development tooling is in the [`app/`](./app) directory. See [`app/README.md`](./app/README.md) for details.

## License

MIT © [Piotr Glejzer](https://github.com/pglejzer)

## Contributing

Contributions welcome! Check the [issues page](https://github.com/pglejzer/timepicker-ui/issues).

## Browser Support

Chrome 60+, Firefox 55+, Safari 12+, Edge 79+, iOS Safari 12+, Chrome Android 60+

## Support

- [Documentation](https://pglejzer.github.io/timepicker-ui-docs/)
- [Report Bug](https://github.com/pglejzer/timepicker-ui/issues)
- [Discussions](https://github.com/pglejzer/timepicker-ui/discussions)
