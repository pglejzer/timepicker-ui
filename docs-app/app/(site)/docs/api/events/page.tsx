import type { ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Bell, Zap, Database, AlertCircle, X } from "lucide-react";
import { Section } from "@/components/section";

export const metadata = buildMetadata({
  title: "Events",
  description:
    "Events reference for timepicker-ui - subscribe to open, confirm, cancel, clear and selection events via on/once/off on the zero-dependency time picker.",
  path: "/docs/api/events",
});

type DocEntry = {
  name: string;
  description: ReactNode;
  code: string;
};

const eventEmitterMethods: DocEntry[] = [
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
    name: "off(event, handler?)",
    description:
      "Unsubscribe from an event. Without a handler, every handler for that event is removed.",
    code: `const handler = (data) => console.log(data);
picker.on('confirm', handler);
picker.off('confirm', handler);`,
  },
];

const availableEvents: DocEntry[] = [
  {
    name: "confirm",
    description: "Triggered when user confirms time selection.",
    code: `picker.on('confirm', (data) => {
  console.log('Hour:', data.hour);
  console.log('Minutes:', data.minutes);
  console.log('Seconds:', data.seconds); // only with clock.showSeconds
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
    description: (
      <>
        Triggered when the picker opens: its markup has been added to the page
        and filled with the input&apos;s value. Fires for user activation and
        for <code>open()</code>.
      </>
    ),
    code: `picker.on('open', (data) => {
  console.log('Picker opened');
  console.log(data.hour, data.minutes, data.type);
  console.log(data.seconds); // only with clock.showSeconds
  // data.degreesHours and data.degreesMinutes are deprecated
});`,
  },
  {
    name: "show",
    description: (
      <>
        Triggered when the user asks to open the picker: a click on the input
        or a{" "}
        <Link
          href="/examples/features/open-from-button"
          className="text-primary underline"
        >
          <code>data-open</code> element
        </Link>
        , or Enter or Space on it. Empty
        payload. Your handler (<code>on(&apos;show&apos;)</code> or{" "}
        <code>callbacks.onShow</code>) runs before the picker renders, so{" "}
        <code>.tp-ui-modal</code> does not exist yet inside it.{" "}
        <code>open</code> fires after the picker is rendered.{" "}
        <code>picker.open()</code> does not emit <code>show</code>. It renders
        the picker and emits <code>open</code>.
      </>
    ),
    code: `picker.on('show', () => {
  console.log('User asked to open the picker');
  // The picker is not rendered yet; use 'open' to reach its markup
});`,
  },
  {
    name: "hide",
    description: (
      <>
        <span className="font-medium text-foreground">Deprecated.</span> Never
        emitted. The event and <code>HideEventData</code> will be removed in
        5.0.
      </>
    ),
    code: `// Do not use: 'hide' is never emitted.`,
  },
  {
    name: "update",
    description: "Triggered when time value changes during interaction.",
    code: `picker.on('update', (data) => {
  console.log('Time updated:', data.hour, data.minutes);
  console.log('Seconds:', data.seconds); // only with clock.showSeconds
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
    name: "select:second",
    description: (
      <>
        Triggered when the seconds field or face is selected, and when the
        seconds wheel column stops on a value. Needs{" "}
        <code>clock.showSeconds</code>. New in 4.5.0.
      </>
    ),
    code: `picker.on('select:second', (data) => {
  console.log('Seconds selected:', data.seconds);
});`,
  },
  {
    name: "select:period",
    description: (
      <>
        Triggered when AM or PM is selected (12h mode only). The payload is{" "}
        <code>{"{ type: 'AM' | 'PM' }"}</code>. New in 4.5.0.
      </>
    ),
    code: `picker.on('select:period', (data) => {
  console.log('Period selected:', data.type); // 'AM' or 'PM'
});`,
  },
  {
    name: "select:am / select:pm",
    description: (
      <>
        <span className="font-medium text-foreground">Deprecated.</span> Use{" "}
        <code>select:period</code>. Both still fire next to{" "}
        <code>select:period</code> and will be removed in 5.0.
      </>
    ),
    code: `// Deprecated: listen to 'select:period' instead
picker.on('select:period', (data) => {
  if (data.type === 'AM') console.log('AM selected');
});`,
  },
  {
    name: "switch:face",
    description: (
      <>
        Triggered when the clock face switches between hours, minutes and
        seconds: a click on a field, Enter or Space on it, or the automatic
        switch after a pick. Clicking the field that is already active does
        not trigger it.
        The payload is{" "}
        <code>{"{ face: 'hours' | 'minutes' | 'seconds' }"}</code>. Use it to
        follow face changes: in 5.0, <code>select:hour</code>,{" "}
        <code>select:minute</code> and <code>select:second</code> fire only
        when a value is picked. New in 4.5.0.
      </>
    ),
    code: `picker.on('switch:face', (data) => {
  console.log('Face shown:', data.face); // 'hours' | 'minutes' | 'seconds'
});`,
  },
  {
    name: "switch:view",
    description: (
      <>
        Triggered when the switch icon toggles between the clock and keyboard
        view. Needs <code>ui.viewSwitch</code>. Empty payload.
      </>
    ),
    code: `picker.on('switch:view', () => {
  console.log('View switched');
});`,
  },
  {
    name: "error",
    description: (
      <>
        Triggered on an invalid input value, on a <code>setValue()</code>{" "}
        string that is not a time, on invalid options (for example a
        malformed <code>clock.disabledTime.ranges</code>) and when a needed
        plugin is not registered. <code>rejectedHour</code> and{" "}
        <code>rejectedMinute</code> are deprecated and always{" "}
        <code>undefined</code>.
      </>
    ),
    code: `picker.on('error', (data) => {
  console.error('Error:', data.error);
  console.log('Input values:', data.inputHour, data.inputMinute);
  console.log('Input seconds:', data.inputSecond); // only with clock.showSeconds
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
  console.log('Duration (whole minutes):', data.duration);
  console.log('Duration (seconds):', data.durationSeconds); // only with clock.showSeconds
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
  console.log('Duration (seconds):', data.durationSeconds); // only with clock.showSeconds
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
      "Triggered when a wheel column starts scrolling (wheel and compact-wheel modes).",
    code: `picker.on('wheel:scroll:start', (data) => {
  console.log('Scroll started on column:', data.column);
  // data.column: 'hours' | 'minutes' | 'seconds' | 'ampm'
});`,
  },
  {
    name: "wheel:scroll:end",
    description:
      "Triggered when a wheel column finishes scrolling and snaps to a value (wheel and compact-wheel modes).",
    code: `picker.on('wheel:scroll:end', (data) => {
  console.log('Column:', data.column, 'snapped to:', data.value);
  console.log('Previous value:', data.previousValue);
  // data.column: 'hours' | 'minutes' | 'seconds' | 'ampm'
});`,
  },
];

const callbacks: DocEntry[] = [
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
    name: "onShow",
    description: (
      <>
        Triggered when the user asks to open the picker. See the{" "}
        <code>show</code> event above. New in 4.5.0.
      </>
    ),
    code: `new TimepickerUI(input, {
  callbacks: {
    onShow: () => {
      console.log('User asked to open the picker');
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
    name: "onSelectSecond",
    description: (
      <>
        Triggered when the seconds field or face is selected. Needs{" "}
        <code>clock.showSeconds</code>. New in 4.5.0.
      </>
    ),
    code: `new TimepickerUI(input, {
  clock: { showSeconds: true },
  callbacks: {
    onSelectSecond: (data) => {
      console.log('Seconds:', data.seconds);
    }
  }
});`,
  },
  {
    name: "onSelectPeriod",
    description: (
      <>
        Triggered when AM or PM is selected. See the{" "}
        <code>select:period</code> event above. New in 4.5.0.
      </>
    ),
    code: `new TimepickerUI(input, {
  callbacks: {
    onSelectPeriod: (data) => {
      console.log('Period:', data.type); // 'AM' or 'PM'
    }
  }
});`,
  },
  {
    name: "onSelectAM / onSelectPM",
    description: (
      <>
        <span className="font-medium text-foreground">Deprecated.</span> Use{" "}
        <code>onSelectPeriod</code>. Both still work and will be removed in
        5.0.
      </>
    ),
    code: `// Deprecated: use onSelectPeriod instead
new TimepickerUI(input, {
  callbacks: {
    onSelectPeriod: (data) => {
      if (data.type === 'PM') console.log('PM selected');
    }
  }
});`,
  },
  {
    name: "onSwitchFace",
    description: (
      <>
        Triggered when the clock face switches between hours, minutes and
        seconds. See the <code>switch:face</code> event above. New in 4.5.0.
      </>
    ),
    code: `new TimepickerUI(input, {
  callbacks: {
    onSwitchFace: (data) => {
      console.log('Face:', data.face);
    }
  }
});`,
  },
  {
    name: "onSwitchView",
    description: (
      <>
        Triggered when the switch icon toggles the view. Needs{" "}
        <code>ui.viewSwitch</code>. New in 4.5.0.
      </>
    ),
    code: `new TimepickerUI(input, {
  ui: { viewSwitch: true },
  callbacks: {
    onSwitchView: () => {
      console.log('View switched');
    }
  }
});`,
  },
  {
    name: "onError",
    description:
      "Triggered on an invalid input value, a setValue() string that is not a time, invalid options or a missing plugin.",
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
    name: "onWheelScrollStart / onWheelScrollEnd",
    description:
      "Triggered when a wheel column starts scrolling and when it snaps to a value (wheel and compact-wheel modes). New in 4.5.0.",
    code: `new TimepickerUI(input, {
  ui: { mode: 'wheel' },  // needs the wheel plugin
  callbacks: {
    onWheelScrollStart: (data) => {
      console.log('Scrolling:', data.column);
    },
    onWheelScrollEnd: (data) => {
      console.log(data.column, 'snapped to', data.value);
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
          <strong>clock</strong> (default) and <strong>wheel</strong> mode.{" "}
          <code className="text-sm">range:minute:commit</code> is an internal
          event between the clock and the range plugin and is not part of the
          public contract. With <code className="text-sm">showSeconds</code> its
          payload also has <code className="text-sm">seconds</code>.{" "}
          <code className="text-sm">range:get-disabled-time</code> and{" "}
          <code className="text-sm">range:update-disabled</code> are deprecated,
          never emitted, and will be removed in 5.0.
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
          <code className="text-sm">timepicker-ui</code>. Fields marked{" "}
          <code className="text-sm">showSeconds</code> appear only when{" "}
          <code className="text-sm">clock.showSeconds</code> is on. The most
          important ones:
        </p>
        <CodeBlock
          code={`type OpenEventData = {
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

type SelectSecondEventData = {
  seconds: string;
};

type SelectPeriodEventData = {
  type: 'AM' | 'PM';
};

type SwitchFaceEventData = {
  face: 'hours' | 'minutes' | 'seconds';
};

type CancelEventData = Record<string, never>;  // empty payload

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
  durationSeconds?: number;      // showSeconds, exact
};

// Also exported: SelectHourEventData, SelectMinuteEventData,
// SelectAMEventData and SelectPMEventData (deprecated), ShowEventData,
// HideEventData (deprecated), SwitchViewEventData,
// TimezoneChangeEventData, RangeSwitchEventData,
// RangeValidationEventData, WheelScrollStartEventData,
// WheelScrollEndEventData`}
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
