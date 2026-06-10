import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Bell, Zap, Database, AlertCircle, X } from "lucide-react";
import { Section } from "@/components/section";

export const metadata = {
  title: "Events",
  description:
    "Events reference for timepicker-ui - subscribe to open, confirm, cancel, clear and selection events via on/once/off on the zero-dependency time picker.",
  alternates: {
    canonical: "/docs/api/events",
  },
};

const eventEmitterMethods = [
  {
    name: "on(event, handler)",
    description:
      "Subscribe to an event. Handler is called every time the event fires.",
    code: `const picker = new TimepickerUI(input);
picker.create();

picker.on('confirm', (data) => {
  console.log('Time confirmed:', data);
});`,
  },
  {
    name: "once(event, handler)",
    description: "Subscribe to an event that fires only once.",
    code: `picker.once('open', () => {
  console.log('Opened for the first time');
});`,
  },
  {
    name: "off(event, handler)",
    description: "Unsubscribe from an event.",
    code: `const handler = (data) => console.log(data);
picker.on('confirm', handler);
picker.off('confirm', handler);`,
  },
];

const availableEvents = [
  {
    name: "confirm",
    description: "Triggered when user confirms time selection.",
    code: `picker.on('confirm', (data) => {
  console.log('Hour:', data.hour);
  console.log('Minutes:', data.minutes);
  console.log('Type:', data.type); // 'AM' or 'PM' (12h mode)
  console.log('Auto commit:', data.autoCommit);
  // autoCommit is true when the confirm was triggered
  // by wheel.commitOnScroll instead of the OK button
});`,
  },
  {
    name: "cancel",
    description:
      "Triggered when user cancels or closes picker. The payload is empty.",
    code: `picker.on('cancel', () => {
  console.log('Cancelled');
});`,
  },
  {
    name: "open",
    description: "Triggered when picker opens.",
    code: `picker.on('open', (data) => {
  console.log('Picker opened');
  console.log(data.hour, data.minutes, data.type);
  console.log(data.degreesHours, data.degreesMinutes);
});`,
  },
  {
    name: "show",
    description: "Triggered when the modal becomes visible. Empty payload.",
    code: `picker.on('show', () => {
  console.log('Modal shown');
});`,
  },
  {
    name: "hide",
    description: "Triggered when the modal is hidden. Empty payload.",
    code: `picker.on('hide', () => {
  console.log('Modal hidden');
});`,
  },
  {
    name: "update",
    description: "Triggered when time value changes during interaction.",
    code: `picker.on('update', (data) => {
  console.log('Time updated:', data.hour, data.minutes);
  console.log('Type:', data.type); // 'AM' or 'PM' (12h mode)
});`,
  },
  {
    name: "select:hour",
    description: "Triggered when hour is selected.",
    code: `picker.on('select:hour', (data) => {
  console.log('Hour selected:', data.hour);
});`,
  },
  {
    name: "select:minute",
    description: "Triggered when minute is selected.",
    code: `picker.on('select:minute', (data) => {
  console.log('Minute selected:', data.minutes);
});`,
  },
  {
    name: "select:am",
    description: "Triggered when AM is selected (12h mode only).",
    code: `picker.on('select:am', (data) => {
  console.log('AM selected');
});`,
  },
  {
    name: "select:pm",
    description: "Triggered when PM is selected (12h mode only).",
    code: `picker.on('select:pm', (data) => {
  console.log('PM selected');
});`,
  },
  {
    name: "switch:view",
    description:
      "Triggered when switching between clock and keyboard view. Empty payload.",
    code: `picker.on('switch:view', () => {
  console.log('View switched');
});`,
  },
  {
    name: "error",
    description: "Triggered when validation error occurs.",
    code: `picker.on('error', (data) => {
  console.error('Error:', data.error);
  console.log('Rejected:', data.rejectedHour, data.rejectedMinute);
  console.log('Input values:', data.inputHour, data.inputMinute);
  console.log('Input type/length:', data.inputType, data.inputLength);
});`,
  },
  {
    name: "clear",
    description: "Triggered when user clicks the clear button.",
    code: `picker.on('clear', (data) => {
  console.log('Time cleared. Previous value:', data.previousValue);
});`,
  },
  {
    name: "timezone:change",
    description:
      "Triggered when the timezone is changed (timezone plugin only).",
    code: `picker.on('timezone:change', (data) => {
  console.log('Timezone:', data.timezone);
});`,
  },
  {
    name: "range:confirm",
    description: "Triggered when a time range is confirmed (range mode only).",
    code: `picker.on('range:confirm', (data) => {
  console.log('From:', data.from, 'To:', data.to);
  console.log('Duration (minutes):', data.duration);
});`,
  },
  {
    name: "range:switch",
    description:
      "Triggered when switching between the from/to segments (range mode only).",
    code: `picker.on('range:switch', (data) => {
  console.log('Active segment:', data.active); // 'from' | 'to'
  console.log('Disabled time:', data.disabledTime);
});`,
  },
  {
    name: "range:validation",
    description:
      "Triggered when the range duration is validated (range mode only).",
    code: `picker.on('range:validation', (data) => {
  console.log('Valid:', data.valid, 'Duration:', data.duration);
  console.log('Limits:', data.minDuration, data.maxDuration);
});`,
  },
  {
    name: "animation:clock / animation:start / animation:end",
    description:
      "Animation coordination events fired around open/close and clock transitions. Empty payloads.",
    code: `picker.on('animation:start', () => console.log('Animation started'));
picker.on('animation:end', () => console.log('Animation finished'));
picker.on('animation:clock', () => console.log('Clock animation'));`,
  },
  {
    name: "wheel:scroll:start",
    description:
      "Triggered when a wheel column starts scrolling (wheel mode only).",
    code: `picker.on('wheel:scroll:start', (data) => {
  console.log('Scroll started on column:', data.column);
  // data.column: 'hours' | 'minutes' | 'ampm'
});`,
  },
  {
    name: "wheel:scroll:end",
    description:
      "Triggered when a wheel column finishes scrolling and snaps to a value (wheel mode only).",
    code: `picker.on('wheel:scroll:end', (data) => {
  console.log('Column:', data.column, 'snapped to:', data.value);
  console.log('Previous value:', data.previousValue);
  // data.column: 'hours' | 'minutes' | 'ampm'
});`,
  },
];

