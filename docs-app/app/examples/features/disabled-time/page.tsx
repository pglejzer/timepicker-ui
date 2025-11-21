"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Ban } from "lucide-react";

export default function DisabledTimePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Disabled Time
        </h1>
        <p className="text-lg text-muted-foreground">
          Restrict specific hours, minutes, or time ranges
        </p>
      </div>

      <Section icon={Ban} title="Disabled Hours">
        <p className="text-muted-foreground mb-4">
          Disable specific hours from selection:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      hours: [1, 3, 5, 8, 10, 12]
    }
  }
});
picker.create();`}
          options={{
            clock: {
              disabledTime: {
                hours: [1, 3, 5, 8, 10, 12],
              },
            },
          }}
        />
      </Section>

      <Section icon={Ban} title="Disabled Minutes">
        <p className="text-muted-foreground mb-4">
          Disable specific minutes from selection:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    disabledTime: {
      minutes: [15, 30, 45]
    }
  }
});
picker.create();`}
          options={{
            clock: {
              disabledTime: {
                minutes: [15, 30, 45],
              },
            },
          }}
        />
      </Section>

      <Section icon={Ban} title="Time Range Interval">
        <p className="text-muted-foreground mb-4">
          Disable a time range (hours and minutes keys are ignored when interval
          is set):
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      interval: '10:00 AM - 2:00 PM'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              disabledTime: {
                interval: "10:00 AM - 2:00 PM",
              },
            },
          }}
        />
      </Section>

      <Section icon={Ban} title="Multiple Time Ranges">
        <p className="text-muted-foreground mb-4">
          Disable multiple time ranges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      interval: [
        '9:00 AM - 11:00 AM',
        '1:00 PM - 3:00 PM',
        '5:00 PM - 7:00 PM'
      ]
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              disabledTime: {
                interval: [
                  "9:00 AM - 11:00 AM",
                  "1:00 PM - 3:00 PM",
                  "5:00 PM - 7:00 PM",
                ],
              },
            },
          }}
        />
      </Section>

      <Section icon={Ban} title="24h Format with Range">
        <p className="text-muted-foreground mb-4">
          Disable time range in 24h format:
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
    </div>
  );
}
