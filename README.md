# timepicker-ui

Modern time picker library built with TypeScript. Works with any framework or vanilla JavaScript.

[![npm version](https://badge.fury.io/js/timepicker-ui.svg)](https://badge.fury.io/js/timepicker-ui)
[![downloads](https://img.shields.io/npm/dw/timepicker-ui)](https://npmcharts.com/compare/timepicker-ui?minimal=true)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://img.shields.io/npm/l/timepicker-ui)

[Live Demo](https://timepicker-ui.vercel.app/) • [Documentation](https://timepicker-ui.vercel.app/docs) • [Changelog](./CHANGELOG.md)

**Upgrading from v2?** Check the [upgrade guide](#upgrade-guide-v2--v3) below.

## Features

- 11 built-in themes (Material, Crane, Dark, Glassmorphic, Cyberpunk, and more)
- Mobile-first design with touch support
- Framework agnostic - works with React, Vue, Angular, Svelte, or vanilla JS
- Full TypeScript support
- Inline mode for always-visible timepicker
- ARIA-compliant and keyboard accessible
- SSR compatible
- Lightweight with tree-shaking support

## Known Limitations

This project is actively maintained. Some areas planned for improvement:

- No unit/integration tests yet
- Some files need refactoring
- A few `any` types remain in the codebase
- No performance monitoring

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
  theme: "dark",
  clockType: "24h",
  animation: true,
  backdrop: true,
  onConfirm: (data) => {
    console.log("Selected time:", data);
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

### Key Options

| Option                      | Type           | Default        | Description                             |
| --------------------------- | -------------- | -------------- | --------------------------------------- |
| `clockType`                 | `12h` / `24h`  | `12h`          | Clock format                            |
| `theme`                     | string         | `basic`        | UI theme (11 themes available)          |
| `animation`                 | boolean        | `true`         | Enable animations                       |
| `backdrop`                  | boolean        | `true`         | Show backdrop overlay                   |
| `editable`                  | boolean        | `false`        | Allow manual input editing              |
| `mobile`                    | boolean        | `false`        | Force mobile version                    |
| `disabledTime`              | object         | `undefined`    | Disable specific hours/minutes          |
| `incrementHours`            | number         | `1`            | Hour increment step                     |
| `incrementMinutes`          | number         | `1`            | Minute increment step                   |
| `autoSwitchToMinutes`       | boolean        | `true`         | Auto-switch to minutes after hour       |
| `amLabel`                   | string         | `AM`           | Custom AM label text                    |
| `pmLabel`                   | string         | `PM`           | Custom PM label text                    |
| `okLabel`                   | string         | `OK`           | OK button text                          |
| `cancelLabel`               | string         | `Cancel`       | Cancel button text                      |
| `timeLabel`                 | string         | `Select time`  | Time label on desktop version           |
| `mobileTimeLabel`           | string         | `Enter Time`   | Time label on mobile version            |
| `hourMobileLabel`           | string         | `Hour`         | Hour label on mobile version            |
| `minuteMobileLabel`         | string         | `Minute`       | Minute label on mobile version          |
| `appendModalSelector`       | string         | `""`           | Append timepicker to custom selector    |
| `enableScrollbar`           | boolean        | `false`        | Enable scroll if timepicker is open     |
| `enableSwitchIcon`          | boolean        | `false`        | Show icon to switch desktop/mobile      |
| `focusInputAfterCloseModal` | boolean        | `false`        | Focus input after close modal           |
| `iconTemplate`              | string         | keyboard SVG   | Custom template for desktop switch icon |
| `iconTemplateMobile`        | string         | schedule SVG   | Custom template for mobile switch icon  |
| `currentTime`               | boolean/object | `undefined`    | Set current time to input/picker        |
| `focusTrap`                 | boolean        | `true`         | Focus trap to modal elements            |
| `delayHandler`              | number         | `300`          | Delay for clickable elements (ms)       |
| `id`                        | string         | auto-generated | Custom ID for timepicker instance       |
| `inline`                    | object         | `undefined`    | Inline mode configuration               |
| `cssClass`                  | string         | `undefined`    | Additional custom CSS class             |
| `onConfirm`                 | function       | `undefined`    | Callback when time is confirmed         |
| `onCancel`                  | function       | `undefined`    | Callback when cancelled                 |
| `onOpen`                    | function       | `undefined`    | Callback when picker opens              |
| `onUpdate`                  | function       | `undefined`    | Callback when time is updated           |
| `onSelectHour`              | function       | `undefined`    | Callback when hour is selected          |
| `onSelectMinute`            | function       | `undefined`    | Callback when minute is selected        |
| `onSelectAM`                | function       | `undefined`    | Callback when AM is selected            |
| `onSelectPM`                | function       | `undefined`    | Callback when PM is selected            |
| `onError`                   | function       | `undefined`    | Callback when error occurs              |

### Themes

Available themes: `basic`, `crane`, `crane-straight`, `m3-green`, `m2`, `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`

```javascript
import "timepicker-ui/main.css"; // Required base styles
import "timepicker-ui/theme-dark.css"; // Specific theme

const picker = new TimepickerUI(input, {
  theme: "dark",
});
```

### Disabled Time

```javascript
const picker = new TimepickerUI(input, {
  disabledTime: {
    hours: [1, 3, 5, 8],
    minutes: [15, 30, 45],
    interval: "10:00 AM - 2:00 PM",
  },
});
```

### Inline Mode

```javascript
const picker = new TimepickerUI(input, {
  inline: {
    enabled: true,
    containerId: "timepicker-container",
    showButtons: false,
    autoUpdate: true,
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

Listen to timepicker events using the new **EventEmitter API** (recommended) or the legacy DOM events (deprecated, will be removed in v4):

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

### Legacy DOM Events (Deprecated)

**Note:** DOM events (e.g., `timepicker:confirm`) are deprecated and will be removed in v4. Please migrate to the new EventEmitter API shown above.

```javascript
input.addEventListener("timepicker:confirm", (e) => {
  console.log("Time:", e.detail);
});

input.addEventListener("timepicker:cancel", (e) => {
  console.log("Cancelled");
});
```

Available legacy events: `timepicker:open`, `timepicker:cancel`, `timepicker:confirm`, `timepicker:update`, `timepicker:select-hour`, `timepicker:select-minute`, `timepicker:select-am`, `timepicker:select-pm`, `timepicker:error`

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
