"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import type { TimepickerEventData } from "@/components/examples/types";
import { Filter, Zap } from "lucide-react";
import { InfoBox } from "@/components/info-box";

export default function EventSelectiveUpdatePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Event-Selective onUpdate
        </h1>
        <p className="text-lg text-muted-foreground">
          Filter which events trigger the onUpdate callback (v4.0.3+)
        </p>
      </div>

      <InfoBox title="What is updateOn?" variant="blue" className="mb-6">
        By default, <code>onUpdate</code> triggers on all time changes (every
        hour/minute selection). Use <code>updateOn</code> to filter and trigger
        only on specific events like confirm/cancel.
      </InfoBox>

      <Section icon={Zap} title="Default Behavior (All Events)">
        <p className="text-muted-foreground mb-4">
          Without <code>updateOn</code>, the callback triggers on every
          interaction:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      console.log('Updated:', data);
      // Triggers on: hour selection, minute selection, AM/PM change
    }
  }
});
picker.create();`}
          options={{
            callbacks: {
              onUpdate: (data: TimepickerEventData) =>
                console.log("Updated (all events):", data),
            },
          }}
        />
      </Section>

      <Section icon={Filter} title="Trigger Only on Confirm/Cancel">
        <p className="text-muted-foreground mb-4">
          Only trigger when user confirms or cancels (check console):
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      console.log('Confirmed or cancelled:', data);
    },
    updateOn: ['confirm', 'cancel']
  }
});
picker.create();`}
          options={{
            callbacks: {
              onUpdate: (data: TimepickerEventData) =>
                console.log("Updated (confirm/cancel only):", data),
            },
            updateOn: ["confirm", "cancel"],
          }}
        />
      </Section>

      <Section icon={Filter} title="Trigger Only on Hour/Minute Selection">
        <p className="text-muted-foreground mb-4">
          Only trigger when hour or minute is selected:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      console.log('Hour or minute selected:', data);
    },
    updateOn: ['select:hour', 'select:minute']
  }
});
picker.create();`}
          options={{
            callbacks: {
              onUpdate: (data: TimepickerEventData) =>
                console.log("Updated (hour/minute only):", data),
            },
            updateOn: ["select:hour", "select:minute"],
          }}
        />
      </Section>

      <Section icon={Filter} title="Trigger on Open Event">
        <p className="text-muted-foreground mb-4">
          Trigger when timepicker opens:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      console.log('Picker opened:', data);
    },
    updateOn: ['open']
  }
});
picker.create();`}
          options={{
            callbacks: {
              onUpdate: (data: TimepickerEventData) =>
                console.log("Updated (open only):", data),
            },
            updateOn: ["open"],
          }}
        />
      </Section>

      <Section icon={Zap} title="Available Events">
        <p className="text-muted-foreground mb-4">
          You can filter on any of these events:
        </p>
        <CodeBlock
          code={`// Available event names for updateOn:
type UpdateOnEvents = 
  | 'confirm'      // User clicks OK button
  | 'cancel'       // User clicks Cancel or Esc
  | 'open'         // Timepicker opens
  | 'select:hour'  // Hour is selected
  | 'select:minute' // Minute is selected
  | 'select:am'    // AM is selected
  | 'select:pm';   // PM is selected

const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => console.log(data),
    updateOn: ['confirm', 'cancel', 'select:hour']
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Zap} title="Use Cases">
        <div className="space-y-4 text-muted-foreground">
          <div>
            <h3 className="text-foreground font-semibold mb-2">
              1. Form Validation on Confirm Only
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      // Validate and submit form only when user confirms
      validateTimeField(data.hour, data.minutes);
    },
    updateOn: ['confirm']
  }
});`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-2">
              2. Real-Time Preview on Selection
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      // Update preview while user selects time
      updatePreview(data.hour, data.minutes);
    },
    updateOn: ['select:hour', 'select:minute', 'select:am', 'select:pm']
  }
});`}
              language="javascript"
            />
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-2">
              3. Track User Actions
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  callbacks: {
    onUpdate: (data) => {
      // Analytics: track when users open or confirm
      analytics.track('timepicker_action', data);
    },
    updateOn: ['open', 'confirm', 'cancel']
  }
});`}
              language="javascript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Zap} title="TypeScript Support">
        <p className="text-muted-foreground mb-4">
          Full type safety with TypeScript:
        </p>
        <CodeBlock
          code={`import type { TimepickerOptions, CallbacksOptions } from 'timepicker-ui';

const options: TimepickerOptions = {
  callbacks: {
    onUpdate: (data) => {
      // data is fully typed as UpdateEventData
      console.log(data.hour, data.minutes, data.type);
    },
    updateOn: ['confirm', 'cancel'] // Auto-complete available
  }
};

const picker = new TimepickerUI(input, options);`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
