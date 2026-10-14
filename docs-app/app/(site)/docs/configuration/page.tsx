import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import {
  Settings,
  Tag,
  Layout,
  Clock,
  Zap,
  Bell,
} from "lucide-react";
import { InfoBox } from "@/components/info-box";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Configuration",
  description:
    "Configure timepicker-ui - clock, ui, labels, behavior, callbacks, timezone, range and wheel option groups for the zero-dependency, SSR-safe time picker.",
  path: "/docs/configuration",
});

const clockOptions = [
  {
    name: "type",
    type: "12h | 24h | auto",
    default: "12h",
    description: "Clock format. auto picks 12h or 24h from the browser locale",
  },
  {
    name: "incrementHours",
    type: "number",
    default: "1",
    description: "Hour step on the clock, the wheel and the arrow keys (1, 2, 3, 4 or 6)",
  },
  {
    name: "incrementMinutes",
    type: "number",
    default: "1",
    description: "Minute increment step",
  },
  {
    name: "autoSwitchToMinutes",
    type: "boolean",
    default: "true",
    description: "Auto-switch after hour",
  },
  {
    name: "showSeconds",
    type: "boolean",
    default: "false",
    description: "Show seconds (values become HH:MM:SS)",
  },
  {
    name: "incrementSeconds",
    type: "1 | 5 | 10 | 15 | 20 | 30",
    default: "1",
    description: "Seconds increment step",
  },
  {
    name: "autoSwitchToSeconds",
    type: "boolean",
    default: "true",
    description: "Auto-switch after minute (with showSeconds)",
  },
  {
    name: "disabledTime",
    type: "object",
    default: "undefined",
    description: "Disable hours, minutes, seconds or time ranges",
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
    type: "'now' | object",
    default: "undefined",
    description:
      "Time shown while the input is empty. 'now' also writes the current time to the input",
  },
];

const uiOptions = [
  {
    name: "theme",
    type: "string",
    default: "basic",
    description: "Theme name",
  },
  {
    name: "animation",
    type: "boolean",
    default: "true",
    description: "Enable animations",
  },
  {
    name: "backdrop",
    type: "boolean",
    default: "true",
    description: "Show backdrop",
  },
  {
    name: "initialView",
    type: "clock | keyboard",
    default: "clock",
    description: "View shown when the picker opens",
  },
  {
    name: "viewSwitch",
    type: "boolean",
    default: "false",
    description: "Show the clock / keyboard view switch",
  },
  {
    name: "editable",
    type: "boolean",
    default: "false",
    description: "Allow manual input",
  },
  {
    name: "allowPageScroll",
    type: "boolean",
    default: "false",
    description:
      "Let the page scroll while open. When false, the page is locked and --tp-scrollbar-gap on <html> holds the removed scrollbar width",
  },
  {
    name: "cssClass",
    type: "string",
    default: "undefined",
    description: "Custom CSS class",
  },
  {
    name: "appendTo",
    type: "string | HTMLElement",
    default: '""',
    description: "Element or selector the modal is appended to (body when empty)",
  },
  {
    name: "keyboardIcon",
    type: "string",
    default: '""',
    description:
      "Keyboard switch icon as raw HTML (built-in icon when empty). Trusted markup only",
  },
  {
    name: "clockIcon",
    type: "string",
    default: '""',
    description:
      "Clock switch icon as raw HTML (built-in icon when empty). Trusted markup only",
  },
  {
    name: "inline",
    type: "object",
    default: "undefined",
    description: "Inline mode config",
  },
  {
    name: "clearButton",
    type: "boolean | { clearInput }",
    default: "false",
    description:
      "Show clear button. { clearInput: false } keeps the input value on Clear",
  },
  {
    name: "mode",
    type: "clock | wheel | compact-wheel",
    default: "clock",
    description: "Picker mode",
  },
];

