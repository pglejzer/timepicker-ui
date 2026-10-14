import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Code2, FileCode, Package, Archive } from "lucide-react";

export const metadata = buildMetadata({
  title: "TypeScript",
  description:
    "TypeScript reference for timepicker-ui - first-class types and interfaces for options, values and events in the zero-dependency, framework-agnostic time picker.",
  path: "/docs/api/typescript",
});

const mainInterfaces = [
  {
    name: "TimepickerOptions",
    description:
      "The grouped options object (v4.0.0+). Each group has its own exported interface: ClockOptions, UIOptions, LabelsOptions, BehaviorOptions, CallbacksOptions, TimezoneOptions, RangeOptions, WheelOptions and the deprecated ClearBehaviorOptions.",
    code: `interface TimepickerOptions {
  clock?: ClockOptions;          // type, increments, showSeconds, disabledTime, defaultTime, ...
  ui?: UIOptions;                // theme, mode, animation, backdrop, inline, clearButton, ...
  labels?: LabelsOptions;        // all UI text and accessibility labels
  behavior?: BehaviorOptions;    // focusTrap, returnFocus, delayHandler, id
  callbacks?: CallbacksOptions;  // onConfirm, onCancel, onOpen, onUpdate, ...
  timezone?: TimezoneOptions;    // timezone plugin config
  range?: RangeOptions;          // range plugin config
  wheel?: WheelOptions;          // wheel / compact-wheel mode config
  clearBehavior?: ClearBehaviorOptions; // deprecated, use ui.clearButton
}

// All group interfaces are exported:
import type {
  TimepickerOptions,
  ClockOptions,
  UIOptions,
  LabelsOptions,
  BehaviorOptions,
  CallbacksOptions,
  TimezoneOptions,
  RangeOptions,
  WheelOptions,
  ClearBehaviorOptions,
} from 'timepicker-ui';`,
  },
  {
    name: "Event data types",
    description:
      "Each event/callback has its own payload type. All of them are exported from 'timepicker-ui'. Fields marked showSeconds are present only when clock.showSeconds is on.",
    code: `type OpenEventData = {
  hour: string;
  minutes: string;
  seconds?: string;              // showSeconds
  type?: string;                 // 'AM' or 'PM' (12h mode)
  degreesHours: number | null;   // deprecated, removed in 5.0
  degreesMinutes: number | null; // deprecated, removed in 5.0
};

type ConfirmEventData = {
  hour?: string;
  minutes?: string;
  seconds?: string;              // showSeconds
  type?: string;
  autoCommit?: boolean;          // true when triggered by wheel.commitOnScroll
};

type UpdateEventData = {
  hour?: string;
  minutes?: string;
  seconds?: string;              // showSeconds
  type?: string;
};

type SelectSecondEventData = {   // payload of 'select:second'
  seconds: string;
};

type SelectPeriodEventData = {   // payload of 'select:period'
  type: 'AM' | 'PM';
};

type SwitchFaceEventData = {     // payload of 'switch:face'
  face: 'hours' | 'minutes' | 'seconds';
};

type CancelEventData = Record<string, never>;   // empty payload

type ClearEventData = {
  previousValue: string | null;
};

type ErrorEventData = {
  error: string;
  rejectedHour?: string;         // deprecated, always undefined
  rejectedMinute?: string;       // deprecated, always undefined
  inputHour?: string | number;
  inputMinute?: string | number;
  inputSecond?: string | number; // showSeconds
  inputType?: string;
  inputLength?: string | number;
};

type RangeConfirmEventData = {
  from: string;
  to: string;
  duration: number;              // whole minutes
  durationSeconds?: number;      // showSeconds, exact length in seconds
};

type RangeValidationEventData = {
  valid: boolean;
  duration: number;              // whole minutes
  durationSeconds?: number;      // showSeconds, exact length in seconds
  minDuration?: number;
  maxDuration?: number;
};

type WheelScrollEndEventData = {
  column: 'hours' | 'minutes' | 'seconds' | 'ampm';
  value: string;
  previousValue: string | null;
};

// Also exported: SelectHourEventData, SelectMinuteEventData,
// SelectAMEventData and SelectPMEventData (deprecated), ShowEventData,
// HideEventData (deprecated), SwitchViewEventData,
// TimezoneChangeEventData, RangeSwitchEventData,
// WheelScrollStartEventData`,
  },
  {
    name: "TimepickerEventMap",
    description:
      "Maps every event name to its payload type. picker.on / once / off are typed against this map, so handlers get the correct payload type automatically.",
    code: `import type { TimepickerEventMap } from 'timepicker-ui';

interface TimepickerEventMap {
  open: OpenEventData;
  cancel: CancelEventData;
  confirm: ConfirmEventData;
  clear: ClearEventData;
  show: ShowEventData;
  hide: HideEventData;           // deprecated, never emitted
  update: UpdateEventData;
  'select:hour': SelectHourEventData;
  'select:minute': SelectMinuteEventData;
  'select:second': SelectSecondEventData;
  'select:period': SelectPeriodEventData;
  'select:am': SelectAMEventData;   // deprecated, use 'select:period'
  'select:pm': SelectPMEventData;   // deprecated, use 'select:period'
  'switch:face': SwitchFaceEventData;
  'switch:view': SwitchViewEventData;
  'timezone:change': TimezoneChangeEventData;
  'range:confirm': RangeConfirmEventData;
  'range:switch': RangeSwitchEventData;
  'range:validation': RangeValidationEventData;
  'wheel:scroll:start': WheelScrollStartEventData;
  'wheel:scroll:end': WheelScrollEndEventData;
  error: ErrorEventData;
  // ...plus internal animation/range coordination events
}`,
  },
  {
    name: "getValue() return shape",
    description:
      "The object returned by picker.getValue(). seconds is present only with clock.showSeconds, and time then includes it.",
    code: `{
  hour: string;
  minutes: string;
  seconds?: string;              // showSeconds
  type?: string;                 // 'AM' or 'PM' (12h mode)
  time: string;                  // '14:30', '02:30 PM', '14:30:15', '02:30:15 PM'
  degreesHours: number | null;   // deprecated, removed in 5.0
  degreesMinutes: number | null; // deprecated, removed in 5.0
}`,
  },
  {
    name: "Inline mode shape (ui.inline)",
    description:
      "Inline configuration shape, defined inline on UIOptions (not a separately exported type):",
    code: `ui: {
  inline?: {
    enabled: boolean;
    container?: string | HTMLElement; // required when enabled is true
    containerId?: string;             // deprecated, use container
    showButtons?: boolean;
    autoUpdate?: boolean;
  };
}`,
  },
  {
    name: "Disabled time shape (clock.disabledTime)",
    description:
      "Disabled time configuration shape, defined inline on ClockOptions. When ranges is set, the hours, minutes and seconds lists are ignored.",
    code: `clock: {
  disabledTime?: {
    hours?: Array<string | number>;
    minutes?: Array<string | number>;
    seconds?: Array<string | number>; // used with showSeconds
    ranges?: string | string[];       // e.g. "10:00 AM - 12:00 PM", "10:00:30 AM - 10:05 AM"
    interval?: string | string[];     // deprecated, use ranges
  };
}`,
  },
  {
    name: "Default time shape (clock.defaultTime)",
    description:
      "Default time configuration shape, defined inline on ClockOptions. 'now' also writes the time to the input. The object form writes it only with updateInput: true.",
    code: `clock: {
  defaultTime?:
    | 'now'
    | {
        time?: Date | 'now';
        updateInput?: boolean;
      };
}`,
  },
];

