import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Code2, FileCode, Package } from "lucide-react";

export const metadata = {
  title: "TypeScript - Timepicker-UI",
  description: "TypeScript types and interfaces reference",
};

const mainInterfaces = [
  {
    name: "OptionTypes",
    description: "Configuration options for TimepickerUI instance",
    code: `interface OptionTypes {
  amLabel?: string;
  animation?: boolean;
  appendModalSelector?: string;
  backdrop?: boolean;
  cancelLabel?: string;
  clockType?: '12h' | '24h';
  cssClass?: string;
  currentTime?: boolean | CurrentTimeConfig;
  delayHandler?: number;
  disabledTime?: DisabledTimeConfig;
  editable?: boolean;
  enableScrollbar?: boolean;
  enableSwitchIcon?: boolean;
  focusInputAfterCloseModal?: boolean;
  focusTrap?: boolean;
  hourMobileLabel?: string;
  iconTemplate?: string;
  iconTemplateMobile?: string;
  id?: string;
  incrementHours?: number;
  incrementMinutes?: number;
  inline?: InlineConfig;
  minuteMobileLabel?: string;
  mobile?: boolean;
  mobileTimeLabel?: string;
  okLabel?: string;
  pmLabel?: string;
  autoSwitchToMinutes?: boolean;
  theme?: Theme;
  timeLabel?: string;
  
  // Callbacks
  onOpen?: (data: CallbackData) => void;
  onCancel?: (data: CallbackData) => void;
  onConfirm?: (data: CallbackData) => void;
  onUpdate?: (data: CallbackData) => void;
  onSelectHour?: (data: CallbackData) => void;
  onSelectMinute?: (data: CallbackData) => void;
  onSelectAM?: (data: CallbackData) => void;
  onSelectPM?: (data: CallbackData) => void;
  onError?: (data: CallbackData) => void;
}`,
  },
  {
    name: "CallbackData",
    description: "Data passed to callback functions",
    code: `interface CallbackData {
  hour?: string | null;
  minutes?: string | null;
  type?: string | null;
  degreesHours?: number | null;
  degreesMinutes?: number | null;
  hourNotAccepted?: string | null;
  minutesNotAccepted?: string | null;
  eventType?: any;
  error?: string;
  currentHour?: string | number;
  currentMin?: string | number;
  currentType?: string;
  currentLength?: string | number;
}`,
  },
  {
    name: "InlineConfig",
    description: "Configuration for inline mode",
    code: `interface InlineConfig {
  enabled: boolean;
  containerId: string;
  showButtons?: boolean;
  autoUpdate?: boolean;
}`,
  },
  {
    name: "DisabledTimeConfig",
    description: "Configuration for disabled time ranges",
    code: `interface DisabledTimeConfig {
  hours?: Array<string | number>;
  minutes?: Array<string | number>;
  interval?: string | string[];
}`,
  },
  {
    name: "CurrentTimeConfig",
    description: "Configuration for current time initialization",
    code: `interface CurrentTimeConfig {
  time?: Date;
  updateInput?: boolean;
  locales?: string | string[];
  preventClockType?: boolean;
}`,
  },
];

const typeAliases = [
  {
    name: "Theme",
    description: "Available theme names",
    code: `type Theme = 
  | 'basic'
  | 'crane'
  | 'crane-straight'
  | 'm3-green'
  | 'm2'
  | 'dark'
  | 'glassmorphic'
  | 'pastel'
  | 'ai'
  | 'cyberpunk'
  | 'custom';`,
  },
  {
    name: "ClockType",
    description: "Clock format types",
    code: `type ClockType = '12h' | '24h';`,
  },
];

