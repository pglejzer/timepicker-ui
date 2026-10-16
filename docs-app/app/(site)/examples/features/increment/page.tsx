"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function IncrementPage() {
  return (
    <div>
      <PageHeader
        title="Increment Steps"
        description="Control hour and minute increment steps"
      />

      <Section title="Increment Minutes">
        <p>Jump by 5 minutes:</p>
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

      <Section title="Increment by 15 Minutes">
        <p>
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

      <Section title="Increment Hours">
        <p>Jump by 2 hours:</p>
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

      <Section title="Combined Increments">
        <p>
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

      <Section title="With 24h Format">
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