const wheelOptions = [
  {
    name: "placement",
    type: "auto | top | bottom",
    default: "undefined",
    description:
      "Compact-wheel popover placement. When unset, compact-wheel opens as a modal. auto: below if there is room, otherwise above. top / bottom: that side while it has room for at least three wheel rows, otherwise the other side",
  },
  {
    name: "hideFooter",
    type: "boolean",
    default: "false",
    description: "Hide footer in compact-wheel mode",
  },
  {
    name: "commitOnScroll",
    type: "boolean",
    default: "false",
    description: "Auto-commit time at scroll end",
  },
  {
    name: "hideDisabled",
    type: "boolean",
    default: "false",
    description: "Remove disabled values from wheel list",
  },
  {
    name: "ignoreOutsideClick",
    type: "boolean",
    default: "false",
    description: "Keep picker open on outside click",
  },
];

const labelsOptions = [
  { name: "am", type: "string", default: "AM", description: "AM label" },
  { name: "pm", type: "string", default: "PM", description: "PM label" },
  { name: "ok", type: "string", default: "OK", description: "OK button" },
  {
    name: "cancel",
    type: "string",
    default: "Cancel",
    description: "Cancel button",
  },
  {
    name: "clockTitle",
    type: "string",
    default: "Select time",
    description: "Heading of the clock face view",
  },
  {
    name: "keyboardTitle",
    type: "string",
    default: "Enter Time",
    description: "Heading of the keyboard view",
  },
  {
    name: "hour",
    type: "string",
    default: "Hour",
    description: "Hour field caption, accessible name and announcement",
  },
  {
    name: "minute",
    type: "string",
    default: "Minute",
    description: "Minute field caption, accessible name and announcement",
  },
  {
    name: "second",
    type: "string",
    default: "Second",
    description:
      "Second field caption, accessible name and announcement (with showSeconds)",
  },
  {
    name: "clear",
    type: "string",
    default: "Clear",
    description: "Clear button text",
  },
];

const behaviorOptions = [
  {
    name: "returnFocus",
    type: "boolean",
    default: "false",
    description:
      "Return focus to the input when the picker closes. true is recommended, and 5.0 makes it the default",
  },
  {
    name: "focusTrap",
    type: "boolean",
    default: "true",
    description: "Trap focus in modal",
  },
  {
    name: "delayHandler",
    type: "number",
    default: "0",
    description: "Extra delay (ms) before the picker starts to close",
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "Custom instance ID for TimepickerUI.getById()",
  },
];

const callbacksOptions = [
  {
    name: "onConfirm",
    type: "function",
    default: "undefined",
    description: "Time confirmed",
  },
  {
    name: "onCancel",
    type: "function",
    default: "undefined",
    description: "Cancelled",
  },
  {
    name: "onOpen",
    type: "function",
    default: "undefined",
    description: "Picker opened",
  },
  {
    name: "onShow",
    type: "function",
    default: "undefined",
    description: "User asked to open the picker",
  },
  {
    name: "onUpdate",
    type: "function",
    default: "undefined",
    description: "Time updated",
  },
  {
    name: "onSelectHour",
    type: "function",
    default: "undefined",
    description: "Hour selected",
  },
  {
    name: "onSelectMinute",
    type: "function",
    default: "undefined",
    description: "Minute selected",
  },
  {
    name: "onSelectSecond",
    type: "function",
    default: "undefined",
    description: "Second selected (with showSeconds)",
  },
  {
    name: "onSelectPeriod",
    type: "function",
    default: "undefined",
    description: "AM or PM selected, with { type }",
  },
  {
    name: "onSwitchFace",
    type: "function",
    default: "undefined",
    description: "Clock face switched between hours, minutes and seconds",
  },
  {
    name: "onSwitchView",
    type: "function",
    default: "undefined",
    description: "View switched (with viewSwitch)",
  },
  {
    name: "onError",
    type: "function",
    default: "undefined",
    description: "Error occurred",
  },
  {
    name: "onClear",
    type: "function",
    default: "undefined",
    description: "Time cleared",
  },
];

