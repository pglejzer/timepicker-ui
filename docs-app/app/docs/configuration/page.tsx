import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { Settings, Tag, Layout, Lock, Clock, Zap, Bell } from "lucide-react";
import { InfoBox } from "@/components/info-box";

export const metadata = {
  title: "Configuration - Timepicker-UI",
};

const clockOptions = [
  {
    name: "type",
    type: "12h | 24h",
    default: "12h",
    description: "Clock format",
  },
  {
    name: "incrementHours",
    type: "number",
    default: "1",
    description: "Hour increment step",
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
    default: "false",
    description: "Auto-switch after hour",
  },
  {
    name: "disabledTime",
    type: "object",
    default: "undefined",
    description: "Disable specific times",
  },
  {
    name: "currentTime",
    type: "boolean | object",
    default: "undefined",
    description: "Set current time",
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
    name: "mobile",
    type: "boolean",
    default: "false",
    description: "Force mobile mode",
  },
  {
    name: "enableSwitchIcon",
    type: "boolean",
    default: "false",
    description: "Show mode switch icon",
  },
  {
    name: "editable",
    type: "boolean",
    default: "false",
    description: "Allow manual input",
  },
  {
    name: "enableScrollbar",
    type: "boolean",
    default: "false",
    description: "Keep scrollable",
  },
  {
    name: "cssClass",
    type: "string",
    default: "undefined",
    description: "Custom CSS class",
  },
  {
    name: "appendModalSelector",
    type: "string",
    default: '""',
    description: "Custom container",
  },
  {
    name: "iconTemplate",
    type: "string",
    default: "SVG",
    description: "Desktop icon",
  },
  {
    name: "iconTemplateMobile",
    type: "string",
    default: "SVG",
    description: "Mobile icon",
  },
  {
    name: "inline",
    type: "object",
    default: "undefined",
    description: "Inline mode config",
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
    name: "time",
    type: "string",
    default: "Select time",
    description: "Desktop label",
  },
  {
    name: "mobileTime",
    type: "string",
    default: "Enter Time",
    description: "Mobile label",
  },
  {
    name: "mobileHour",
    type: "string",
    default: "Hour",
    description: "Mobile hour",
  },
  {
    name: "mobileMinute",
    type: "string",
    default: "Minute",
    description: "Mobile minute",
  },
];

const behaviorOptions = [
  {
    name: "focusInputAfterClose",
    type: "boolean",
    default: "false",
    description: "Focus input on close",
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
    default: "300",
    description: "Click delay (ms)",
  },
  {
    name: "id",
    type: "string",
    default: "auto",
    description: "Custom instance ID",
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
    name: "onSelectAM",
    type: "function",
    default: "undefined",
    description: "AM selected",
  },
  {
    name: "onSelectPM",
    type: "function",
    default: "undefined",
    description: "PM selected",
  },
  {
    name: "onError",
    type: "function",
    default: "undefined",
    description: "Error occurred",
  },
];

function OptionsTable({ options, title }: { options: any[]; title?: string }) {
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
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Configuration
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete configuration guide for v4.0.0 (grouped options structure)
        </p>
      </div>

      <InfoBox title="v4.0.0 Breaking Change" variant="orange" className="mb-8">
        Options are now organized into 5 logical groups: <code>clock</code>,{" "}
        <code>ui</code>, <code>labels</code>, <code>behavior</code>, and{" "}
        <code>callbacks</code>. See migration guide in the changelog.
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
      </Section>

      <Section icon={Tag} title="Labels Options">
        <p className="text-muted-foreground mb-4">
          Customize all text labels and button texts:
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
          Event handlers for user interactions:
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
    disabledTime: {
      hours: [0, 1, 2, 3],
      interval: ['12:00 PM - 1:00 PM']
    }
  },
  ui: {
    theme: 'dark',
    animation: true,
    backdrop: true,
    mobile: false,
    editable: false,
    enableScrollbar: false,
    enableSwitchIcon: true
  },
  labels: {
    ok: 'Confirm',
    cancel: 'Close',
    time: 'Choose Time'
  },
  behavior: {
    focusTrap: true,
    focusInputAfterClose: false,
    delayHandler: 300
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
  }
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disable Time Intervals
            </h3>
            <CodeBlock
              code={`{
  clock: {
    disabledTime: {
      interval: ['10:00 AM - 2:00 PM', '5:00 PM - 8:00 PM']
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
      containerId: 'timepicker-container',
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
          Current Time
        </h2>
        <CodeBlock
          code={`{
  clock: {
    currentTime: {
      updateInput: true,
      locales: 'en-US',
      time: new Date()
    }
  }
}`}
          language="typescript"
        />
      </section>
    </div>
  );
}
