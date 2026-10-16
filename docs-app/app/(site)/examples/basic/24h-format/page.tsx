"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function Format24hPage() {
  return (
    <div>
      <PageHeader
        title="24h Format"
        description="Examples using 24-hour clock format (military time)"
      />

      <Section title="Basic 24h Format">
        <p>
          Enable 24-hour format (no AM/PM):
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            clock: { type: "24h" },
          }}
        />
      </Section>

      <Section title="With Current Time">
        <p>
          Initialize with current time in 24h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    defaultTime: 'now'
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              defaultTime: "now",
            },
          }}
        />
      </Section>

      <Section title="Disabled Hours (24h)">
        <p>
          Disable specific hours in 24h format (0-23):
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [0, 1, 2, 3, 22, 23]
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              disabledTime: {
                hours: [0, 1, 2, 3, 22, 23],
              },
            },
          }}
        />
      </Section>

      <Section title="Time Range Restriction">
        <p>
          Disable time ranges in 24h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      ranges: '00:00 - 08:00'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              disabledTime: {
                ranges: "00:00 - 08:00",
              },
            },
          }}
        />
      </Section>

      <Section title="With Hour Increments">
        <p>
          Set hour increments in 24h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    incrementHours: 2,
    incrementMinutes: 15
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              incrementHours: 2,
              incrementMinutes: 15,
            },
          }}
        />
      </Section>
    </div>
  );
}
