import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { ApiTable } from "@/components/api-table";
import { RenamedOptionsTable } from "@/components/renamed-options-table";
import { renamedOptions } from "@/lib/renamed-options";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Options",
  description:
    "Complete options reference for timepicker-ui - clock, ui, labels, behavior, callbacks and plugin config for the zero-dependency, SSR-safe time picker.",
  path: "/docs/api/options",
});

type OptionRow = {
  name: string;
  type: string;
  default: string;
  description: ReactNode;
};

const Deprecated = ({ children }: { children: ReactNode }) => (
  <>
    <strong>Deprecated.</strong>{" "}
    {children}
  </>
);

const clockOptions: OptionRow[] = [
  {
    name: "type",
    type: '"12h" | "24h" | "auto"',
    default: '"12h"',
    description: (
      <>
        Clock format. <code>auto</code> picks 12h or 24h from the browser
        locale when the picker is created or its options are set.{" "}
        <code>auto</code> is new in 4.5.0.
      </>
    ),
  },
  {
    name: "incrementHours",
    type: "number",
    default: "1",
    description: "Hour step on the clock, the wheel and the arrow keys. Use a divisor of 12: 1, 2, 3, 4 or 6",
  },
  {
    name: "incrementMinutes",
    type: "number",
    default: "1",
    description: "Minute increment step (1, 5, 10, 15, etc.)",
  },
  {
    name: "autoSwitchToMinutes",
    type: "boolean",
    default: "true",
    description: "Auto-switch to minutes after hour selection",
  },
  {
    name: "showSeconds",
    type: "boolean",
    default: "false",
    description: (
      <>
        Show a seconds field, clock face and wheel column. Values become{" "}
        <code>HH:MM:SS</code>. New in 4.5.0. See{" "}
        <Link href="/docs/features/seconds">Seconds</Link>
        .
      </>
    ),
  },
  {
    name: "incrementSeconds",
    type: "1 | 5 | 10 | 15 | 20 | 30",
    default: "1",
    description:
      "Seconds step on the seconds face, the wheel column and the keyboard. New in 4.5.0.",
  },
  {
    name: "autoSwitchToSeconds",
    type: "boolean",
    default: "true",
    description: (
      <>
        Switch the clock face to seconds after a minute is picked. Only used
        with <code>showSeconds</code>. New in 4.5.0.
      </>
    ),
  },
  {
    name: "disabledTime",
    type: "DisabledTime",
    default: "undefined",
    description: (
      <>
        Disable specific hours, minutes, seconds or time ranges. When{" "}
        <code>ranges</code> is set, the <code>hours</code>,{" "}
        <code>minutes</code> and <code>seconds</code> lists are ignored.
      </>
    ),
  },
  {
    name: "isTimeDisabled",
    type: "(time: TimeOfDay) => boolean",
    default: "undefined",
    description: (
      <>
        Return <code>true</code> to disable a time. <code>TimeOfDay</code> is{" "}
        <code>{"{ hour, minutes, seconds }"}</code>, with <code>hour</code> from
        0 to 23. Combined with <code>disabledTime</code> as a union. An hour or
        minute is disabled when every time inside it is. Results are cached:
        call <code>refreshDisabledTime()</code> after the data behind the
        function changes. A throwing function counts as enabled. See{" "}
        <Link href="/docs/features/disabled-time">Disabled Time</Link>.
      </>
    ),
  },
  {
    name: "discreteHourJump",
    type: "boolean",
    default: "false",
    description:
      "Move the hour hand from hour to hour while dragging instead of following the pointer",
  },
  {
    name: "defaultTime",
    type: '"now" | { time?: Date | "now"; updateInput?: boolean }',
    default: "undefined",
    description: (
      <>
        Time the picker shows while the input is empty.{" "}
        <code>&apos;now&apos;</code> shows the current time and also writes it
        to the input when the picker is created, replacing a value that is
        already there. In the object form,{" "}
        <code>time</code> is a <code>Date</code> or{" "}
        <code>&apos;now&apos;</code>. <code>updateInput: true</code> writes it
        to the input and <code>updateInput: false</code> only shows it.
      </>
    ),
  },
];

