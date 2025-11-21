"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import type { TimepickerEventData } from "@/components/examples/types";
import { Zap } from "lucide-react";

export default function EventsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Event Handling
        </h1>
        <p className="text-lg text-muted-foreground">
          Handle timepicker events using EventEmitter API or callbacks
        </p>
      </div>

      <Section icon={Zap} title="EventEmitter API (Recommended)">
        <p className="text-muted-foreground mb-4">
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

picker.on('select:am', (data) => {
  console.log('AM selected');
});

picker.on('select:pm', (data) => {
  console.log('PM selected');
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

      <Section icon={Zap} title="Callback Options">
        <p className="text-muted-foreground mb-4">
          You can also use callback options (check console):
        </p>
        <TimepickerExample
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
    onSelectAM: (data) => {
      console.log('AM selected:', data);
    },
    onSelectPM: (data) => {
      console.log('PM selected:', data);
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
              onCancel: (data: TimepickerEventData) =>
                console.log("Cancelled:", data),
              onUpdate: (data: TimepickerEventData) =>
                console.log("Updated:", data),
              onSelectHour: (data: TimepickerEventData) =>
                console.log("Hour selected:", data.hour),
              onSelectMinute: (data: TimepickerEventData) =>
                console.log("Minute selected:", data.minutes),
              onSelectAM: (data: TimepickerEventData) =>
                console.log("AM selected:", data),
              onSelectPM: (data: TimepickerEventData) =>
                console.log("PM selected:", data),
              onError: (data: TimepickerEventData) =>
                console.error("Error:", data.error),
            },
          }}
        />
      </Section>

      <Section icon={Zap} title="Legacy DOM Events (Removed in v4.0.0)">
        <p className="text-muted-foreground mb-4">
          DOM events have been removed in v4.0.0. Use EventEmitter API or callback options instead:
        </p>
        <CodeBlock
          code={`// ❌ Removed in v4.0.0 - No longer supported
input.addEventListener('timepicker:confirm', (e) => {
  console.log(e.detail);
});

// ✅ Use EventEmitter API
picker.on('confirm', (data) => {
  console.log(data);
});

// ✅ Or use callback options
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

      <Section icon={Zap} title="TypeScript Event Types">
        <p className="text-muted-foreground mb-4">
          Event data interface for TypeScript:
        </p>
        <CodeBlock
          code={`interface CallbackData {
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
}

type EventHandler<T> = (data: T) => void;

const picker = new TimepickerUI(input);
picker.on('confirm', (data: CallbackData) => {
  console.log(data.hour, data.minutes);
});`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
