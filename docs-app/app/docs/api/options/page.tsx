import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import {
  Settings,
  Layout,
  Lock,
  Clock,
  Type,
  Palette,
  Sliders,
  Bell,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Options - Timepicker-UI",
  description: "Complete configuration options reference",
};

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
    description: "UI theme (basic, dark, m3-green, cyberpunk, etc.)",
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
    type: "(data: CallbackData) => void",
    default: "undefined",
    description: "Triggered when user confirms time selection",
  },
  {
    name: "onCancel",
    type: "(data: CallbackData) => void",
    default: "undefined",
    description: "Triggered when user cancels",
  },
  {
    name: "onOpen",
    type: "() => void",
    default: "undefined",
    description: "Triggered when picker opens",
  },
  {
    name: "onUpdate",
    type: "(data: CallbackData) => void",
    default: "undefined",
    description: "Triggered during time changes",
  },
  {
    name: "onSelectHour",
    type: "(data: CallbackData) => void",
    default: "undefined",
    description: "Triggered when hour is selected",
  },
  {
    name: "onSelectMinute",
    type: "(data: CallbackData) => void",
    default: "undefined",
    description: "Triggered when minute is selected",
  },
  {
    name: "onSelectAM",
    type: "() => void",
    default: "undefined",
    description: "Triggered when AM is selected",
  },
  {
    name: "onSelectPM",
    type: "() => void",
    default: "undefined",
    description: "Triggered when PM is selected",
  },
  {
    name: "onError",
    type: "(data: CallbackData) => void",
    default: "undefined",
    description: "Triggered when validation error occurs",
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
];

export default function OptionsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Options API Reference
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete v4.0.0 configuration options reference with grouped structure
        </p>
      </div>

      <InfoBox title="Important notice" variant="emerald" className="mb-8">
        <strong>v4.0.0 Breaking Change:</strong> Options are now organized into
        5 logical groups:
        <code className="mx-1">clock</code>, <code className="mx-1">ui</code>,{" "}
        <code className="mx-1">labels</code>,
        <code className="mx-1">behavior</code>, and{" "}
        <code className="mx-1">callbacks</code>. See the{" "}
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

      <Section icon={Type} title="Labels Options">
        <p className="text-muted-foreground mb-4">
          Customize all text labels for localization:
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

      <Section icon={Palette} title="Available Themes">
        <p className="text-muted-foreground mb-6">
          Choose from 10 built-in themes via{" "}
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

      <Section icon={Lock} title="Disabled Time Configuration">
        <p className="text-muted-foreground mb-4">
          Disable specific hours, minutes, or intervals via{" "}
          <code className="text-primary">clock.disabledTime</code>:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      hours: [1, 3, 5, 8],              // Disable specific hours
      minutes: [15, 30, 45],            // Disable specific minutes
      interval: 15                      // Or use interval shorthand (15, 30, etc.)
    }
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
      interval: 15
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
