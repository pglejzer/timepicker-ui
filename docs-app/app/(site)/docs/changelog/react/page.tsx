import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { slugify } from "@/lib/slugify";
import { PageHeader } from "@/components/page-header";
import { JsonLdBreadcrumb } from "@/components/json-ld";
import {
  ChangelogSwitcher,
  ReleaseList,
  type ChangeEntry,
  type ReleaseNotes,
} from "@/components/changelog";

export const metadata = buildMetadata({
  title: "timepicker-ui-react Changelog",
  description:
    "Release notes for timepicker-ui-react, the React wrapper for timepicker-ui: new props, re-exported types, fixes and core updates, listed by version.",
  path: "/docs/changelog/react",
});

function coreUpdate(from: string, to: string, coreReleaseDate: string): ChangeEntry {
  const anchor = slugify(`Version ${to} - ${coreReleaseDate}`);
  return {
    title: `Updated \`timepicker-ui\` from ${from} to ${to}`,
    description: (
      <>
        See the{" "}
        <Link href={`/docs/changelog#${anchor}`}>timepicker-ui {to} changelog</Link>.
      </>
    ),
  };
}

const RELEASES: ReleaseNotes[] = [
  {
    title: "Version 1.5.0 - 2026-10-14",
    changes: {
      Added: [
        {
          title: "`onShow`, `onSelectSecond`, `onSwitchView`, `onWheelScrollStart` and `onWheelScrollEnd` props",
          description: "They also work in `options.callbacks`.",
        },
        {
          title: "`onSelectPeriod` and `onSwitchFace` props",
          description: "For the core's new `select:period` and `switch:face` events.",
        },
        {
          title: "`SelectSecondEventData` type",
          description: "Re-exported. It is the payload of `onSelectSecond`.",
        },
        {
          title: "Callback prop descriptions",
          description: "Callback props show the core's JSDoc descriptions in your editor.",
        },
        {
          title: "Clearer option names (from core)",
          description: "Such as `ui.initialView` for `ui.mobile`. The old names still work until 5.0.",
        },
        {
          title: "Optional seconds (from core)",
          description: "Turn them on with `clock.showSeconds: true`.",
        },
        { title: "Keyboard control of the clock face (from core)" },
      ],
      Changed: [
        coreUpdate("4.4.0", "4.5.0", "October 14, 2026"),
        {
          title: "Callbacks during create",
          description:
            "Callback props now also get events fired while the picker is created, such as an inline picker's `open` or an `error` during init.",
        },
        {
          title: "Wrapper callbacks stay in the wrapper",
          description:
            "The core instance no longer holds them, so `TimepickerUI.getById(id).options.callbacks` won't list them.",
        },
        {
          title: "Server markup",
          description:
            'The `<input>` is now wrapped in `<div class="tp-ui">` on the server too, so markup snapshots change. A `<Timepicker>` inside a `<p>` now gets React\'s nesting warning.',
        },
        {
          title: "`options` changes on an open picker (from core)",
          description: "The picker re-renders and resets a selection that was not confirmed.",
        },
        {
          title: "`behavior.returnFocus` (from core)",
          description:
            "Formerly `focusInputAfterClose`. It still defaults to `false`. We recommend `true`, which becomes the default in 5.0.",
        },
      ],
      Deprecated: [
        {
          title: "`OptionTypes` and `HideEventData` (from core)",
          description:
            "Use `TimepickerOptions` instead of `OptionTypes`. `HideEventData` was never emitted. Both will be removed in 5.0.",
        },
      ],
      Fixed: [
        {
          title: "`options.callbacks` called twice",
          description: "The core and the wrapper both called them. They are now called once.",
        },
        {
          title: "Old callback props kept firing",
          description:
            "After a callback prop changed, the handler from the first render no longer fires next to the new one.",
        },
        {
          title: "Equal `options` objects",
          description:
            "A new but equal `options` object, such as inline `options={{...}}`, no longer calls `update()`, so an open picker keeps its selection.",
        },
        {
          title: "Documented re-exports",
          description:
            "The package now exports `TimepickerUI`, `PluginRegistry`, `EventEmitter` and the core types. Before, only `Timepicker` and `TimepickerProps` were exported.",
        },
        {
          title: "Conditional unmount",
          description:
            "Unmounting a `<Timepicker>` while its parent stays rendered, such as `{show && <Timepicker />}`, no longer throws `NotFoundError` and breaks the React tree.",
        },
        {
          title: "Range values in `value` or `defaultValue`",
          description:
            'With `range.enabled`, a range value such as `"10:00 AM - 12:00 PM"` no longer fires `onError`.',
        },
        {
          title: "`Date` in `clock.currentTime.time`",
          description: "An equal `Date` no longer calls `update()` on every render.",
        },
      ],
    },
  },
  {
    title: "Version 1.4.0 - 2026-06-10",
    changes: {
      Added: [
        {
          title: "`blueprint` and `blueprint-dark` themes",
          description:
            "Set `options.ui.theme` and import `timepicker-ui/theme-blueprint.css` or `timepicker-ui/theme-blueprint-dark.css`. There are now 12 themes.",
        },
        {
          title: "16 accessibility labels",
          description:
            "New `options.labels` entries for screen-reader and ARIA text, such as `hourLabel`, `announceHour` and `invalidTimeFormat`.",
        },
        {
          title: "Home, End, PageUp and PageDown (from core)",
          description: "On the clock spinbuttons and the wheel columns.",
        },
      ],
      Changed: [
        coreUpdate("4.3.0", "4.4.0", "June 10, 2026"),
        {
          title: "Screen-reader text (from core)",
          description:
            "ARIA text reads from the `labels` group, clock spinbuttons expose `aria-valuetext`, and the focus trap skips `aria-disabled` / `aria-hidden` elements.",
        },
      ],
      Fixed: [
        { title: "High-contrast focus halo rendering (from core)" },
        {
          title: "Firefox spinner buttons (from core)",
          description: "The native spinner buttons no longer show on the clock inputs.",
        },
        {
          title: "Stuck page scroll (from core)",
          description:
            "The scroll lock is now counted per picker, so the page no longer stays unscrollable after several pickers open and close.",
        },
        {
          title: "`theme-crane-straight.css` (from core)",
          description: "The file is now in the core package `exports` map.",
        },
      ],
    },
  },
  {
    title: "Version 1.3.0 - 2026-03-29",
    changes: {
      Added: [
        {
          title: "`TemplateProvider` and `ClearHandler` types",
          description: "Re-exported, for the plugin `templateProvider` and `clearHandler` hooks.",
        },
        {
          title: "Plugin `templateProvider` and `clearHandler` hooks (from core)",
          description: "Plugins can register their own modal templates and their own Clear button logic.",
        },
        {
          title: "`PluginRegistry.getTemplateProvider()` and `getClearHandler()` (from core)",
          description: "Available on the re-exported `PluginRegistry`.",
        },
      ],
      Changed: [
        coreUpdate("4.2.1", "4.3.0", "March 26, 2026"),
        {
          title: "Unused plugins left out of the bundle (from core)",
          description: "The wheel, range and timezone plugins are only bundled when you import them.",
        },
      ],
    },
  },
  {
    title: "Version 1.2.0 - 2026-03-24",
    changes: {
      Added: [
        {
          title: "`onClear` prop",
          description:
            "Called when the Clear button is clicked. Maps to `callbacks.onClear` and the `clear` event.",
        },
        {
          title: "Clear and wheel types",
          description:
            "Re-exported `ClearEventData`, `ClearBehaviorOptions`, `WheelOptions`, `WheelScrollStartEventData` and `WheelScrollEndEventData`.",
        },
      ],
      Changed: [coreUpdate("4.1.7", "4.2.1", "March 18, 2026")],
    },
  },
  {
    title: "Version 1.1.2 - 2026-03-08",
    changes: {
      Changed: [coreUpdate("4.1.6", "4.1.7", "March 8, 2026")],
    },
  },
  {
    title: "Version 1.1.1 - 2026-02-14",
    changes: {
      Added: [
        {
          title: "Range plugin types",
          description:
            "Re-exported `RangeOptions`, `RangeConfirmEventData`, `RangeSwitchEventData` and `RangeValidationEventData`.",
        },
      ],
      Changed: [coreUpdate("4.1.2", "4.1.6", "February 14, 2026")],
    },
  },
  {
    title: "Version 1.1.0 - 2026-02-08",
    changes: {
      Added: [
        {
          title: "`onTimezoneChange` prop",
          description: "Callback for the timezone plugin.",
        },
        {
          title: "`onRangeConfirm`, `onRangeSwitch` and `onRangeValidation` props",
          description: "Callbacks for the range plugin.",
        },
        {
          title: "`TimezoneChangeEventData` and `TimepickerEventMap` types",
          description: "Re-exported from `timepicker-ui`.",
        },
      ],
      Changed: [coreUpdate("4.0.3", "4.1.2", "February 8, 2026")],
    },
  },
  {
    title: "Version 1.0.1 - 2026-01-24",
    changes: {
      Changed: [coreUpdate("4.0.2", "4.0.3", "January 23, 2026")],
    },
  },
  {
    title: "Version 1.0.0 - 2025-11-23",
    changes: {
      Added: [
        {
          title: "`Timepicker` component",
          description: "First release. Renders a timepicker-ui input in React.",
        },
        {
          title: "Controlled and uncontrolled",
          description: "Pass `value` for a controlled picker or `defaultValue` for an uncontrolled one.",
        },
        {
          title: "`forwardRef`",
          description: "Works with React Hook Form and other form libraries.",
        },
        {
          title: "Input props",
          description: "Standard `<input>` props go straight to the input, with no `inputProps` wrapper.",
        },
        {
          title: "Callback props",
          description: "The core callbacks as props, such as `onConfirm`, `onCancel`, `onUpdate` and `onError`.",
        },
        {
          title: "`options` prop",
          description: "Takes the grouped core options: `clock`, `ui`, `labels` and `behavior`.",
        },
        {
          title: "SSR-safe",
          description: "Works with Next.js, Remix, Gatsby and other server-rendering frameworks.",
        },
        {
          title: "ESM only",
          description: "The package ships as a tree-shakeable ES module.",
        },
        {
          title: "Re-exported core types",
          description: "Types come straight from `timepicker-ui`, with no duplicated interfaces.",
        },
        {
          title: "React 17 or newer",
          description: "`react` and `react-dom` 17 or newer are peer dependencies.",
        },
      ],
    },
  },
];

export default function ReactChangelogPage() {
  return (
    <div data-toc-depth="2">
      <JsonLdBreadcrumb pathname="/docs/changelog/react" />
      <PageHeader
        title="timepicker-ui-react Changelog"
        description={
          <>
            Notable changes to <code>timepicker-ui-react</code>, the{" "}
            <Link href="/react">React wrapper</Link> for timepicker-ui, newest
            first. The package follows{" "}
            <a href="https://semver.org/spec/v2.0.0.html">Semantic Versioning</a>.
          </>
        }
      />

      <ChangelogSwitcher current="react" />

      <ReleaseList releases={RELEASES} />
    </div>
  );
}
