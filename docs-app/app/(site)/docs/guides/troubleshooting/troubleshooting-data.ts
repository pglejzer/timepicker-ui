import { slugify } from "@/lib/slugify";

export const PAGE_DESCRIPTION =
  "Fixes for common timepicker-ui problems: missing styles, plugins that are not registered, server rendering errors, double initialization and styles that do not apply.";

export const PROBLEM_GROUPS = ["Setup", "Styling", "Frameworks", "Plugins"] as const;

export type ProblemGroup = (typeof PROBLEM_GROUPS)[number];

export type Snippet = {
  language: "typescript" | "tsx" | "css" | "vue";
  source: string;
};

export type FixStep = {
  text: string;
  code?: Snippet;
};

/**
 * `title`, `text` and `why` use two inline marks: `code` and [label](href).
 * `anchor` overrides the slug of the title when a link elsewhere depends on it.
 */
type ProblemSource = {
  group: ProblemGroup;
  title: string;
  anchor?: string;
  fix: FixStep[];
  why?: string;
};

export type Problem = Omit<ProblemSource, "anchor"> & {
  anchor: string;
  symptom: string;
  faqAnswer: string;
};

export const INLINE_TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)\s]+\))/;
export const LINK_TOKEN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

export function toPlainText(text: string): string {
  return text
    .split(INLINE_TOKEN)
    .map((part, index) => {
      if (index % 2 === 0) return part;
      const link = LINK_TOKEN.exec(part);
      return link ? toPlainText(link[1]) : part.slice(1, -1);
    })
    .join("");
}

const CUSTOM_THEME_TITLE = "`ui.theme: 'my-theme'` has no effect";
const CUSTOM_THEME_ANCHOR = slugify(toPlainText(CUSTOM_THEME_TITLE));