const typeAliases = [
  {
    name: "ui.theme",
    description:
      "Available theme names. The union is defined inline on UIOptions (the library does not export a separate Theme alias).",
    code: `theme?:
  | 'basic'
  | 'crane'
  | 'crane-straight'
  | 'm2'
  | 'm3-green'
  | 'dark'
  | 'glassmorphic'
  | 'pastel'
  | 'ai'
  | 'cyberpunk'
  | 'blueprint'
  | 'blueprint-dark';`,
  },
  {
    name: "clock.type",
    description:
      "Clock format, defined inline on ClockOptions (no exported ClockType alias).",
    code: `type?: '12h' | '24h' | 'auto';   // 'auto' follows the browser locale`,
  },
  {
    name: "clock.incrementSeconds",
    description: "Seconds step, defined inline on ClockOptions.",
    code: `incrementSeconds?: 1 | 5 | 10 | 15 | 20 | 30;`,
  },
];

const deprecatedItems = [
  {
    name: "Option names renamed in 4.5.0, e.g. UIOptions.mobile, LabelsOptions.hourLabel",
    note: "Use the new names. The Options page lists every pair under Renamed in 4.5.0.",
  },
  {
    name: "ClearBehaviorOptions and the clearBehavior group",
    note: "Use ui.clearButton: { clearInput }.",
  },
  {
    name: "SelectAMEventData, SelectPMEventData, 'select:am', 'select:pm'",
    note: "Use SelectPeriodEventData and 'select:period'.",
  },
  {
    name: "CallbacksOptions.onSelectAM / onSelectPM",
    note: "Use onSelectPeriod.",
  },
  {
    name: "TimepickerUI.update()",
    note: "Use setOptions(options).",
  },
  {
    name: "OptionTypes",
    note: "Use TimepickerOptions.",
  },
  {
    name: "HideEventData and the 'hide' event",
    note: "Never emitted.",
  },
  {
    name: "OpenEventData.degreesHours / degreesMinutes",
    note: "Internal clock-hand angles. Use hour and minutes.",
  },
  {
    name: "getValue().degreesHours / degreesMinutes",
    note: "Internal clock-hand angles. Use hour and minutes.",
  },
  {
    name: "ErrorEventData.rejectedHour / rejectedMinute",
    note: "Always undefined.",
  },
  {
    name: "ClockOptions.currentTime.locales",
    note: "Has no effect. The library formats the value.",
  },
  {
    name: "LabelsOptions.format24Label",
    note: "Has no effect.",
  },
  {
    name: "LabelsOptions.toggleLabel",
    note: "Has no effect. The view switch is labelled by switchToKeyboard and switchToClock.",
  },
  {
    name: "LabelsOptions.timezoneSelectorLabel",
    note: "Has no effect. Use labels.timezone.",
  },
  {
    name: "'range:get-disabled-time' and 'range:update-disabled' events",
    note: "Never emitted or read.",
  },
];

