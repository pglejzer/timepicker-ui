"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import type { TimepickerEventData } from "@/components/examples/types";

export default function EventsPage() {
  return (
    <div>
      <PageHeader
        title="Event Handling"
        description="Handle timepicker events using EventEmitter API or callbacks"
      />

      <Section title="EventEmitter API (Recommended)">
        <p>
          The new EventEmitter API provides a clean, type-safe way to handle
          events:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input);
picker.create();

picker.on('confirm', (data) => {
  console.log('Time confirmed:', data.hour, data.minutes);
});

picker.on('cancel', (data) => {
  console.log('Cancelled');
});

picker.on('open', () => {
  console.log('Picker opened');
});

picker.on('update', (data) => {
  console.log('Time updated:', data);
});

picker.on('select:hour', (data) => {
  console.log('Hour selected:', data.hour);
});

picker.on('select:minute', (data) => {
  console.log('Minute selected:', data.minutes);
});

picker.on('select:period', (data) => {
  console.log('Period selected:', data.type);
});

picker.once('confirm', (data) => {
  console.log('This runs only once');
});

const handler = (data) => console.log(data);
picker.on('confirm', handler);
picker.off('confirm', handler);`}
          language="javascript"
        />
      </Section>

      <Section title="Callback Options">
        <p>
          You can also use callback options (check console):
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onOpen: (data) => {
      console.log('Opened:', data);
    },
    onConfirm: (data) => {
      console.log('Confirmed:', data.hour, data.minutes, data.type);
    },
    onCancel: (data) => {
      console.log('Cancelled:', data);
    },
    onUpdate: (data) => {
      console.log('Updated:', data);
    },
    onSelectHour: (data) => {
      console.log('Hour selected:', data.hour);
    },
    onSelectMinute: (data) => {
      console.log('Minute selected:', data.minutes);
    },
    onSelectPeriod: (data) => {
      console.log('Period selected:', data.type);
    },
    onError: (data) => {
      console.error('Error:', data.error);
    }
  }
});
picker.create();`}
          options={{
            callbacks: {
              onOpen: (data: TimepickerEventData) =>
                console.log("Opened:", data),
              onConfirm: (data: TimepickerEventData) =>
                console.log("Confirmed:", data.hour, data.minutes, data.type),
              onCancel: (data: TimepickerEventData) =>
                console.log("Cancelled:", data),
              onUpdate: (data: TimepickerEventData) =>
                console.log("Updated:", data),
              onSelectHour: (data: TimepickerEventData) =>
                console.log("Hour selected:", data.hour),
              onSelectMinute: (data: TimepickerEventData) =>
                console.log("Minute selected:", data.minutes),
              onSelectPeriod: (data: TimepickerEventData) =>
                console.log("Period selected:", data.type),
              onError: (data: TimepickerEventData) =>
                console.error("Error:", data.error),
            },
          }}
        />
      </Section>

      <Section title="Legacy DOM Events (Removed in v4.0.0)">
        <p>
          DOM events have been removed in v4.0.0. Use EventEmitter API or callback options instead:
        </p>
        <CodeBlock
          code={`// REMOVED in v4.0.0 - No longer supported
input.addEventListener('timepicker:confirm', (e) => {
  console.log(e.detail);
});

// CORRECT - use the EventEmitter API
picker.on('confirm', (data) => {
  console.log(data);
});

// CORRECT - or use callback options
const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => {
      console.log(data);
    }
  }
});`}
          language="javascript"
        />
      </Section>

      <Section title="TypeScript Event Types">
        <p>
          Payload types are exported from timepicker-ui, and{" "}
          <code>on()</code> infers them from the event name:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';
import type { ConfirmEventData, ErrorEventData } from 'timepicker-ui';

// ConfirmEventData:
// {
//   hour?: string;
//   minutes?: string;
//   seconds?: string;      // only with clock.showSeconds
//   type?: string;         // 'AM' or 'PM' in 12h mode
//   autoCommit?: boolean;  // true when wheel.commitOnScroll confirmed it
// }

const picker = new TimepickerUI(input);
picker.create();

// data is typed from the event name
picker.on('confirm', (data) => {
  console.log(data.hour, data.minutes, data.type);
});

// or name the payload type yourself
const handleError = (data: ErrorEventData) => {
  console.error(data.error);
};
picker.on('error', handleError);

const handleConfirm = (data: ConfirmEventData) => {
  console.log(data.hour, data.minutes);
};
picker.on('confirm', handleConfirm);`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