const uiOptions: OptionRow[] = [
  {
    name: "theme",
    type: "Theme",
    default: '"basic"',
    description: "UI theme (basic, dark, m3-green, cyberpunk, blueprint, etc.)",
  },
  {
    name: "animation",
    type: "boolean",
    default: "true",
    description: "Enable/disable open/close animations",
  },
  {
    name: "backdrop",
    type: "boolean",
    default: "true",
    description: "Show/hide backdrop overlay",
  },
  {
    name: "initialView",
    type: '"clock" | "keyboard"',
    default: '"clock"',
    description:
      "View shown when the picker opens: the clock face or the keyboard fields",
  },
  {
    name: "viewSwitch",
    type: "boolean",
    default: "false",
    description:
      "Show the button that switches between the clock face and the keyboard fields",
  },
  {
    name: "editable",
    type: "boolean",
    default: "false",
    description: "Allow manual input editing",
  },
  {
    name: "allowPageScroll",
    type: "boolean",
    default: "false",
    description: (
      <>
        Let the page scroll while the picker is open. When{" "}
        <code>false</code>, the page is locked while the modal is open (inline
        pickers and the compact-wheel popover never lock it), and{" "}
        <code>&lt;html&gt;</code> gets <code>--tp-scrollbar-gap</code> with the
        width of the removed scrollbar, for fixed headers. See{" "}
        <Link href="/docs/configuration#scroll-lock">
          Scroll lock and fixed headers
        </Link>
        .
      </>
    ),
  },
  {
    name: "cssClass",
    type: "string",
    default: "undefined",
    description: "Additional CSS class for timepicker wrapper",
  },
  {
    name: "appendTo",
    type: "string | HTMLElement",
    default: '""',
    description: (
      <>
        Element, or selector of the element, the modal is appended to. Empty
        means <code>document.body</code>. Passing an element is new in 4.5.0.
      </>
    ),
  },
  {
    name: "keyboardIcon",
    type: "string",
    default: '""',
    description:
      "Custom HTML for the switch icon that opens the keyboard fields, shown on the clock face view. The built-in icon is used when empty",
  },
  {
    name: "clockIcon",
    type: "string",
    default: '""',
    description:
      "Custom HTML for the switch icon that goes back to the clock, shown on the keyboard view. The built-in icon is used when empty",
  },
  {
    name: "inline",
    type: "InlineOptions",
    default: "undefined",
    description: (
      <>
        Inline mode configuration. <code>container</code> takes an element or
        a selector and is required when <code>enabled</code> is{" "}
        <code>true</code>. <code>embedded</code> (default{" "}
        <code>false</code>) renders the picker as part of a host component:
        the root is a <code>group</code> instead of a dialog, with no shadow
        and no minimum height, no focus trap and no focus on mount. Ignored
        unless <code>enabled</code> is <code>true</code>. See{" "}
        <Link href="/docs/features/inline-mode">Inline Mode</Link>.
      </>
    ),
  },
  {
    name: "clearButton",
    type: "boolean | { clearInput?: boolean }",
    default: "false",
    description: (
      <>
        Show the Clear button. The object form also sets what Clear does:{" "}
        <code>{"{ clearInput: false }"}</code> keeps the input value. The
        object form is new in 4.5.0.
      </>
    ),
  },
  {
    name: "mode",
    type: '"clock" | "wheel" | "compact-wheel"',
    default: '"clock"',
    description:
      "Picker mode: analog clock face, scroll wheel, or compact wheel without a header. The wheel modes need the wheel plugin",
  },
];

const wheelOptions: OptionRow[] = [
  {
    name: "placement",
    type: '"auto" | "top" | "bottom"',
    default: "undefined",
    description: (
      <>
        <code>compact-wheel</code> only. When unset, compact-wheel opens as a
        modal. Set it to open compact-wheel as a popover next to the input:{" "}
        <code>auto</code> opens below when there is room, otherwise above;{" "}
        <code>top</code> and <code>bottom</code> open on that side while it
        has room for at least three wheel rows, otherwise on the other side.
      </>
    ),
  },
  {
    name: "hideFooter",
    type: "boolean",
    default: "false",
    description: (
      <>
        Do not render the footer (OK, Cancel, Clear and the switch icon).{" "}
        <code>compact-wheel</code> only.
      </>
    ),
  },
  {
    name: "commitOnScroll",
    type: "boolean",
    default: "false",
    description: (
      <>
        Commit the time when wheel scrolling ends, without pressing OK. The{" "}
        <code>confirm</code> payload then has <code>autoCommit: true</code>.
      </>
    ),
  },
  {
    name: "hideDisabled",
    type: "boolean",
    default: "false",
    description:
      "Remove disabled hours, minutes and seconds from the wheel list instead of dimming them",
  },
  {
    name: "ignoreOutsideClick",
    type: "boolean",
    default: "false",
    description:
      "Prevent the picker from closing when clicking outside its area",
  },
];