const SOURCES: ProblemSource[] = [
  {
    group: "Setup",
    title: "The picker opens but has no styles",
    fix: [
      {
        text: "Import `timepicker-ui/main.css` once, for example in your app's entry file. It contains the core styles and the default `basic` theme.",
      },
      {
        text: "For another theme, also import `timepicker-ui/theme-<name>.css` and set `ui.theme` to the same name.",
        code: {
          language: "typescript",
          source: `import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-dark.css';

const picker = new TimepickerUI('#time', { ui: { theme: 'dark' } });
picker.create();`,
        },
      },
    ],
    why: "The package ships its CSS as separate files, so you load only the themes you use. `timepicker-ui/index.css` contains the core styles and all 12 themes in one file.",
  },
  {
    group: "Setup",
    title: "Nothing happens when the input is clicked",
    fix: [
      {
        text: "Call `create()` after `new TimepickerUI(...)`. The handlers that open the picker on click and on Enter are added by `create()`, not by the constructor.",
        code: {
          language: "typescript",
          source: `import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#time');
picker.create();`,
        },
      },
      {
        text: "If the console shows `Input element not found`, the selector matched nothing when the code ran, or the element has no `<input>` inside it. Run the code after the element is in the page.",
      },
    ],
  },
  {
    group: "Setup",
    title: "A range, timezone or wheel option is ignored, or an `error` event fires",
    fix: [
      {
        text: "Import the plugin from `timepicker-ui/plugins/<name>` and pass it to `PluginRegistry.register()` once, before the first `new TimepickerUI(...)`.",
        code: {
          language: "typescript",
          source: `import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI('#time', { range: { enabled: true } });
picker.create();`,
        },
      },
      {
        text: "A missing plugin is reported only through the `error` event, when the picker opens. Listen to it to see the message.",
        code: {
          language: "typescript",
          source: `picker.on('error', ({ error }) => console.warn(error));`,
        },
      },
    ],
    why: "Each picker sets up its plugins in its constructor, so a plugin registered after `new TimepickerUI(...)` does not work in that picker. Without its plugin, the picker leaves out the range and timezone controls and shows the clock instead of the wheel. With `range.enabled` set, OK then does not close the picker.",
  },
  {
    group: "Styling",
    title: CUSTOM_THEME_TITLE,
    fix: [
      {
        text: "Pass your class name in `ui.cssClass` instead. The picker adds the class to `.tp-ui-wrapper` when it opens.",
        code: {
          language: "typescript",
          source: `const picker = new TimepickerUI('#time', {
  ui: { cssClass: 'my-theme' },
});
picker.create();`,
        },
      },
      {
        text: "Set the `--tp-*` variables under `.tp-ui-wrapper.my-theme`. [CSS Variables](/docs/api/css-variables) lists them.",
        code: {
          language: "css",
          source: `.tp-ui-wrapper.my-theme {
  --tp-bg: #ffffff;
  --tp-text: #1d1b20;
  --tp-primary: #0b57d0;
  --tp-on-primary: #ffffff;
}`,
        },
      },
    ],
    why: "`ui.theme` selects one of the 12 built-in themes. The picker writes the name to the `data-theme` attribute of the modal and does not add it as a class, so a rule such as `.my-theme` never matches.",
  },
  {
    group: "Styling",
    title: "TypeScript rejects a custom `ui.theme` name",
    fix: [
      {
        text: `Leave \`ui.theme\` unset or use a built-in name, and pass your own class in \`ui.cssClass\`. [The \`ui.theme\` entry above](#${CUSTOM_THEME_ANCHOR}) shows the CSS.`,
      },
    ],
    why: "`ui.theme` is typed as a union of the 12 built-in theme names.",
  },
  {
    group: "Styling",
    title: "The modal shows behind a header or inside a clipped container",
    fix: [
      {
        text: "If you set `ui.appendTo`, point it at an element outside the clipped container, or remove the option so the modal goes to `<body>`.",
      },
      {
        text: "The modal has `z-index: 5000`. If your header has a higher `z-index`, lower the header's value, or raise the modal's in CSS that loads after `timepicker-ui/main.css`.",
        code: {
          language: "css",
          source: `.tp-ui-modal {
  z-index: 10000;
}`,
        },
      },
    ],
    why: "The modal is `position: fixed`. Inside an ancestor with `transform` or `filter`, a fixed element is placed relative to that ancestor instead of the viewport, and its `z-index` only counts inside it. `--tp-z-modal` is defined in `:root`, but no rule reads it, so changing it does nothing.",
  },
  {
    group: "Styling",
    title: "My CSS does not override the built-in styles",
    fix: [
      {
        text: "Give the picker a class with `ui.cssClass`, for example `'my-picker'`.",
      },
      {
        text: "Start each selector with `.tp-ui-wrapper.my-picker`. Built-in state rules such as `.tp-ui-hour.active` and `.tp-ui-hour.mobile.active` use two or three classes, and the prefix adds two more.",
        code: {
          language: "css",
          source: `.tp-ui-wrapper.my-picker .tp-ui-hour.active,
.tp-ui-wrapper.my-picker .tp-ui-minutes.active {
  background-color: #111111;
  color: #ffffff;
}`,
        },
      },
      {
        text: "See [Specificity](/docs/api/css-classes#specificity) on the CSS Classes page.",
      },
    ],
    why: "A rule loses when it has fewer classes than the built-in one, or the same number and loads earlier.",
  },
  {
    group: "Frameworks",
    title:
      "`ReferenceError: document is not defined` or `TimepickerUI requires browser environment` in Next.js, Nuxt or SvelteKit",
    anchor: "referenceerror-document-is-not-defined-nextjs-nuxt-sveltekit",
    fix: [
      {
        text: "Create the picker in a hook that runs only in the browser: `useEffect` in React, `onMounted` in Vue and Nuxt, `onMount` in Svelte and SvelteKit. In the Next.js App Router, the file also needs `'use client'`.",
        code: {
          language: "tsx",
          source: `'use client';

import { useEffect, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';

export function TimeField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return <div className="tp-ui"><input ref={inputRef} type="text" /></div>;
}`,
        },
      },
      {
        text: "Read `document` and `window` only inside that hook as well.",
      },
      {
        text: "[Server Rendering](/docs/guides/server-rendering) shows the setup for Next.js, Nuxt and SvelteKit.",
      },
    ],
    why: "Importing `timepicker-ui` on the server is safe, because no module reads `window` or `document` when it loads. The constructor needs a browser: it throws `TimepickerUI requires browser environment` when `window` is undefined. `ReferenceError: document is not defined` comes from your own code, for example a `document.querySelector()` call in the component body.",
  },
  {
    group: "Frameworks",
    title: "Two pickers open, or events fire twice, in React development mode",
    fix: [
      {
        text: "Return `() => picker.destroy()` from the effect that creates the picker.",
        code: {
          language: "tsx",
          source: `useEffect(() => {
  if (!inputRef.current) return;
  const picker = new TimepickerUI(inputRef.current);
  picker.create();
  return () => picker.destroy();
}, []);`,
        },
      },
    ],
    why: "In development, Strict Mode runs each effect, then its cleanup, then the effect again. Without a cleanup, the first picker stays on the input next to the second one, and both open on click. `destroy()` removes the picker's listeners and its modal.",
  },
  {
    group: "Frameworks",
    title: "`Failed to execute 'removeChild' on 'Node'` when a React component unmounts",
    fix: [
      {
        text: "Wrap the input in an element with the `tp-ui` class. The picker then uses that element as its root and leaves the input where React rendered it.",
        code: {
          language: "tsx",
          source: `return (
  <div className="tp-ui">
    <input ref={inputRef} type="text" />
  </div>
);`,
        },
      },
    ],
    why: "Given a bare `<input>`, the constructor moves it into a new `div.tp-ui`, and `destroy()` does not remove that div. React still expects the input in its original parent, so removing it can fail. `timepicker-ui-react` renders the wrapper for you.",
  },
  {
    group: "Frameworks",
    title: "The input value does not update React state",
    fix: [
      {
        text: "Set state in `callbacks.onConfirm`. It runs when the user confirms a time, after the picker has written it to the input.",
        code: {
          language: "tsx",
          source: `const [time, setTime] = useState('');

useEffect(() => {
  const input = inputRef.current;
  if (!input) return;
  const picker = new TimepickerUI(input, {
    callbacks: { onConfirm: () => setTime(input.value) },
  });
  picker.create();
  return () => picker.destroy();
}, []);`,
        },
      },
      {
        text: "With `timepicker-ui-react`, pass `value` and update it in `onConfirm`.",
        code: {
          language: "tsx",
          source: `import { useState } from 'react';
import { Timepicker } from 'timepicker-ui-react';

export function TimeField() {
  const [time, setTime] = useState('10:00 AM');

  return (
    <Timepicker
      value={time}
      onConfirm={({ hour, minutes, type }) => setTime(\`\${hour}:\${minutes} \${type}\`)}
    />
  );
}`,
        },
      },
    ],
    why: "The picker sets `input.value` directly and does not dispatch `input` or `change` events, so React's `onChange` never runs.",
  },
  {
    group: "Frameworks",
    title: "Listeners or a modal stay after a route change",
    fix: [
      {
        text: "Call `picker.destroy()` in your framework's cleanup hook: the function returned from `useEffect` in React, `onBeforeUnmount` in Vue, `ngOnDestroy` in Angular, or the function returned from `onMount` in Svelte.",
        code: {
          language: "vue",
          source: `<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { TimepickerUI } from 'timepicker-ui';

const input = ref<HTMLInputElement | null>(null);
let picker: TimepickerUI | undefined;

onMounted(() => {
  picker = new TimepickerUI(input.value!);
  picker.create();
});

onBeforeUnmount(() => picker?.destroy());
</script>

<template>
  <div class="tp-ui"><input ref="input" type="text" /></div>
</template>`,
        },
      },
    ],
    why: "An open modal sits in `<body>`, or in the `ui.appendTo` element, outside your component. If the route changes while the picker is open, the modal stays, and by default the page scroll stays locked. `destroy()` removes the modal, the picker's listeners and the scroll lock.",
  },
  {
    group: "Plugins",
    title: "`ui.mode: 'wheel'` or `'compact-wheel'` still shows a clock",
    fix: [
      {
        text: "Import `WheelPlugin` from `timepicker-ui/plugins/wheel` and register it once, before creating the picker.",
        code: {
          language: "typescript",
          source: `import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI('#time', { ui: { mode: 'wheel' } });
picker.create();`,
        },
      },
    ],
    why: "Without the plugin, the picker falls back to the clock face and emits `error` with the message `WheelPlugin is not registered. Import and register it: PluginRegistry.register(WheelPlugin)`.",
  },
];

export const PROBLEMS: Problem[] = SOURCES.map(({ anchor, ...source }) => {
  const symptom = toPlainText(source.title);
  return {
    ...source,
    anchor: anchor ?? slugify(symptom),
    symptom,
    faqAnswer: source.fix.map((step) => toPlainText(step.text)).join(" "),
  };
});