export default function TypeScriptPage() {
  return (
    <div>
      <PageHeader
        title="TypeScript"
        description="Full TypeScript support with type definitions"
        eyebrow="API"
      />

      <Section icon={Package} title="Installation">
        <p className="text-muted-foreground mb-4">
          TypeScript definitions are included with the package:
        </p>
        <CodeBlock
          code={`npm install timepicker-ui

// Types are automatically available
import { TimepickerUI } from 'timepicker-ui';
import type { TimepickerOptions, ConfirmEventData } from 'timepicker-ui';`}
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

      <Section icon={FileCode} title="Inline Unions">
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

      <Section icon={Archive} title="Deprecated Types and Fields">
        <p className="text-muted-foreground mb-4">
          These are marked <code>@deprecated</code> in the type definitions and
          will be removed in 5.0. They still compile, so existing code keeps
          working until then.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Type or field
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deprecatedItems.map((item) => (
                <tr
                  key={item.name}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <code className="text-primary bg-primary/10 px-2 py-1 rounded text-xs font-mono">
                      {item.name}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
import type { TimepickerOptions, ConfirmEventData } from 'timepicker-ui';

const options: TimepickerOptions = {
  ui: { theme: 'dark' },
  clock: { type: '24h' },
  callbacks: {
    onConfirm: (data: ConfirmEventData) => {
      console.log(\`Time: \${data.hour}:\${data.minutes}\`);
    }
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
              Typed Event Subscriptions
            </h3>
            <CodeBlock
              code={`import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#timepicker', {
  clock: { showSeconds: true }
});
picker.create();

// picker.on is typed against TimepickerEventMap -
// the handler payload type is inferred from the event name
picker.on('confirm', (data) => {
  // data: ConfirmEventData
  console.log(data.hour, data.minutes, data.seconds, data.type, data.autoCommit);
});

picker.on('select:second', (data) => {
  // data: SelectSecondEventData
  console.log(data.seconds);
});

picker.on('select:period', (data) => {
  // data: SelectPeriodEventData
  console.log(data.type); // 'AM' | 'PM'
});

picker.on('switch:face', (data) => {
  // data: SwitchFaceEventData
  console.log(data.face); // 'hours' | 'minutes' | 'seconds'
});

picker.on('update', (data) => {
  // data: UpdateEventData
  console.log(data.hour, data.minutes, data.seconds, data.type);
});

picker.on('error', (data) => {
  // data: ErrorEventData
  console.error(data.error, data.inputHour, data.inputMinute, data.inputSecond);
});

picker.once('open', (data) => {
  // data: OpenEventData
  console.log(data.hour, data.minutes, data.seconds);
});`}
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
import type { TimepickerOptions } from 'timepicker-ui';

interface TimePickerProps {
  onTimeSelect?: (time: string) => void;
  theme?: 'basic' | 'dark' | 'cyberpunk';
}

export function TimePicker({ onTimeSelect, theme = 'basic' }: TimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const options: TimepickerOptions = {
      ui: { theme },
      callbacks: {
        onConfirm: (data) => {
          if (onTimeSelect && data.hour && data.minutes) {
            const time = \`\${data.hour}:\${data.minutes}\`;
            onTimeSelect(time);
          }
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
              code={`import type { ConfirmEventData, ErrorEventData } from 'timepicker-ui';
import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#timepicker', {
  callbacks: {
    onError: (data: ErrorEventData) => {
      console.error('Timepicker error:', data.error);
      alert(\`Invalid time format: \${data.error}\`);
    },
    onConfirm: (data: ConfirmEventData) => {
      console.log('Time confirmed:', \`\${data.hour}:\${data.minutes}\`);
    }
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
              code={`import type { TimepickerOptions, ConfirmEventData } from 'timepicker-ui';
import { TimepickerUI } from 'timepicker-ui';

// Extend options with custom properties
interface CustomTimepickerOptions extends TimepickerOptions {
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
    const { analyticsEnabled, ...pickerOptions } = options;
    this.analyticsEnabled = analyticsEnabled ?? false;

    const finalOptions: TimepickerOptions = {
      ...pickerOptions,
      callbacks: {
        ...pickerOptions.callbacks,
        onConfirm: (data: ConfirmEventData) => {
          if (this.analyticsEnabled) {
            this.trackEvent('time_confirmed', data);
          }
          pickerOptions.callbacks?.onConfirm?.(data);
        }
      }
    };

    this.picker = new TimepickerUI(input, finalOptions);
  }

  private trackEvent(event: string, data: ConfirmEventData) {
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
