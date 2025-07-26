import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { Settings, Tag, Layout, Lock, Clock } from "lucide-react";

export const metadata = {
  title: "Configuration - Timepicker-UI",
};

const options = [
  {
    name: "clockType",
    type: "12h | 24h",
    default: "12h",
    description: "Clock format",
  },
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
    description: "Show backdrop overlay",
  },
  {
    name: "editable",
    type: "boolean",
    default: "false",
    description: "Allow manual input",
  },
  {
    name: "focusTrap",
    type: "boolean",
    default: "true",
    description: "Trap focus in modal",
  },
  {
    name: "enableScrollbar",
    type: "boolean",
    default: "false",
    description: "Keep page scrollable",
  },
  {
    name: "mobile",
    type: "boolean",
    default: "false",
    description: "Force mobile mode",
  },
];

export default function ConfigurationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Configuration
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete list of configuration options
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
                  <td className="px-4 py-3 text-muted-foreground">
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
      </Section>

      <Section icon={Tag} title="Labels">
        <CodeBlock
          code={`{
  amLabel: 'AM',
  pmLabel: 'PM',
  okLabel: 'OK',
  cancelLabel: 'CANCEL',
  timeLabel: 'Select Time',
  hourMobileLabel: 'Hour',
  minuteMobileLabel: 'Minute'
}`}
          language="typescript"
        />
      </Section>

      <Section icon={Layout} title="Inline Mode">
        <CodeBlock
          code={`{
  inline: {
    enabled: true,
    containerId: 'timepicker-container',
    autoUpdate: true,
    showButtons: false
  }
}`}
          language="typescript"
        />
      </Section>

      <Section icon={Lock} title="Disabled Time">
        <p className="text-muted-foreground mb-4">
          Disable specific hours, minutes, or time ranges:
        </p>
        <CodeBlock
          code={`{
  disabledTime: {
    hours: [1, 3, 5, 23],
    minutes: [15, 30, 45],
    interval: ['10:00 AM - 2:00 PM', '5:00 PM - 8:00 PM']
  }
}`}
          language="typescript"
        />
      </Section>

      <Section icon={Clock} title="Current Time">
        <CodeBlock
          code={`{
  currentTime: {
    updateInput: true,
    locales: 'en-US',
    time: new Date()
  }
}`}
          language="typescript"
        />
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Complete Example
        </h2>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  clockType: '24h',
  theme: 'dark',
  animation: true,
  backdrop: true,
  focusTrap: true,
  editable: false,
  mobile: false,
  enableScrollbar: false,
  
  okLabel: 'Confirm',
  cancelLabel: 'Close',
  timeLabel: 'Choose Time',
  
  incrementHours: 1,
  incrementMinutes: 5,
  
  disabledTime: {
    hours: [0, 1, 2, 3],
    interval: ['12:00 PM - 1:00 PM']
  },
  
  onConfirm: (data) => console.log(data),
  onCancel: () => console.log('cancelled'),
  onUpdate: (data) => console.log('updated:', data)
});`}
          language="typescript"
        />
      </section>
    </div>
  );
}