interface OptionRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

function OptionsTable({ options }: { options: OptionRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Property
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
            <tr
              key={option.name}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3">
                <code className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-mono">
                  {option.name}
                </code>
              </td>
              <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                {option.type}
              </td>
              <td className="px-4 py-3">
                <code className="text-xs">{option.default}</code>
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
}

export default function ConfigurationPage() {
  return (
    <div>
      <PageHeader
        title="Configuration"
        description="Complete configuration guide for v4.0.0 (grouped options structure)"
        eyebrow="Guide"
      />

      <InfoBox title="v4.0.0 Breaking Change" variant="orange" className="mb-8">
        Options are now organized into groups: <code>clock</code>,{" "}
        <code>ui</code>, <code>labels</code>, <code>behavior</code>,{" "}
        <code>callbacks</code>, <code>timezone</code>, <code>range</code> and{" "}
        <code>wheel</code>. See the{" "}
        <Link href="/docs/migration-guide" className="text-primary underline">
          migration guide
        </Link>
        . This page uses the option names from 4.5.0. The older names still
        work until 5.0 and are listed in{" "}
        <Link
          href="/docs/api/options#renamed"
          className="text-primary underline"
        >
          Renamed in 4.5.0
        </Link>
        .
      </InfoBox>

      <Section icon={Clock} title="Clock Options">
        <p className="text-muted-foreground mb-4">
          Configure clock behavior, format, and time restrictions:
        </p>
        <OptionsTable options={clockOptions} />
      </Section>

      <Section icon={Layout} title="UI Options">
        <p className="text-muted-foreground mb-4">
          Customize appearance, theme, and display modes:
        </p>
        <OptionsTable options={uiOptions} />
        <p className="text-sm text-muted-foreground mt-4">
          <code>keyboardIcon</code> and <code>clockIcon</code> are inserted as
          raw HTML, so pass only trusted markup. Every other label and text
          option is escaped.
        </p>
        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <h3 id="scroll-lock" className="font-semibold mb-3 text-foreground">
            Scroll lock and fixed headers
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            With <code>allowPageScroll: false</code> (the default), the page
            cannot scroll while the picker is open as a modal. Inline pickers
            and the compact-wheel popover do not lock it. The lock is set on{" "}
            <code>&lt;html&gt;</code>, and also on <code>&lt;body&gt;</code>{" "}
            when the body is the element that scrolls. If a scrollbar
            disappears, the picker adds its width as right padding, so the
            page content does not move.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            That padding does not reach <code>position: fixed</code> elements.
            While the page is locked, <code>&lt;html&gt;</code> has{" "}
            <code>--tp-scrollbar-gap</code> set to the width of the removed
            scrollbar (<code>0px</code> when there was none). Use it to keep a
            fixed header from jumping:
          </p>
          <CodeBlock
            code={`.site-header {
  padding-right: var(--tp-scrollbar-gap, 0px);
}`}
            language="css"
          />
          <p className="text-sm text-muted-foreground mt-4">
            The variable is removed when the last open picker closes.
          </p>
        </div>
      </Section>

      <Section icon={Layout} title="Wheel Options">
        <p className="text-muted-foreground mb-4">
          Wheel / compact-wheel mode configuration:
        </p>
        <OptionsTable options={wheelOptions} />
      </Section>

      <Section icon={Tag} title="Labels Options">
        <p className="text-muted-foreground mb-4">
          Customize the main text labels and button texts. The full list,
          including the accessibility labels, is on the{" "}
          <Link href="/docs/api/options" className="text-primary underline">
            Options
          </Link>{" "}
          page:
        </p>
        <OptionsTable options={labelsOptions} />
      </Section>

      <Section icon={Settings} title="Behavior Options">
        <p className="text-muted-foreground mb-4">
          Control focus, delays, and instance behavior:
        </p>
        <OptionsTable options={behaviorOptions} />
      </Section>

      <Section icon={Bell} title="Callbacks Options">
        <p className="text-muted-foreground mb-4">
          Event handlers for user interactions. Plugin and wheel callbacks are
          listed on the{" "}
          <Link href="/docs/api/events" className="text-primary underline">
            Events
          </Link>{" "}
          page:
        </p>
        <OptionsTable options={callbacksOptions} />
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground flex items-center gap-2">
          <Zap className="h-6 w-6" />
          Complete Example
        </h2>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    incrementHours: 1,
    incrementMinutes: 5,
    autoSwitchToMinutes: false,
    showSeconds: true,
    incrementSeconds: 5,
    disabledTime: {
      ranges: ['00:00 - 03:59', '12:00 - 13:00']
    }
  },
  ui: {
    theme: 'dark',
    animation: true,
    backdrop: true,
    initialView: 'clock',
    editable: false,
    allowPageScroll: false,
    viewSwitch: true,
    clearButton: { clearInput: false }
  },
  wheel: {                   // used by the wheel modes only
    hideFooter: true,
    commitOnScroll: true
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close',
    clockTitle: 'Choose Time'
  },
  behavior: {
    focusTrap: true,
    returnFocus: true,
    delayHandler: 0
  },
  callbacks: {
    onConfirm: (data) => console.log('Confirmed:', data),
    onCancel: () => console.log('Cancelled'),
    onUpdate: (data) => console.log('Updated:', data)
  }
});`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Disabled Time Examples
        </h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disable Specific Hours/Minutes
            </h3>
            <CodeBlock
              code={`{
  clock: {
    disabledTime: {
      hours: [1, 3, 5, 23],
      minutes: [15, 30, 45]
    }
  },
  wheel: {
    hideDisabled: true
  }
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disable Seconds
            </h3>
            <CodeBlock
              code={`{
  clock: {
    showSeconds: true,
    disabledTime: {
      seconds: [55, 56, 57, 58, 59]
    }
  }
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disable Time Ranges
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              When <code>ranges</code> is set, the <code>hours</code>,{" "}
              <code>minutes</code> and <code>seconds</code> lists are ignored.
              Edges can carry seconds. See{" "}
              <Link
                href="/docs/features/seconds"
                className="text-primary underline"
              >
                Seconds
              </Link>
              .
            </p>
            <CodeBlock
              code={`{
  clock: {
    disabledTime: {
      ranges: ['10:00 AM - 2:00 PM', '5:00 PM - 8:00 PM']
    }
  }
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Inline Mode
        </h2>
        <CodeBlock
          code={`{
  ui: {
    inline: {
      enabled: true,
      container: '#timepicker-container',
      autoUpdate: true,
      showButtons: false
    }
  }
}`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Wheel Mode
        </h2>
        <CodeBlock
          code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

const picker = new TimepickerUI(input, {
  ui: { mode: 'compact-wheel' },
  wheel: {
    placement: 'bottom',      // Popover below the input; unset = modal
    hideFooter: true,         // No OK/Cancel/Clear footer (compact-wheel only)
    commitOnScroll: true,     // Commit value on scroll end
    ignoreOutsideClick: true  // Keep open on outside click
  }
});
picker.create();`}
          language="typescript"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Default Time
        </h2>
        <p className="text-muted-foreground mb-4">
          <code>&apos;now&apos;</code> shows the current time and writes it to
          the input. The object form with <code>updateInput: false</code> only
          shows the time in the picker.
        </p>
        <CodeBlock
          code={`{
  clock: {
    defaultTime: 'now'
  }
}

{
  clock: {
    defaultTime: { time: new Date(2026, 0, 1, 9, 30), updateInput: false }
  }
}`}
          language="typescript"
        />
      </section>
    </div>
  );
}
