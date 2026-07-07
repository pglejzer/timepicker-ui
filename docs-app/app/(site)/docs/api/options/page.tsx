import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  Layout,
  Lock,
  Clock,
  Type,
  Palette,
  Sliders,
  Bell,
  Trash2,
  Globe,
  ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Options",
  description:
    "Complete options reference for timepicker-ui - clock, ui, labels, behavior, callbacks and plugin config for the zero-dependency, SSR-safe time picker.",
  path: "/docs/api/options",
});

const clockOptions = [
  {
    name: "type",
    type: '"12h" | "24h"',
    default: '"12h"',
    description: "Clock format type",
  },
  {
    name: "incrementHours",
    type: "number",
    default: "1",
    description: "Hour increment step (1, 2, 3, etc.)",
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
    name: "disabledTime",
    type: "DisabledTime",
    default: "undefined",
    description: "Disable specific hours, minutes, or intervals",
  },
  {
    name: "smoothHourSnap",
    type: "boolean",
    default: "true",
    description: "Enable smooth hour dragging with snap animation",
  },
  {
    name: "currentTime",
    type: "CurrentTime",
    default: "undefined",
    description: "Set current time configuration",
  },
];

const uiOptions = [
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
    name: "mobile",
    type: "boolean",
    default: "false",
    description: "Force mobile version",
  },
  {
    name: "enableSwitchIcon",
    type: "boolean",
    default: "false",
    description: "Show desktop/mobile switch icon",
  },
  {
    name: "editable",
    type: "boolean",
    default: "false",
    description: "Allow manual input editing",
  },
  {
    name: "enableScrollbar",
    type: "boolean",
    default: "false",
    description: "Keep page scroll when picker is open",
  },
  {
    name: "cssClass",
    type: "string",
    default: "undefined",
    description: "Additional CSS class for timepicker wrapper",
  },
  {
    name: "appendModalSelector",
    type: "string",
    default: '""',
    description: "DOM selector to append timepicker (defaults to body)",
  },
  {
    name: "iconTemplate",
    type: "string",
    default: "undefined",
    description: "Custom HTML template for desktop icon",
  },
  {
    name: "iconTemplateMobile",
    type: "string",
    default: "undefined",
    description: "Custom HTML template for mobile icon",
  },
  {
    name: "inline",
    type: "InlineOptions",
    default: "undefined",
    description: "Inline mode configuration",
  },
  {
    name: "clearButton",
    type: "boolean",
    default: "false",
    description: "Show clear button to reset time selection",
  },
  {
    name: "mode",
    type: '"clock" | "wheel" | "compact-wheel"',
    default: '"clock"',
    description:
      "Picker mode \u2014 analog clock face, scroll-spinner wheels, or headerless wheel",
  },
];

const wheelOptions = [
  {
    name: "placement",
    type: '"auto" | "top" | "bottom"',
    default: "undefined",
    description: "Popover placement relative to input in compact-wheel mode",
  },
  {
    name: "hideFooter",
    type: "boolean",
    default: "false",
    description: "Hide footer (OK/Cancel/Clear buttons) in compact-wheel mode",
  },
  {
    name: "commitOnScroll",
    type: "boolean",
    default: "false",
    description:
      "Auto-commit time at end of wheel scrolling without pressing OK",
  },
  {
    name: "hideDisabled",
    type: "boolean",
    default: "false",
    description:
      "Completely remove disabled hours/minutes from the wheel list instead of dimming them",
  },
  {
    name: "ignoreOutsideClick",
    type: "boolean",
    default: "false",
    description:
      "Prevent the picker from closing when clicking outside its area",
  },
];