const callbacks = [
  {
    name: "onConfirm",
    description: "Alternative: pass callback in options.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => {
      console.log('Confirmed:', data);
    }
  }
});`,
  },
  {
    name: "onCancel",
    description: "Triggered when user cancels.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onCancel: (data) => {
      console.log('Cancelled');
    }
  }
});`,
  },
  {
    name: "onOpen",
    description: "Triggered when picker opens.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onOpen: () => {
      console.log('Opened');
    }
  }
});`,
  },
  {
    name: "onUpdate",
    description: "Triggered during time changes.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      console.log('Updated:', data);
    }
  }
});`,
  },
  {
    name: "onSelectHour",
    description: "Triggered when hour is selected.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onSelectHour: (data) => {
      console.log('Hour:', data.hour);
    }
  }
});`,
  },
  {
    name: "onSelectMinute",
    description: "Triggered when minute is selected.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onSelectMinute: (data) => {
      console.log('Minute:', data.minutes);
    }
  }
});`,
  },
  {
    name: "onSelectAM",
    description: "Triggered when AM is selected.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onSelectAM: () => {
      console.log('AM selected');
    }
  }
});`,
  },
  {
    name: "onSelectPM",
    description: "Triggered when PM is selected.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onSelectPM: () => {
      console.log('PM selected');
    }
  }
});`,
  },
  {
    name: "onError",
    description: "Triggered on validation error.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onError: (data) => {
      console.error('Error:', data.error);
    }
  }
});`,
  },
  {
    name: "onTimezoneChange",
    description: "Triggered when timezone is changed (timezone plugin only).",
    code: `new TimepickerUI(input, {
  callbacks: {
    onTimezoneChange: (data) => {
      console.log('Timezone:', data.timezone);
    }
  }
});`,
  },
  {
    name: "onRangeConfirm",
    description: "Triggered when a range is confirmed (range mode only).",
    code: `new TimepickerUI(input, {
  callbacks: {
    onRangeConfirm: (data) => {
      console.log('Range:', data.from, '-', data.to, data.duration);
    }
  }
});`,
  },
  {
    name: "onRangeSwitch",
    description:
      "Triggered when switching between from/to segments (range mode only).",
    code: `new TimepickerUI(input, {
  callbacks: {
    onRangeSwitch: (data) => {
      console.log('Active segment:', data.active);
    }
  }
});`,
  },
  {
    name: "onRangeValidation",
    description: "Triggered on range validation (range mode only).",
    code: `new TimepickerUI(input, {
  callbacks: {
    onRangeValidation: (data) => {
      console.log('Valid:', data.valid, 'Duration:', data.duration);
    }
  }
});`,
  },
  {
    name: "onClear",
    description: "Triggered when user clicks the clear button.",
    code: `new TimepickerUI(input, {
  callbacks: {
    onClear: (data) => {
      console.log('Cleared:', data.previousValue);
    }
  }
});`,
  },
];

export default function EventsPage() {
  return (
    <div>
      <PageHeader
        title="Events"
        description="Handle timepicker events using EventEmitter API or callbacks"
        eyebrow="API"
      />

      <Section icon={Zap} title="EventEmitter API (Recommended)">
        <p className="text-muted-foreground mb-6">
          The new EventEmitter API provides a clean, type-safe way to handle
          events:
        </p>
        <div className="space-y-8">
          {eventEmitterMethods.map((method) => (
            <div key={method.name}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                <code className="text-primary">{method.name}</code>
              </h3>
              <p className="text-muted-foreground mb-4">{method.description}</p>
              <CodeBlock code={method.code} language="typescript" />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Bell} title="Available Events">
        <p className="text-muted-foreground mb-6">
          All events you can subscribe to. These events work in both{" "}
          <strong>clock</strong> (default) and <strong>wheel</strong> mode. A
          few additional events (<code className="text-sm">range:get-disabled-time</code>,{" "}
          <code className="text-sm">range:update-disabled</code>,{" "}
          <code className="text-sm">range:minute:commit</code>) are internal
          coordination events and not part of the public contract.
        </p>
        <div className="space-y-8">
          {availableEvents.map((event) => (
            <div key={event.name}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                <code className="text-primary">{event.name}</code>
              </h3>
              <p className="text-muted-foreground mb-4">{event.description}</p>
              <CodeBlock code={event.code} language="typescript" />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Bell} title="Callback Options (Alternative)">
        <p className="text-muted-foreground mb-6">
          You can also use callback options in the constructor:
        </p>
        <div className="space-y-8">
          {callbacks.map((callback) => (
            <div key={callback.name}>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                <code className="text-primary">{callback.name}</code>
              </h3>
              <p className="text-muted-foreground mb-4">
                {callback.description}
              </p>
              <CodeBlock code={callback.code} language="typescript" />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={AlertCircle} title="Legacy DOM Events (Removed)">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 mb-6">
          <p className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold mb-2">
            <X className="h-4 w-4" />
            Removed in v4.0.0
          </p>
          <p className="text-muted-foreground mb-4">
            DOM events (e.g.,{" "}
            <code className="text-sm">timepicker:confirm</code>) have been
            removed in v4.0.0. If you&apos;re upgrading from v3.x, you must migrate
            to the EventEmitter API.
          </p>
          <p className="text-muted-foreground">
            The EventEmitter API provides better type safety, error handling,
            and performance.
          </p>
        </div>
        <CodeBlock
          code={`// REMOVED in v4.0.0
