import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Settings, Layout, Lock, Clock, Type, Palette } from "lucide-react";

export const metadata = {
  title: "Options - Timepicker-UI",
  description: "Complete configuration options reference",
};

const basicOptions = [
  {
    name: "amLabel",
    type: "string",
    default: '"AM"',
    description: "Custom text for AM label",
  },
  {
    name: "animation",
    type: "boolean",
    default: "true",
    description: "Enable/disable open/close animations",
  },
  {
    name: "appendModalSelector",
    type: "string",
    default: '""',
    description: "DOM selector to append timepicker (defaults to body)",
  },
  {
    name: "backdrop",
    type: "boolean",
    default: "true",
    description: "Show/hide backdrop overlay",
  },
  {
    name: "cancelLabel",
    type: "string",
    default: '"CANCEL"',
    description: "Text for cancel button",
  },
  {
    name: "clockType",
    type: '"12h" | "24h"',
    default: '"12h"',
    description: "Clock format type",
  },
  {
    name: "cssClass",
    type: "string",
    default: "undefined",
    description: "Additional CSS class for timepicker wrapper",
  },
  {
    name: "delayHandler",
    type: "number",
    default: "300",
    description: "Debounce delay for buttons (ms)",
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
    name: "enableSwitchIcon",
    type: "boolean",
    default: "false",
    description: "Show desktop/mobile switch icon",
  },
  {
    name: "focusInputAfterCloseModal",
    type: "boolean",
    default: "false",
    description: "Focus input after closing modal",
  },
  {
    name: "focusTrap",
    type: "boolean",
    default: "true",
    description: "Trap focus within modal",
  },
  {
    name: "hourMobileLabel",
    type: "string",
    default: '"Hour"',
    description: "Hour label for mobile version",
  },
  {
    name: "id",
    type: "string",
    default: "undefined",
    description: "Custom ID for timepicker instance",
  },
  {
    name: "incrementHours",
    type: "number",
    default: "1",
    description: "Hour increment step (1, 2, 3)",
  },
  {
    name: "incrementMinutes",
    type: "number",
    default: "1",
    description: "Minute increment step (1, 5, 10, 15)",
  },
  {
    name: "minuteMobileLabel",
    type: "string",
    default: '"Minute"',
    description: "Minute label for mobile version",
  },
  {
    name: "mobile",
    type: "boolean",
    default: "false",
    description: "Force mobile version",
  },
  {
    name: "mobileTimeLabel",
    type: "string",
    default: '"Enter Time"',
    description: "Time label for mobile version",
  },
  {
    name: "okLabel",
    type: "string",
    default: '"OK"',
    description: "Text for OK button",
  },
  {
    name: "pmLabel",
    type: "string",
    default: '"PM"',
    description: "Custom text for PM label",
  },
  {
    name: "switchToMinutesAfterSelectHour",
    type: "boolean",
    default: "true",
    description: "Auto-switch to minutes after hour selection",
  },
  {
    name: "theme",
    type: "Theme",
    default: '"basic"',
    description: "UI theme (see themes section)",
  },
  {
    name: "timeLabel",
    type: "string",
    default: '"Select Time"',
    description: "Time label for desktop version",
  },
];

const themes = [
  { name: "basic", description: "Default Material Design theme" },
  {
    name: "crane-straight",
    description: "Google Crane theme with straight edges",
  },
  {
    name: "crane-radius",
    description: "Google Crane theme with rounded edges",
  },
  { name: "m3", description: "Material Design 3 (Material You)" },
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
          Options
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete configuration options reference
        </p>
      </div>

      <Section icon={Settings} title="Basic Options">
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
              {basicOptions.map((option) => (
                <tr
                  key={option.name}
                  className="hover:bg-muted/30 transition-colors"
                >
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
      </Section>

      <Section icon={Palette} title="Themes">
        <p className="text-muted-foreground mb-6">
          Choose from 9 built-in themes:
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
  theme: 'cyberpunk'
});`}
            language="typescript"
          />
        </div>
      </Section>

      <Section icon={Layout} title="Inline Mode">
        <p className="text-muted-foreground mb-4">
          Display timepicker without modal overlay:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  inline: {
    enabled: true,
    containerId: 'timepicker-container',
    showButtons: false,  // Hide OK/Cancel buttons
    autoUpdate: true     // Auto-update input on change
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Lock} title="Disabled Time">
        <p className="text-muted-foreground mb-4">
          Disable specific hours, minutes, or time ranges:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  disabledTime: {
    hours: [1, 3, 5, 8],              // Disable specific hours
    minutes: [15, 30, 45],            // Disable specific minutes
    interval: '10:00 AM - 2:00 PM'    // Disable time range
    // Or multiple ranges:
    // interval: ['10:00 AM - 2:00 PM', '5:00 PM - 8:00 PM']
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Clock} title="Current Time">
        <p className="text-muted-foreground mb-4">
          Set current time to input and picker:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  currentTime: {
    updateInput: true,
    locales: 'en-US',
    time: new Date()
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Type} title="Custom Labels">
        <p className="text-muted-foreground mb-4">Customize all text labels:</p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  amLabel: 'AM',
  pmLabel: 'PM',
  okLabel: 'Confirm',
  cancelLabel: 'Close',
  timeLabel: 'Choose Time',
  hourMobileLabel: 'Hour',
  minuteMobileLabel: 'Minute',
  mobileTimeLabel: 'Enter Time'
});`}
          language="typescript"
        />
      </Section>

      <div className="mt-12 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">
          Complete Example
        </h2>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  // Display
  theme: 'dark',
  clockType: '24h',
  animation: true,
  backdrop: true,
  
  // Behavior
  focusTrap: true,
  editable: false,
  mobile: false,
  enableScrollbar: false,
  switchToMinutesAfterSelectHour: true,
  
  // Labels
  okLabel: 'Confirm',
  cancelLabel: 'Close',
  timeLabel: 'Choose Time',
  
  // Increments
  incrementHours: 1,
  incrementMinutes: 5,
  
  // Restrictions
  disabledTime: {
    hours: [0, 1, 2, 3],
    interval: '12:00 PM - 1:00 PM'
  },
  
  // Current time
  currentTime: {
    updateInput: true,
    time: new Date()
  },
  
  // Custom ID
  id: 'my-timepicker',
  
  // Custom class
  cssClass: 'custom-picker'
});`}
          language="typescript"
        />
      </div>
    </div>
  );
}
