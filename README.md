# timepicker-ui

> ⚠️ **Upgrading from v2 to v3?**  
> Major changes were introduced in version 3.0.  
> 👉 [Click here to view the Upgrade Guide](#📈-upgrade-guide-v2-→-v3)

A modern, lightweight, and fully customizable time picker library built with TypeScript. Features Google's Material Design principles with extensive theming support and framework-agnostic architecture.

[![npm version](https://badge.fury.io/js/timepicker-ui.svg)](https://badge.fury.io/js/timepicker-ui)
[![downloads](https://img.shields.io/npm/dw/timepicker-ui)](https://npmcharts.com/compare/timepicker-ui?minimal=true)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://img.shields.io/npm/l/timepicker-ui)

---

## 📦 Live Demo

Curious how it works in practice?  
👉 [Click here to see live examples](https://pglejzer.github.io/timepicker-ui/)

---

## ✨ Features

- 🎨 **9 Built-in Themes** — Material, Crane, Dark, Glassmorphic, Cyberpunk, AI, and more
- 📱 **Mobile-First Design** — Responsive with touch and keyboard support
- 🚀 **Framework Agnostic** — Works with vanilla JS, React, Vue, Angular, and others
- 🔧 **TypeScript Support** — Full type definitions and IntelliSense
- 🎯 **Inline Mode** — Always-visible timepicker without modal overlay
- 🛠️ **Rich API** — Comprehensive methods and event system
- ♿ **Accessible** — ARIA-compliant with keyboard navigation
- 🌐 **SSR Compatible** — Works with Next.js, Nuxt, and other SSR frameworks
- 📦 **Lightweight** — Minimal footprint with tree-shaking support

---

## 🚀 Installation

```bash
npm install timepicker-ui
# or
yarn add timepicker-ui
```

---

## 📖 Quick Start

### Basic Usage

```html
<input id="timepicker" type="text" />
```

```javascript
import { TimepickerUI } from "timepicker-ui";

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
});
picker.create();
```

### React Integration

```tsx
import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

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

---

## ⚙️ Configuration Options

| Option                           | Type                | Default         | Description                                          |
| -------------------------------- | ------------------- | --------------- | ---------------------------------------------------- |
| `amLabel`                        | `string`            | `"AM"`          | Custom text for AM label                             |
| `animation`                      | `boolean`           | `true`          | Enable/disable open/close animations                 |
| `appendModalSelector`            | `string`            | `""`            | DOM selector to append timepicker (defaults to body) |
| `backdrop`                       | `boolean`           | `true`          | Show/hide backdrop overlay                           |
| `cancelLabel`                    | `string`            | `"CANCEL"`      | Text for cancel button                               |
| `clockType`                      | `"12h" \| "24h"`    | `"12h"`         | Clock format type                                    |
| `cssClass`                       | `string`            | `undefined`     | Additional CSS class for timepicker wrapper          |
| `currentTime`                    | `boolean \| object` | `undefined`     | Set current time to input and picker                 |
| `delayHandler`                   | `number`            | `300`           | Debounce delay for buttons (ms)                      |
| `disabledTime`                   | `object`            | `undefined`     | Disable specific hours, minutes, or intervals        |
| `editable`                       | `boolean`           | `false`         | Allow manual input editing                           |
| `enableScrollbar`                | `boolean`           | `false`         | Keep page scroll when picker is open                 |
| `enableSwitchIcon`               | `boolean`           | `false`         | Show desktop/mobile switch icon                      |
| `focusInputAfterCloseModal`      | `boolean`           | `false`         | Focus input after closing modal                      |
| `focusTrap`                      | `boolean`           | `true`          | Trap focus within modal                              |
| `hourMobileLabel`                | `string`            | `"Hour"`        | Hour label for mobile version                        |
| `iconTemplate`                   | `string`            | Material Icons  | HTML template for desktop switch icon                |
| `iconTemplateMobile`             | `string`            | Material Icons  | HTML template for mobile switch icon                 |
| `id`                             | `string`            | `undefined`     | Custom ID for timepicker instance                    |
| `incrementHours`                 | `number`            | `1`             | Hour increment step (1, 2, 3)                        |
| `incrementMinutes`               | `number`            | `1`             | Minute increment step (1, 5, 10, 15)                 |
| `inline`                         | `object`            | `undefined`     | Inline mode configuration                            |
| `minuteMobileLabel`              | `string`            | `"Minute"`      | Minute label for mobile version                      |
| `mobile`                         | `boolean`           | `false`         | Force mobile version                                 |
| `mobileTimeLabel`                | `string`            | `"Enter Time"`  | Time label for mobile version                        |
| `okLabel`                        | `string`            | `"OK"`          | Text for OK button                                   |
| `pmLabel`                        | `string`            | `"PM"`          | Custom text for PM label                             |
| `switchToMinutesAfterSelectHour` | `boolean`           | `true`          | Auto-switch to minutes after hour selection          |
| `theme`                          | Theme               | `"basic"`       | UI theme (see themes section)                        |
| `timeLabel`                      | `string`            | `"Select Time"` | Time label for desktop version                       |

### Inline Mode Configuration

```javascript
const picker = new TimepickerUI(input, {
  inline: {
    enabled: true,
    containerId: "timepicker-container",
    showButtons: false, // Hide OK/Cancel buttons
    autoUpdate: true, // Auto-update input on change
  },
});
```

### Disabled Time Configuration

```javascript
const picker = new TimepickerUI(input, {
  disabledTime: {
    hours: [1, 3, 5, 8], // Disable specific hours
    minutes: [15, 30, 45], // Disable specific minutes
    interval: "10:00 AM - 2:00 PM", // Disable time range
  },
});
```

---

## 🎨 Themes

> **Note:** As of v3.0, you must import CSS styles manually. See [Upgrade Guide](#upgrade-guide-v2--v3) for details.

Choose from 9 built-in themes:

| Theme            | Description                            |
| ---------------- | -------------------------------------- |
| `basic`          | Default Material Design theme          |
| `crane-straight` | Google Crane theme with straight edges |
| `crane-radius`   | Google Crane theme with rounded edges  |
| `m3`             | Material Design 3 (Material You)       |
| `dark`           | Dark mode theme                        |
| `glassmorphic`   | Modern glass effect                    |
| `pastel`         | Soft pastel colors                     |
| `ai`             | Futuristic AI-inspired theme           |
| `cyberpunk`      | Neon cyberpunk aesthetic               |

```javascript
const picker = new TimepickerUI(input, {
  theme: "cyberpunk",
});
```

---

## 📞 Callbacks

Configure callback functions to handle timepicker events:

| Callback         | Type             | Description                                    |
| ---------------- | ---------------- | ---------------------------------------------- |
| `onOpen`         | `(data) => void` | Triggered when timepicker opens                |
| `onCancel`       | `(data) => void` | Triggered when picker is cancelled             |
| `onConfirm`      | `(data) => void` | Triggered when time is confirmed (OK clicked)  |
| `onUpdate`       | `(data) => void` | Triggered during clock interaction (real-time) |
| `onSelectHour`   | `(data) => void` | Triggered when hour mode is activated          |
| `onSelectMinute` | `(data) => void` | Triggered when minute mode is activated        |
| `onSelectAM`     | `(data) => void` | Triggered when AM is selected                  |
| `onSelectPM`     | `(data) => void` | Triggered when PM is selected                  |
| `onError`        | `(data) => void` | Triggered when invalid time format is detected |

### Callback Data Structure

```typescript
interface CallbackData {
  hour?: string;
  minutes?: string;
  type?: string; // 'AM' or 'PM'
  degreesHours?: number;
  degreesMinutes?: number;
  error?: string; // Only for onError
  // ... additional context data
}
```

### Example Usage

```javascript
const picker = new TimepickerUI(input, {
  onConfirm: (data) => {
    console.log(`Time selected: ${data.hour}:${data.minutes} ${data.type}`);
  },
  onCancel: (data) => {
    console.log("User cancelled time selection");
  },
  onError: (data) => {
    alert(`Invalid time format: ${data.error}`);
  },
});
```

---

## 🎯 Events

Listen to DOM events dispatched on the input element:

| Event                      | Description                        |
| -------------------------- | ---------------------------------- |
| `timepicker:open`          | Fired when timepicker opens        |
| `timepicker:cancel`        | Fired when user cancels            |
| `timepicker:confirm`       | Fired when time is confirmed       |
| `timepicker:update`        | Fired during clock interaction     |
| `timepicker:select-hour`   | Fired when hour mode is selected   |
| `timepicker:select-minute` | Fired when minute mode is selected |
| `timepicker:select-am`     | Fired when AM is selected          |
| `timepicker:select-pm`     | Fired when PM is selected          |
| `timepicker:error`         | Fired when input validation fails  |

### Event Usage

```javascript
const input = document.querySelector("#timepicker");
const picker = new TimepickerUI(input);
picker.create();

// Listen to events
input.addEventListener("timepicker:confirm", (e) => {
  console.log("Time confirmed:", e.detail);
  // e.detail contains: { hour, minutes, type, degreesHours, degreesMinutes }
});

input.addEventListener("timepicker:cancel", (e) => {
  console.log("Cancelled:", e.detail);
});

input.addEventListener("timepicker:error", (e) => {
  console.error("Error:", e.detail.error);
});
```

---

## 🛠️ API Methods

### Instance Methods

```javascript
const picker = new TimepickerUI(input, options);

// Core methods
picker.create(); // Initialize the timepicker
picker.open(); // Open the timepicker programmatically
picker.close(); // Close the timepicker
picker.destroy(); // Destroy instance and clean up

// Value methods
picker.getValue(); // Get current time value
picker.setValue("14:30"); // Set time programmatically

// Configuration methods
picker.update({ options: newOptions }); // Update configuration
picker.getElement(); // Get the DOM element
```

### Static Methods

```javascript
// Instance management
TimepickerUI.getById("my-id"); // Get instance by ID
TimepickerUI.getAllInstances(); // Get all active instances
TimepickerUI.destroyAll(); // Destroy all instances
TimepickerUI.isAvailable(element); // Check if element exists
```

### Method Examples

```javascript
// Get current value
const currentTime = picker.getValue();
console.log(currentTime);
// Output: { hour: '14', minutes: '30', type: '', time: '14:30', degreesHours: 30, degreesMinutes: 180 }

// Set new time
picker.setValue("09:15 AM");

// Update configuration
picker.update({
  options: { theme: "dark", clockType: "24h" },
  create: true, // Reinitialize after update
});

// Instance management
const picker1 = new TimepickerUI("#picker1", { id: "picker-1" });
const picker2 = new TimepickerUI("#picker2", { id: "picker-2" });

// Later...
const foundPicker = TimepickerUI.getById("picker-1");
```

---

## 🆕 What's New in v3.0

### ✅ New Features

- **Inline Mode**: Always-visible timepicker without modal overlay
- **Instance Management**: `getById()`, `destroyAll()`, and custom instance IDs
- **Callback System**: Direct callback functions instead of manual event listeners
- **New Themes**: Added `dark`, `glassmorphic`, `pastel`, `ai`, `cyberpunk`
- **Enhanced API**: `getValue()`, `setValue()`, improved `destroy()`
- **SSR Compatibility**: Better support for server-side rendering
- **TypeScript Improvements**: Complete type definitions and better IntelliSense

### 🔄 Breaking Changes

- **Event Names**: All events now use `timepicker:` prefix
- **Destroy Behavior**: `.destroy()` no longer removes input from DOM
- **Theme Options**: Some theme names have changed
- **API Changes**: Some method signatures have been updated
- **Styles are no longer auto-loaded**
  You must now explicitly import CSS files. Use:

  - `main.css` – core styles with `basic` theme only
  - `index.css` – all styles including all themes
  - or import specific themes from `themes/`

---

## 📈 Upgrade Guide: v2 → v3

### 1. Update Event Listeners

**v2 (Old):**

```javascript
input.addEventListener('show', (e) => { ... });
input.addEventListener('cancel', (e) => { ... });
input.addEventListener('accept', (e) => { ... });
```

**v3 (New):**

```javascript
input.addEventListener('timepicker:open', (e) => { ... });
input.addEventListener('timepicker:cancel', (e) => { ... });
input.addEventListener('timepicker:confirm', (e) => { ... });
```

### 2. Replace Event Listeners with Callbacks

**v2 (Old):**

```javascript
const picker = new TimepickerUI(input);
input.addEventListener("accept", (e) => {
  console.log("Time selected:", e.detail);
});
```

**v3 (New):**

```javascript
const picker = new TimepickerUI(input, {
  onConfirm: (data) => {
    console.log("Time selected:", data);
  },
});
```

### 3. Update Destroy Method Usage

**v2 (Old):**

```javascript
picker.destroy(); // This removed the input from DOM
```

**v3 (New):**

```javascript
picker.destroy(); // Only destroys timepicker, keeps input intact
// If you need to remove input, do it manually:
// input.remove();
```

### 4. Theme Updates

**v2 (Old):**

```javascript
// Limited theme options
theme: "basic" | "crane-straight" | "crane-radius" | "m3";
```

**v3 (New):**

```javascript
// Extended theme options
theme: "basic" |
  "crane-straight" |
  "crane-radius" |
  "m3" |
  "dark" |
  "glassmorphic" |
  "pastel" |
  "ai" |
  "cyberpunk";
```

### 5. Add Inline Mode (Optional)

**v3 New Feature:**

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

### 6. Instance Management (Optional)

**v3 New Feature:**

```javascript
// Create with custom ID
const picker = new TimepickerUI(input, { id: "my-timepicker" });

// Later, get by ID
const foundPicker = TimepickerUI.getById("my-timepicker");

// Destroy all instances
TimepickerUI.destroyAll();
```

### 7. Import CSS Manually (New Requirement)

**v2 (Old):**
Styles were bundled and automatically injected.

**v3 (New):**
You must now import the styles yourself:

#### Option 1 – All-in-one (includes every theme):

```js
import "timepicker-ui/index.css";
```

#### Option 2 – Core only (main styles + basic theme):

```js
import "timepicker-ui/main.css";
```

#### Option 3 – Use only the theme you need:

```js
import "timepicker-ui/main.css"; // Required base
import "timepicker-ui/theme-dark.css"; // Or any other theme
```

---

## 🌐 Framework Integration

### React

```tsx
import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

function TimePicker({ onChange }) {
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      pickerRef.current = new TimepickerUI(inputRef.current, {
        theme: "dark",
        onConfirm: (data) => {
          onChange?.(data);
        },
      });
      pickerRef.current.create();
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, [onChange]);

  return <input ref={inputRef} type="text" />;
}
```

### Vue 3

```vue
<template>
  <input ref="inputRef" type="text" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { TimepickerUI } from "timepicker-ui";

const inputRef = ref(null);
let picker = null;

const emit = defineEmits(["time-selected"]);

onMounted(() => {
  picker = new TimepickerUI(inputRef.value, {
    theme: "glassmorphic",
    onConfirm: (data) => {
      emit("time-selected", data);
    },
  });
  picker.create();
});

onUnmounted(() => {
  picker?.destroy();
});
</script>
```

### Angular

```typescript
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { TimepickerUI } from "timepicker-ui";

@Component({
  selector: "app-timepicker",
  template: '<input #timepickerInput type="text" />',
})
export class TimepickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild("timepickerInput") inputRef!: ElementRef;
  private picker!: TimepickerUI;

  ngAfterViewInit() {
    this.picker = new TimepickerUI(this.inputRef.nativeElement, {
      theme: "ai",
      onConfirm: (data) => {
        console.log("Time selected:", data);
      },
    });
    this.picker.create();
  }

  ngOnDestroy() {
    this.picker?.destroy();
  }
}
```

---

## 🔧 Development

All development and build tooling is located in the [`app/`](./app) directory.
Please refer to [`app/README.md`](./app/README.md) for instructions on running the development server, building the library, running tests, and using the full toolchain.

---

## 📄 License

MIT © [Piotr Glejzer](https://github.com/pglejzer)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/pglejzer/timepicker-ui/issues).

---

## 📊 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Chrome Android 60+

---

## 🙋‍♂️ Support

- 📖 [Documentation](https://pglejzer.github.io/timepicker-ui-docs/)
- 🐛 [Report Bug](https://github.com/pglejzer/timepicker-ui/issues)
- 💡 [Request Feature](https://github.com/pglejzer/timepicker-ui/issues)
- 💬 [Discussions](https://github.com/pglejzer/timepicker-ui/discussions)