const labelsOptions: OptionRow[] = [
  {
    name: "am",
    type: "string",
    default: '"AM"',
    description: "Custom text for AM label",
  },
  {
    name: "pm",
    type: "string",
    default: '"PM"',
    description: "Custom text for PM label",
  },
  {
    name: "ok",
    type: "string",
    default: '"OK"',
    description: "Text for OK button",
  },
  {
    name: "cancel",
    type: "string",
    default: '"Cancel"',
    description: "Text for cancel button",
  },
  {
    name: "clear",
    type: "string",
    default: '"Clear"',
    description: "Text for clear button",
  },
  {
    name: "clockTitle",
    type: "string",
    default: '"Select time"',
    description: "Heading of the clock face view",
  },
  {
    name: "keyboardTitle",
    type: "string",
    default: '"Enter Time"',
    description: "Heading of the keyboard view",
  },
  {
    name: "hour",
    type: "string",
    default: '"Hour"',
    description:
      "Hour field caption, its accessible name, the dial name on the hours face, and the prefix of the hour announcement",
  },
  {
    name: "minute",
    type: "string",
    default: '"Minute"',
    description: (
      <>
        Same as <code>hour</code>, for minutes. Until 5.0, the minute
        announcement says <code>Minutes</code> when <code>minute</code> is not
        set.
      </>
    ),
  },
  {
    name: "second",
    type: "string",
    default: '"Second"',
    description: (
      <>
        Same as <code>hour</code>, for seconds. Used with{" "}
        <code>clock.showSeconds</code>. New in 4.5.0.
      </>
    ),
  },
  {
    name: "clock",
    type: "string",
    default: '"Clock"',
    description: "Accessible name of the group around the clock dial",
  },
  {
    name: "period",
    type: "string",
    default: '"Period"',
    description: "Accessible name of the AM/PM group",
  },
  {
    name: "timeFields",
    type: "string",
    default: '"Time"',
    description: "Accessible name of the group around the time fields",
  },
  {
    name: "range",
    type: "string",
    default: '"Range selection"',
    description: "Accessible name of the range From/To tabs",
  },
  {
    name: "rangeFrom",
    type: "string",
    default: '"From"',
    description: "Text of the range From tab",
  },
  {
    name: "rangeTo",
    type: "string",
    default: '"To"',
    description: "Text of the range To tab",
  },
  {
    name: "timezone",
    type: "string",
    default: '"Timezone"',
    description: "Label of the timezone selector",
  },
  {
    name: "switchToKeyboard",
    type: "string",
    default: '"Switch to keyboard input"',
    description: "Accessible name of the view switch on the clock face view",
  },
  {
    name: "switchToClock",
    type: "string",
    default: '"Switch to clock"',
    description: "Accessible name of the view switch on the keyboard view",
  },
  {
    name: "format24Label",
    type: "string",
    default: '"24-hour"',
    description: (
      <Deprecated>Has no effect. Will be removed in 5.0.</Deprecated>
    ),
  },
  {
    name: "toggleLabel",
    type: "string",
    default: '"Toggle"',
    description: (
      <Deprecated>
        Has no effect. The view switch is one button labelled by{" "}
        <code>switchToKeyboard</code> and <code>switchToClock</code>. Will be
        removed in 5.0.
      </Deprecated>
    ),
  },
  {
    name: "timezoneSelectorLabel",
    type: "string",
    default: '"Timezone"',
    description: (
      <Deprecated>
        Has no effect. Use <code>labels.timezone</code>. Will be removed in
        5.0.
      </Deprecated>
    ),
  },
  {
    name: "announceAmSelected",
    type: "string",
    default: '"AM selected"',
    description: "Screen-reader announcement when AM is selected",
  },
  {
    name: "announcePmSelected",
    type: "string",
    default: '"PM selected"',
    description: "Screen-reader announcement when PM is selected",
  },
  {
    name: "invalidTimeFormat",
    type: "string",
    default: '"Invalid time format"',
    description: "Error/announcement text for an invalid time format",
  },
  {
    name: "announceCleared",
    type: "string",
    default: '"Time cleared"',
    description:
      "Screen-reader announcement after the Clear button is used. New in 4.5.0.",
  },
];