export default function TypeScriptPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          TypeScript
        </h1>
        <p className="text-lg text-muted-foreground">
          Full TypeScript support with type definitions
        </p>
      </div>

      <Section icon={Package} title="Installation">
        <p className="text-muted-foreground mb-4">
          TypeScript definitions are included with the package:
        </p>
        <CodeBlock
          code={`npm install timepicker-ui

// Types are automatically available
import { TimepickerUI } from 'timepicker-ui';
import type { OptionTypes, CallbackData } from 'timepicker-ui';`}
          language="typescript"
        />
      </Section>

      <Section icon={Code2} title="Main Interfaces">
        <div className="space-y-8">
          {mainInterfaces.map((item) => (
            <div key={item.name} className="group relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative rounded-xl border border-border bg-card p-6 transition-all group-hover:border-primary/30">
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  <code className="text-primary">{item.name}</code>
                </h3>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <CodeBlock code={item.code} language="typescript" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={FileCode} title="Type Aliases">
        <div className="space-y-6">
          {typeAliases.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                <code className="text-primary">{item.name}</code>
              </h3>
              <p className="text-muted-foreground mb-4">{item.description}</p>
              <CodeBlock code={item.code} language="typescript" />
            </div>
          ))}
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Usage Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Basic TypeScript Usage
            </h3>
            <CodeBlock
              code={`import { TimepickerUI } from 'timepicker-ui';
import type { OptionTypes, CallbackData } from 'timepicker-ui';

const options: OptionTypes = {
  theme: 'dark',
  clockType: '24h',
  onConfirm: (data: CallbackData) => {
    console.log(\`Time: \${data.hour}:\${data.minutes}\`);
  }
};

const input = document.querySelector<HTMLInputElement>('#timepicker');
if (input) {
  const picker = new TimepickerUI(input, options);
  picker.create();
}`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              React with TypeScript
            </h3>
            <CodeBlock
              code={`import { useEffect, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';
import type { OptionTypes } from 'timepicker-ui';

interface TimePickerProps {
  onTimeSelect?: (time: string) => void;
  theme?: 'basic' | 'dark' | 'cyberpunk';
}

export function TimePicker({ onTimeSelect, theme = 'basic' }: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const options: OptionTypes = {
      theme,
      onConfirm: (data) => {
        if (onTimeSelect && data.hour && data.minutes) {
          const time = \`\${data.hour}:\${data.minutes}\`;
          onTimeSelect(time);
        }
      }
    };

    const picker = new TimepickerUI(inputRef.current, options);
    picker.create();

    return () => picker.destroy();
  }, [theme, onTimeSelect]);

  return <input ref={inputRef} type="text" placeholder="Select time" />;
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Error Handling
            </h3>
            <CodeBlock
              code={`import type { CallbackData } from 'timepicker-ui';
import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#timepicker', {
  onError: (data: CallbackData) => {
    if (data.error) {
      console.error('Timepicker error:', data.error);
      alert(\`Invalid time format: \${data.error}\`);
    }
  },
  onConfirm: (data: CallbackData) => {
    console.log('Time confirmed:', \`\${data.hour}:\${data.minutes}\`);
  }
});`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Extending Types
            </h3>
            <CodeBlock
              code={`import type { OptionTypes, CallbackData } from 'timepicker-ui';
import { TimepickerUI } from 'timepicker-ui';

// Extend options with custom properties
interface CustomTimepickerOptions extends OptionTypes {
  customProperty?: string;
  analyticsEnabled?: boolean;
}

// Create wrapper with custom logic
class CustomTimepicker {
  private picker: TimepickerUI;
  private analyticsEnabled: boolean;

  constructor(
    input: HTMLInputElement,
    options: CustomTimepickerOptions
  ) {
    this.analyticsEnabled = options.analyticsEnabled ?? false;
    
    const pickerOptions: OptionTypes = {
      ...options,
      onConfirm: (data: CallbackData) => {
        if (this.analyticsEnabled) {
          this.trackEvent('time_confirmed', data);
        }
        options.onConfirm?.(data);
      }
    };

    this.picker = new TimepickerUI(input, pickerOptions);
  }

  private trackEvent(event: string, data: CallbackData) {
    console.log('Analytics:', event, data);
  }

  create() {
    this.picker.create();
  }

  destroy() {
    this.picker.destroy();
  }
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <InfoBox title="IntelliSense Support" variant="blue">
        All options and methods have full IntelliSense support in VS Code and
        other TypeScript-aware editors. Hover over any property to see its
        documentation.
      </InfoBox>
    </div>
  );
}