input.addEventListener('timepicker:confirm', (e) => {
  console.log(e.detail);
});

// CORRECT - use the EventEmitter API instead
picker.on('confirm', (data) => {
  console.log(data);
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Database} title="Event Data">
        <p className="text-muted-foreground mb-4">
          Every event has its own payload type, exported from{" "}
          <code className="text-sm">timepicker-ui</code>. The most important
          ones:
        </p>
        <CodeBlock
          code={`type OpenEventData = {
  hour: string;
  minutes: string;
  type?: string;                 // 'AM' or 'PM' (12h mode)
  degreesHours: number | null;
  degreesMinutes: number | null;
};

type ConfirmEventData = {
  hour?: string;
  minutes?: string;
  type?: string;
  autoCommit?: boolean;          // true when triggered by wheel.commitOnScroll
};

type UpdateEventData = {
  hour?: string;
  minutes?: string;
  type?: string;
};

type CancelEventData = Record<string, never>;  // empty payload

type ClearEventData = {
  previousValue: string | null;
};

type ErrorEventData = {
  error: string;
  rejectedHour?: string;
  rejectedMinute?: string;
  inputHour?: string | number;
  inputMinute?: string | number;
  inputType?: string;
  inputLength?: string | number;
};

// Also exported: SelectHourEventData, SelectMinuteEventData,
// SelectAMEventData, SelectPMEventData, ShowEventData, HideEventData,
// SwitchViewEventData, TimezoneChangeEventData, RangeConfirmEventData,
// RangeSwitchEventData, RangeValidationEventData,
// WheelScrollStartEventData, WheelScrollEndEventData`}
          language="typescript"
        />
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Complete Example
        </h2>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'dark' },
  clock: { type: '12h' }
});
picker.create();

// EventEmitter API (recommended)
picker.on('confirm', (data) => {
  console.log('Time confirmed:', data.hour, data.minutes, data.type);
  fetch('/api/save-time', {
    method: 'POST',
    body: JSON.stringify(data)
  });
});

picker.on('cancel', () => {
  console.log('User cancelled');
});

picker.on('update', (data) => {
  document.getElementById('display').textContent = 
    \`\${data.hour}:\${data.minutes} \${data.type || ''}\`;
});

picker.on('select:hour', (data) => {
  console.log('Hour selected:', data.hour);
});

picker.on('select:minute', (data) => {
  console.log('Minute selected:', data.minutes);
});

picker.on('error', (data) => {
  console.error('Validation error:', data.error);
});

// One-time event
picker.once('open', () => {
  console.log('Picker opened for the first time');
});

// Remove event listener
const updateHandler = (data) => console.log(data);
picker.on('update', updateHandler);
picker.off('update', updateHandler);`}
          language="typescript"
        />
      </section>
    </div>
  );
}