const timezoneOptions: OptionRow[] = [
  {
    name: "enabled",
    type: "boolean",
    default: "false",
    description: "Enable timezone selector UI",
  },
  {
    name: "default",
    type: "string",
    default: "undefined",
    description:
      'Default timezone ID (e.g. "America/New_York"). Uses the browser timezone if not set',
  },
  {
    name: "list",
    type: "readonly string[]",
    default: "undefined",
    description:
      "Timezone IDs shown in the selector, instead of the built-in list of common timezones",
  },
];

const rangeOptions: OptionRow[] = [
  {
    name: "enabled",
    type: "boolean",
    default: "false",
    description: "Enable range mode (from-to selection)",
  },
  {
    name: "minDuration",
    type: "number",
    default: "undefined",
    description: (
      <>
        Minimum duration in minutes. With <code>clock.showSeconds</code>, it is
        compared to the exact length in seconds.
      </>
    ),
  },
  {
    name: "maxDuration",
    type: "number",
    default: "undefined",
    description: (
      <>
        Maximum duration in minutes. With <code>clock.showSeconds</code>, it is
        compared to the exact length in seconds.
      </>
    ),
  },
  {
    name: "linked",
    type: "boolean",
    default: "true",
    description: (
      <>
        With <code>false</code>, From and To are independent: times before
        From are not disabled in To, the To tab is enabled from the start, and{" "}
        <code>minDuration</code> and <code>maxDuration</code> are not checked,
        so a range can cross midnight. <code>range:validation</code> still
        fires and reports <code>valid: true</code> once both ends are
        complete.
      </>
    ),
  },
];

const behaviorOptions: OptionRow[] = [
  {
    name: "returnFocus",
    type: "boolean",
    default: "false",
    description: (
      <>
        Return focus to the input when the picker closes (WAI-ARIA dialog
        pattern). <code>true</code> is recommended, and 5.0 makes{" "}
        <code>true</code> the default.
      </>
    ),
  },
  {
    name: "focusTrap",
    type: "boolean",
    default: "true",
    description: "Trap focus within modal for accessibility",
  },
  {
    name: "delayHandler",
    type: "number",
    default: "0",
    description: (
      <>
        Extra delay (ms) before the picker starts to close after OK, Cancel,
        Escape, a backdrop click or <code>close()</code>. The default was{" "}
        <code>300</code> before 4.5.0.
      </>
    ),
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: (
      <>
        Custom ID for the instance. Pass it to{" "}
        <code>TimepickerUI.getById()</code>.
      </>
    ),
  },
];