const labelsOptions = [
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
    name: "time",
    type: "string",
    default: '"Select time"',
    description: "Time label for desktop version",
  },
  {
    name: "mobileTime",
    type: "string",
    default: '"Enter Time"',
    description: "Time label for mobile version",
  },
  {
    name: "mobileHour",
    type: "string",
    default: '"Hour"',
    description: "Hour label for mobile version",
  },
  {
    name: "mobileMinute",
    type: "string",
    default: '"Minute"',
    description: "Minute label for mobile version",
  },
  {
    name: "clear",
    type: "string",
    default: '"Clear"',
    description: "Text for clear button",
  },
  {
    name: "hourLabel",
    type: "string",
    default: '"Hour"',
    description: "Accessible label for the hour spinbutton",
  },
  {
    name: "minuteLabel",
    type: "string",
    default: '"Minute"',
    description: "Accessible label for the minute spinbutton",
  },
  {
    name: "clockLabel",
    type: "string",
    default: '"Clock"',
    description: "Accessible label for the analog clock face group",
  },
  {
    name: "periodLabel",
    type: "string",
    default: '"Period"',
    description: "Accessible label for the AM/PM period group",
  },
  {
    name: "timeLabel",
    type: "string",
    default: '"Time"',
    description: "Accessible label for the time wrapper group / tips",
  },
  {
    name: "format24Label",
    type: "string",
    default: '"24-hour"',
    description: "Accessible label for the 24-hour tips group",
  },
  {
    name: "rangeSelectionLabel",
    type: "string",
    default: '"Range selection"',
    description: "Accessible label for the range selection tablist",
  },
  {
    name: "switchToKeyboardLabel",
    type: "string",
    default: '"Switch to keyboard input"',
    description: "Accessible label for the keyboard-input switch icon",
  },
  {
    name: "switchToClockLabel",
    type: "string",
    default: '"Switch to clock"',
    description: "Accessible label for the clock-view switch icon",
  },
  {
    name: "toggleLabel",
    type: "string",
    default: '"Toggle"',
    description: "Accessible label for the generic view toggle button",
  },
  {
    name: "timezoneSelectorLabel",
    type: "string",
    default: '"Timezone"',
    description: "Accessible label for the timezone selector",
  },
  {
    name: "announceHour",
    type: "string",
    default: '"Hour"',
    description: "Screen-reader announcement prefix for the selected hour",
  },
  {
    name: "announceMinute",
    type: "string",
    default: '"Minutes"',
    description: "Screen-reader announcement prefix for the selected minutes",
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
];

const timezoneOptions = [
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
      'Default timezone ID (e.g. "America/New_York"); browser timezone if not set',
  },
  {
    name: "whitelist",
    type: "readonly string[]",
    default: "undefined",
    description:
      "Whitelist of allowed timezone IDs; curated list of common timezones if not set",
  },
  {
    name: "label",
    type: "string",
    default: '"Timezone"',
    description: "Label for the timezone selector",
  },
];

const rangeOptions = [
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
    description: "Minimum duration in minutes",
  },
  {
    name: "maxDuration",
    type: "number",
    default: "undefined",
    description: "Maximum duration in minutes",
  },
  {
    name: "fromLabel",
    type: "string",
    default: '"From"',
    description: 'Label for the "from" segment',
  },
  {
    name: "toLabel",
    type: "string",
    default: '"To"',
    description: 'Label for the "to" segment',
  },
];

const behaviorOptions = [
  {
    name: "focusInputAfterClose",
    type: "boolean",
    default: "false",
    description: "Focus input after closing modal",
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
    default: "300",
    description: "Debounce delay for buttons (ms)",
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "Custom ID for timepicker instance",
  },
];

const callbacksOptions = [
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
    description: "Triggered when picker opens",
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
    name: "onSelectAM",
    type: "(data: SelectAMEventData) => void",
    default: "undefined",
    description: "Triggered when AM is selected",
  },
  {
    name: "onSelectPM",
    type: "(data: SelectPMEventData) => void",
    default: "undefined",
    description: "Triggered when PM is selected",
  },
  {
    name: "onError",
    type: "(data: ErrorEventData) => void",
    default: "undefined",
    description: "Triggered when validation error occurs",
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
    name: "onClear",
    type: "(data: ClearEventData) => void",
    default: "undefined",
    description: "Triggered when user clicks the clear button",
  },
];

