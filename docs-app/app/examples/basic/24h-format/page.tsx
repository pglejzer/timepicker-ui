"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Clock } from "lucide-react";

export default function Format24hPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          24h Format
        </h1>
        <p className="text-lg text-muted-foreground">
          Examples using 24-hour clock format (military time)
        </p>
      </div>

      <Section icon={Clock} title="Basic 24h Format">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={Clock} title="With Current Time">
        <p className="text-muted-foreground mb-4">
          Initialize with current time in 24h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    currentTime: {
      updateInput: true,
      time: new Date(),
      locales: 'en-GB'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              currentTime: {
                updateInput: true,
                time: new Date(),
                locales: "en-GB",
              },
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="Disabled Hours (24h)">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={Clock} title="Time Range Restriction">
        <p className="text-muted-foreground mb-4">
          Disable time ranges in 24h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      interval: '00:00 - 08:00'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              disabledTime: {
                interval: "00:00 - 08:00",
              },
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="With Hour Increments">
        <p className="text-muted-foreground mb-4">
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