const callbacksOptions: OptionRow[] = [
  {
    name: "onConfirm",
    type: "(data: ConfirmEventData) => void",
    default: "undefined",
    description: "Triggered when user confirms time selection",
  },
  {
    name: "onCancel",
    type: "(data: CancelEventData) => void",
    default: "undefined",
    description: "Triggered when user cancels",
  },
  {
    name: "onOpen",
    type: "(data: OpenEventData) => void",
    default: "undefined",
    description: (
      <>
        Triggered when the picker opens, including through{" "}
        <code>open()</code>.
      </>
    ),
  },
  {
    name: "onShow",
    type: "(data: ShowEventData) => void",
    default: "undefined",
    description: (
      <>
        Triggered when the user clicks the input or a{" "}
        <Link href="/examples/features/open-from-button">
          <code>data-open</code> element
        </Link>
        , or presses Enter or Space on it, to open the picker.{" "}
        <code>open()</code> does not trigger it. New in 4.5.0.
      </>
    ),
  },
  {
    name: "onUpdate",
    type: "(data: UpdateEventData) => void",
    default: "undefined",
    description: "Triggered during time changes",
  },
  {
    name: "onSelectHour",
    type: "(data: SelectHourEventData) => void",
    default: "undefined",
    description: "Triggered when hour is selected",
  },
  {
    name: "onSelectMinute",
    type: "(data: SelectMinuteEventData) => void",
    default: "undefined",
    description: "Triggered when minute is selected",
  },
  {
    name: "onSelectSecond",
    type: "(data: SelectSecondEventData) => void",
    default: "undefined",
    description: (
      <>
        Triggered when the seconds field or face is selected. Needs{" "}
        <code>clock.showSeconds</code>. New in 4.5.0.
      </>
    ),
  },
  {
    name: "onSelectPeriod",
    type: "(data: SelectPeriodEventData) => void",
    default: "undefined",
    description: (
      <>
        Triggered when AM or PM is selected, with{" "}
        <code>{"{ type: 'AM' | 'PM' }"}</code>. New in 4.5.0.
      </>
    ),
  },
  {
    name: "onSwitchFace",
    type: "(data: SwitchFaceEventData) => void",
    default: "undefined",
    description: (
      <>
        Triggered when the clock face switches between hours, minutes and
        seconds, with <code>{"{ face }"}</code>. Clicking the field that is
        already active does not trigger it. New in 4.5.0.
      </>
    ),
  },
  {
    name: "onSwitchView",
    type: "(data: SwitchViewEventData) => void",
    default: "undefined",
    description: (
      <>
        Triggered when the switch icon toggles between the clock face and
        keyboard input. Needs <code>ui.viewSwitch</code>. New in 4.5.0.
      </>
    ),
  },
  {
    name: "onError",
    type: "(data: ErrorEventData) => void",
    default: "undefined",
    description:
      "Triggered on an invalid input value, a setValue() string that is not a time, invalid options or a missing plugin",
  },
  {
    name: "onTimezoneChange",
    type: "(data: TimezoneChangeEventData) => void",
    default: "undefined",
    description: "Triggered when timezone is changed (timezone plugin only)",
  },
  {
    name: "onRangeConfirm",
    type: "(data: RangeConfirmEventData) => void",
    default: "undefined",
    description: "Triggered when a range is confirmed (range mode only)",
  },
  {
    name: "onRangeSwitch",
    type: "(data: RangeSwitchEventData) => void",
    default: "undefined",
    description:
      "Triggered when switching between from/to segments (range mode only)",
  },
  {
    name: "onRangeValidation",
    type: "(data: RangeValidationEventData) => void",
    default: "undefined",
    description: "Triggered on range validation (range mode only)",
  },
  {
    name: "onWheelScrollStart",
    type: "(data: WheelScrollStartEventData) => void",
    default: "undefined",
    description:
      "Triggered when a wheel column starts scrolling (wheel and compact-wheel modes). New in 4.5.0.",
  },
  {
    name: "onWheelScrollEnd",
    type: "(data: WheelScrollEndEventData) => void",
    default: "undefined",
    description:
      "Triggered when a wheel column stops and snaps to a value (wheel and compact-wheel modes). New in 4.5.0.",
  },
  {
    name: "onClear",
    type: "(data: ClearEventData) => void",
    default: "undefined",
    description: "Triggered when user clicks the clear button",
  },
];

const OptionsTable = ({ options }: { options: OptionRow[] }) => (
  <ApiTable
    columns={[
      { key: "name", label: "Option" },
      { key: "type", label: "Type", mono: true },
      { key: "default", label: "Default", mono: true },
      { key: "description", label: "Description" },
    ]}
    rows={options.map((option) => ({
      id: option.name,
      name: <code>{option.name}</code>,
      type: <code>{option.type}</code>,
      default: <code>{option.default}</code>,
      description: option.description,
    }))}
    rowKey="id"
  />
);

const themes = [
  { name: "basic", description: "Default Material Design theme" },
  { name: "crane", description: "Google Crane theme with rounded corners" },
  {
    name: "crane-straight",
    description: "Google Crane theme with straight edges",
  },
  { name: "m3-green", description: "Material Design 3 (green variant)" },
  { name: "m2", description: "Material Design 2 classic theme" },
  { name: "dark", description: "Dark mode theme" },
  { name: "glassmorphic", description: "Modern glass effect" },
  { name: "pastel", description: "Soft pastel colors" },
  { name: "ai", description: "Futuristic AI-inspired theme" },
  { name: "cyberpunk", description: "Neon cyberpunk aesthetic" },
  {
    name: "blueprint",
    description: "Light precision-instrument look with a cobalt accent (new in v4.4.0)",
  },
  {
    name: "blueprint-dark",
    description: "Dark sibling of Blueprint on navy surfaces (new in v4.4.0)",
  },
];