const clearBehaviorOptions = [
  {
    name: "clearInput",
    type: "boolean",
    default: "true",
    description: "Whether clearing also empties the input field value",
  },
];

const OptionsTable = ({ options }: { options: typeof clockOptions }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="border-b border-border">
          <th className="px-4 py-3 text-left font-semibold text-foreground">
            Option
          </th>
          <th className="px-4 py-3 text-left font-semibold text-foreground">
            Type
          </th>
          <th className="px-4 py-3 text-left font-semibold text-foreground">
            Default
          </th>
          <th className="px-4 py-3 text-left font-semibold text-foreground">
            Description
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {options.map((option) => (
          <tr key={option.name} className="hover:bg-muted/30 transition-colors">
            <td className="px-4 py-3">
              <code className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-mono">
                {option.name}
              </code>
            </td>
            <td className="px-4 py-3 text-muted-foreground">
              <code className="text-xs">{option.type}</code>
            </td>
            <td className="px-4 py-3">
              <code className="text-xs text-muted-foreground">
                {option.default}
              </code>
            </td>
            <td className="px-4 py-3 text-muted-foreground">
              {option.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
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
    description: "Dark sibling of Blueprint on near-black surfaces (new in v4.4.0)",
  },
];

export default function OptionsPage() {
  return (
    <div>
      <PageHeader
        title="Options API Reference"
        description="Complete v4.0.0 configuration options reference with grouped structure"
        eyebrow="API"
      />

      <InfoBox title="Important notice" variant="emerald" className="mb-8">
        <strong>v4.0.0 Breaking Change:</strong> Options are now organized into
        9 logical groups:
        <code className="mx-1">clock</code>, <code className="mx-1">ui</code>,{" "}
        <code className="mx-1">labels</code>,
        <code className="mx-1">behavior</code>,{" "}
        <code className="mx-1">callbacks</code>,{" "}
        <code className="mx-1">timezone</code>,{" "}
        <code className="mx-1">range</code>, <code className="mx-1">wheel</code>
        , and <code className="mx-1">clearBehavior</code>. See the{" "}
        <Link href="/docs/changelog" className="text-primary underline">
          changelog
        </Link>{" "}
        for migration guide.
      </InfoBox>

      <Section icon={Clock} title="Clock Options">
        <p className="text-muted-foreground mb-4">
          Clock behavior and time configuration options:
        </p>
        <OptionsTable options={clockOptions} />
      </Section>

      <Section icon={Palette} title="UI Options">
        <p className="text-muted-foreground mb-4">
          Visual appearance and display options:
        </p>
        <OptionsTable options={uiOptions} />
      </Section>

      <Section icon={Layout} title="Wheel Options">
        <p className="text-muted-foreground mb-4">
          Wheel / compact-wheel mode configuration via{" "}
          <code className="text-primary">wheel</code>:
        </p>
        <OptionsTable options={wheelOptions} />
      </Section>

      <Section icon={Type} title="Labels Options">
        <p className="text-muted-foreground mb-4">
          Customize all text labels for localization. The accessibility labels
          (from <code className="text-primary">hourLabel</code> to{" "}
          <code className="text-primary">invalidTimeFormat</code>) are new in
          v4.4.0:
        </p>
        <OptionsTable options={labelsOptions} />
      </Section>

      <Section icon={Sliders} title="Behavior Options">
        <p className="text-muted-foreground mb-4">
          Interaction and accessibility behavior:
        </p>
        <OptionsTable options={behaviorOptions} />
      </Section>

      <Section icon={Bell} title="Callbacks Options">
        <p className="text-muted-foreground mb-4">
          Event handlers and lifecycle callbacks:
        </p>
        <OptionsTable options={callbacksOptions} />
      </Section>

      <Section icon={Globe} title="Timezone Options">
        <p className="text-muted-foreground mb-4">
          Optional timezone selector (requires the timezone plugin) via{" "}
          <code className="text-primary">timezone</code>:
        </p>
        <OptionsTable options={timezoneOptions} />
      </Section>

      <Section icon={ArrowLeftRight} title="Range Options">
        <p className="text-muted-foreground mb-4">
          Optional from-to range selection (requires the range plugin) via{" "}
          <code className="text-primary">range</code>:
        </p>
        <OptionsTable options={rangeOptions} />
      </Section>

      <Section icon={Trash2} title="Clear Behavior Options">
        <p className="text-muted-foreground mb-4">
          Control clear button behavior via{" "}
          <code className="text-primary">clearBehavior</code>:
        </p>
        <OptionsTable options={clearBehaviorOptions} />
      </Section>

      <Section icon={Palette} title="Available Themes">
        <p className="text-muted-foreground mb-6">
          Choose from 12 built-in themes via{" "}
          <code className="text-primary">ui.theme</code>:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="font-semibold mb-2 text-foreground">
                  <code className="text-primary">{theme.name}</code>
                </h3>
                <p className="text-sm text-muted-foreground">
                  {theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeBlock
            code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'cyberpunk' }
});`}
            language="typescript"
          />
        </div>
      </Section>

      <Section icon={Layout} title="Inline Mode Configuration">
        <p className="text-muted-foreground mb-4">
          Configure inline mode via{" "}
          <code className="text-primary">ui.inline</code>:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      containerId: 'timepicker-container',
      showButtons: false,  // Hide OK/Cancel buttons
      autoUpdate: true     // Auto-update input on change
    }
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Layout} title="Wheel Mode Configuration">
        <p className="text-muted-foreground mb-4">
          Configure wheel/compact-wheel mode via{" "}
          <code className="text-primary">wheel</code>:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { mode: 'wheel' },
  wheel: {
    placement: 'bottom',     // Popover placement (compact-wheel only)
    hideFooter: true,        // Hide OK/Cancel footer
    commitOnScroll: true     // Commit value on scroll end
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Lock} title="Disabled Time Configuration">
        <p className="text-muted-foreground mb-4">
          Disable specific hours, minutes, or intervals via{" "}
          <code className="text-primary">clock.disabledTime</code>:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      hours: [1, 3, 5, 8],                    // Disable specific hours
      minutes: [15, 30, 45],                  // Disable specific minutes
      interval: '10:00 AM - 12:00 PM',        // Or disable a whole time interval (string or string[])
    }
  },
  wheel: {
    hideDisabled: true                   // Hide disabled items instead of greying out (wheel modes only)
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Clock} title="Current Time Configuration">
        <p className="text-muted-foreground mb-4">
          Set current time via{" "}
          <code className="text-primary">clock.currentTime</code>:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    currentTime: {
      updateInput: true,
      locales: 'en-US',
      time: new Date()
    }
  }
});`}
          language="typescript"
        />
      </Section>

      <div className="mt-12 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">
          Complete v4.0.0 Example
        </h2>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  // Clock options
  clock: {
    type: '24h',
    incrementHours: 1,
    incrementMinutes: 5,
    autoSwitchToMinutes: true,
    disabledTime: {
      hours: [0, 1, 2, 3],
      interval: '10:00 - 12:00'
    },
    currentTime: {
      updateInput: true,
      time: new Date()
    }
  },
  
  // UI options
  ui: {
    theme: 'dark',
    animation: true,
    backdrop: true,
    mobile: false,
    enableScrollbar: false,
    enableSwitchIcon: false,
    editable: false,
    cssClass: 'custom-picker',
    appendModalSelector: '#timepicker-container'
  },

  // Wheel options
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
    time: 'Choose Time',
    am: 'AM',
    pm: 'PM',
    mobileTime: 'Enter Time',
    mobileHour: 'Hour',
    mobileMinute: 'Minute'
  },
  
  // Behavior options
  behavior: {
    focusTrap: true,
    focusInputAfterClose: false,
    delayHandler: 300,
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
    onError: (data) => console.error('Error:', data.error)
  }
});`}
          language="typescript"
        />
      </div>
    </div>
  );
}
