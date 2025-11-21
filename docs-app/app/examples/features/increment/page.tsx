"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { FastForward } from "lucide-react";

export default function IncrementPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Increment Steps
        </h1>
        <p className="text-lg text-muted-foreground">
          Control hour and minute increment steps
        </p>
      </div>

      <Section icon={FastForward} title="Increment Minutes">
        <p className="text-muted-foreground mb-4">Jump by 5 minutes:</p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { incrementMinutes: 5 }
});
picker.create();`}
          options={{
            clock: { incrementMinutes: 5 },
          }}
        />
      </Section>

      <Section icon={FastForward} title="Increment by 15 Minutes">
        <p className="text-muted-foreground mb-4">
          Larger steps for faster selection:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { incrementMinutes: 15 }
});
picker.create();`}
          options={{
            clock: { incrementMinutes: 15 },
          }}
        />
      </Section>

      <Section icon={FastForward} title="Increment Hours">
        <p className="text-muted-foreground mb-4">Jump by 2 hours:</p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { incrementHours: 2 }
});
picker.create();`}
          options={{
            clock: { incrementHours: 2 },
          }}
        />
      </Section>

      <Section icon={FastForward} title="Combined Increments">
        <p className="text-muted-foreground mb-4">
          Increment both hours and minutes:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    incrementHours: 2,
    incrementMinutes: 10
  }
});
picker.create();`}
          options={{
            clock: {
              incrementHours: 2,
              incrementMinutes: 10,
            },
          }}
        />
      </Section>

      <Section icon={FastForward} title="With 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    incrementHours: 3,
    incrementMinutes: 15
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              incrementHours: 3,
              incrementMinutes: 15,
            },
          }}
        />
      </Section>
    </div>
  );
}