export default function OptionsPage() {
  return (
    <div>
      <PageHeader
        title="Options API Reference"
        description="Complete v4.0.0 configuration options reference with grouped structure"
      />

      <Callout title="Important notice" tone="tip">
        <strong>v4.0.0 Breaking Change:</strong> Options are now organized into
        groups:{" "}
        <code>clock</code>, <code>ui</code>,{" "}
        <code>labels</code>,{" "}
        <code>behavior</code>,{" "}
        <code>callbacks</code>,{" "}
        <code>timezone</code>,{" "}
        <code>range</code> and{" "}
        <code>wheel</code>. See the{" "}
        <Link href="/docs/migration-guide">migration guide</Link>
        . 4.5.0 renames some options. The old names still work until 5.0 and
        are listed in{" "}
        <a href="#renamed">Renamed in 4.5.0</a>
        .
      </Callout>

      <Section title="Clock Options">
        <p>
          Clock behavior and time configuration options:
        </p>
        <OptionsTable options={clockOptions} />
      </Section>

      <Section title="UI Options">
        <p>
          Visual appearance and display options:
        </p>
        <OptionsTable options={uiOptions} />
      </Section>

      <Section title="Wheel Options">
        <p>
          Wheel / compact-wheel mode configuration via{" "}
          <code>wheel</code>:
        </p>
        <OptionsTable options={wheelOptions} />
      </Section>

      <Section title="Labels Options">
        <p>
          Every text the picker shows or gives to screen readers, for
          localization. <code>second</code> and{" "}
          <code>announceCleared</code> are new in
          4.5.0. Keys that got a new name in 4.5.0 are listed in{" "}
          <a href="#renamed">Renamed in 4.5.0</a>
          .
        </p>
        <OptionsTable options={labelsOptions} />
      </Section>

      <Section title="Behavior Options">
        <p>
          Interaction and accessibility behavior:
        </p>
        <OptionsTable options={behaviorOptions} />
      </Section>

      <Section title="Callbacks Options">
        <p>
          Event handlers and lifecycle callbacks:
        </p>
        <OptionsTable options={callbacksOptions} />
      </Section>

      <Section title="Timezone Options">
        <p>
          Optional timezone selector (requires the timezone plugin) via{" "}
          <code>timezone</code>. Its label is{" "}
          <code>labels.timezone</code>:
        </p>
        <OptionsTable options={timezoneOptions} />
      </Section>

      <Section title="Range Options">
        <p>
          Optional from-to range selection (requires the range plugin) via{" "}
          <code>range</code>. The tab texts are{" "}
          <code>labels.rangeFrom</code> and{" "}
          <code>labels.rangeTo</code>:
        </p>
        <OptionsTable options={rangeOptions} />
      </Section>

      <Section id="renamed" title="Renamed in 4.5.0">
        <p>
          These options got clearer names in 4.5.0. The old names still work
          and are removed in 5.0. When both names are set, the new one wins.{" "}
          <code>picker.options</code> keeps returning
          the old names until 5.0. To prepare for 5.0, see the{" "}
          <Link href="/docs/migration-guide-v5">Migration Guide v4 to v5</Link>
          .
        </p>
        <RenamedOptionsTable rows={renamedOptions} />
      </Section>

      <Section title="Available Themes">
        <p>
          Choose from 12 built-in themes via{" "}
          <code>ui.theme</code>:
        </p>
        <dl>
          {themes.map((theme) => (
            <div key={theme.name}>
              <dt>
                <code>{theme.name}</code>
              </dt>
              <dd>{theme.description}</dd>
            </div>
          ))}
        </dl>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'cyberpunk' }
});`}
          language="typescript"
        />
      </Section>

      <Section title="Inline Mode Configuration">
        <p>
          Configure inline mode via{" "}
          <code>ui.inline</code>:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      container: '#timepicker-container', // selector or element
      showButtons: false,  // Hide OK/Cancel buttons
      autoUpdate: true     // Auto-update input on change
    }
  }
});`}
          language="typescript"
        />
      </Section>

      <Section title="Wheel Mode Configuration">
        <p>
          Configure wheel/compact-wheel mode via{" "}
          <code>wheel</code>. Both modes need the
          wheel plugin. <code>placement</code> and{" "}
          <code>hideFooter</code> apply to{" "}
          <code>compact-wheel</code> only:
        </p>
        <CodeBlock
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'bottom',     // Popover below the input; unset = modal
    hideFooter: true,        // No OK/Cancel/Clear footer
    commitOnScroll: true     // Commit value on scroll end
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Disabled Time Configuration">
        <p>
          Disable specific hours, minutes, seconds or time ranges via{" "}
          <code>clock.disabledTime</code>. Use either
          the lists or <code>ranges</code>: when{" "}
          <code>ranges</code> is set, the lists are
          ignored. See{" "}
          <Link href="/docs/features/seconds">Seconds</Link>{" "}
          for ranges with seconds.
        </p>
        <CodeBlock
          code={`// Lists
const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      hours: [1, 3, 5, 8],      // Disable specific hours
      minutes: [15, 30, 45]     // Disable specific minutes
    }
  },
  wheel: {
    hideDisabled: true          // Hide disabled items instead of greying out (wheel modes only)
  }
});

// Ranges (string or string[])
const rangesPicker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      ranges: ['10:00 AM - 12:00 PM', '5:00 PM - 8:00 PM']
    }
  }
});`}
          language="typescript"
        />
      </Section>

      <Section title="Default Time Configuration">
        <p>
          Set the time the picker shows while the input is empty via{" "}
          <code>clock.defaultTime</code>.{" "}
          <code>&apos;now&apos;</code> also writes the
          current time to the input when the picker is created, replacing its
          value. The object form with{" "}
          <code>updateInput: false</code> only shows
          it:
        </p>
        <CodeBlock
          code={`// Current time, written to the input
const picker = new TimepickerUI(input, {
  clock: { defaultTime: 'now' }
});

// A fixed time, shown in the picker only
const morningPicker = new TimepickerUI(input, {
  clock: {
    defaultTime: { time: new Date(2026, 0, 1, 9, 30), updateInput: false }
  }
});`}
          language="typescript"
        />
      </Section>

      <Section title="Complete v4.0.0 Example">
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  // Clock options
  clock: {
    type: '24h',
    incrementHours: 1,
    incrementMinutes: 5,
    autoSwitchToMinutes: true,
    showSeconds: false,
    disabledTime: {
      ranges: ['00:00 - 03:59', '10:00 - 12:00']
    },
    defaultTime: 'now'
  },

  // UI options
  ui: {
    theme: 'dark',
    animation: true,
    backdrop: true,
    initialView: 'clock',
    allowPageScroll: false,
    viewSwitch: false,
    editable: false,
    cssClass: 'custom-picker',
    appendTo: '#timepicker-container',
    clearButton: { clearInput: true }
  },

  // Wheel options (wheel / compact-wheel modes)
  wheel: {
    placement: 'bottom',
    hideFooter: true,
    commitOnScroll: true,
    hideDisabled: true,
    ignoreOutsideClick: false
  },

  // Labels options
  labels: {
    ok: 'Confirm',
    cancel: 'Close',
    clockTitle: 'Choose Time',
    am: 'AM',
    pm: 'PM',
    keyboardTitle: 'Enter Time',
    hour: 'Hour',
    minute: 'Minute',
    second: 'Second'
  },

  // Behavior options
  behavior: {
    focusTrap: true,
    returnFocus: true,
    delayHandler: 0,
    id: 'my-timepicker'
  },

  // Callbacks options
  callbacks: {
    onConfirm: (data) => console.log('Confirmed:', data),
    onCancel: () => console.log('Cancelled'),
    onOpen: () => console.log('Opened'),
    onUpdate: (data) => console.log('Updated:', data),
    onSelectHour: (data) => console.log('Hour selected:', data.hour),
    onSelectMinute: (data) => console.log('Minute selected:', data.minutes),
    onSelectPeriod: (data) => console.log('Period selected:', data.type),
    onSwitchFace: (data) => console.log('Face shown:', data.face),
    onError: (data) => console.error('Error:', data.error)
  }
});`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
