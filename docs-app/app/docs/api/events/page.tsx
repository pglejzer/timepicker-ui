import { CodeBlock } from "@/components/code-block";
import { Bell, Zap, Database, AlertCircle } from "lucide-react";
import { Section } from "@/components/section";

export const metadata = {
  title: "Events - Timepicker-UI",
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
});`,
  },
  {
    name: "cancel",
    description: "Triggered when user cancels or closes picker.",
    code: `picker.on('cancel', (data) => {
  console.log('Cancelled');
  console.log('Not accepted:', data.hourNotAccepted, data.minutesNotAccepted);
});`,
  },
  {
    name: "open",
    description: "Triggered when picker opens.",
    code: `picker.on('open', () => {
  console.log('Picker opened');
});`,
  },
  {
    name: "update",
    description: "Triggered when time value changes during interaction.",
    code: `picker.on('update', (data) => {
  console.log('Time updated:', data.hour, data.minutes);
  console.log('Degrees:', data.degreesHours, data.degreesMinutes);
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
    name: "error",
    description: "Triggered when validation error occurs.",
    code: `picker.on('error', (data) => {
  console.error('Error:', data.error);
  console.log('Current values:', data.currentHour, data.currentMin);
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
});`,
  },
  {
    name: "onSelectMinute",
    description: "Triggered when minute is selected.",
    code: `new TimepickerUI(input, {
  onSelectMinute: (data) => {
    console.log('Minute:', data.minutes);
  }
});`,
  },
  {
    name: "onSelectAM",
    description: "Triggered when AM is selected.",
    code: `new TimepickerUI(input, {
  onSelectAM: (data) => {
    console.log('AM selected');
  }
});`,
  },
  {
    name: "onSelectPM",
    description: "Triggered when PM is selected.",
    code: `new TimepickerUI(input, {
  onSelectPM: (data) => {
    console.log('PM selected');
  }
});`,
  },
  {
    name: "onError",
    description: "Triggered on validation error.",
    code: `new TimepickerUI(input, {
  onError: (data) => {
    console.error('Error:', data.error);
  }
});`,
  },
];

export default function EventsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Events
        </h1>
        <p className="text-lg text-muted-foreground">
          Handle timepicker events using EventEmitter API or callbacks
        </p>
      </div>

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
          All events you can subscribe to:
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
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
            ❌ Removed in v4.0.0
          </p>
          <p className="text-muted-foreground mb-4">
            DOM events (e.g.,{" "}
            <code className="text-sm">timepicker:confirm</code>) have been
            removed in v4.0.0. If you're upgrading from v3.x, you must migrate
            to the EventEmitter API.
          </p>
          <p className="text-muted-foreground">
            The EventEmitter API provides better type safety, error handling,
            and performance.
          </p>
        </div>
        <CodeBlock
          code={`// ❌ No longer works in v4.0.0
input.addEventListener('timepicker:confirm', (e) => {
  console.log(e.detail);
});

// ✅ Use EventEmitter API instead
picker.on('confirm', (data) => {
  console.log(data);
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Database} title="Event Data">
        <p className="text-muted-foreground mb-4">
          Event callbacks receive data object with the following structure:
        </p>
        <CodeBlock
          code={`interface CallbackData {
  hour?: string | null;
  minutes?: string | null;
  type?: string | null;          // 'AM' or 'PM' (12h mode)
  degreesHours?: number | null;
  degreesMinutes?: number | null;
  hourNotAccepted?: string | null;     // For cancel events
  minutesNotAccepted?: string | null;  // For cancel events
  eventType?: any;               // Mouse/touch event type
  error?: string;                // Error message
  currentHour?: string | number;
  currentMin?: string | number;
  currentType?: string;
  currentLength?: string | number;
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

picker.on('cancel', (data) => {
  console.log('User cancelled');
  console.log('Not accepted:', data.hourNotAccepted, data.minutesNotAccepted);
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
