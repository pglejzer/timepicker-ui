"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Clock } from "lucide-react";

export default function Format12hPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          12h Format
        </h1>
        <p className="text-lg text-muted-foreground">
          Examples using 12-hour clock format with AM/PM
        </p>
      </div>

      <Section icon={Clock} title="Default 12h Format">
        <p className="text-muted-foreground mb-4">
          The 12h format is enabled by default:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '12h' } // This is the default
});
picker.create();`}
          options={{
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Clock} title="Custom AM/PM Labels">
        <p className="text-muted-foreground mb-4">
          Customize AM and PM labels for different languages or preferences:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  labels: {
    am: 'AM',
    pm: 'PM'
  }
});
picker.create();`}
          options={{
            clock: { type: "12h" },
            labels: {
              am: "AM",
              pm: "PM",
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="With Current Time">
        <p className="text-muted-foreground mb-4">
          Initialize with current time in 12h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    currentTime: {
      updateInput: true,
      time: new Date(),
      locales: 'en-US'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              currentTime: {
                updateInput: true,
                time: new Date(),
                locales: "en-US",
              },
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="Disabled Hours (12h)">
        <p className="text-muted-foreground mb-4">
          Disable specific hours in 12h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      hours: [1, 2, 3, 11, 12]
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              disabledTime: {
                hours: [1, 2, 3, 11, 12],
              },
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="Time Range Restriction">
        <p className="text-muted-foreground mb-4">
          Disable time ranges in 12h format:
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

      <Section icon={Clock} title="Auto-switch to Minutes">
        <p className="text-muted-foreground mb-4">
          Automatically switch to minutes after selecting hour:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    autoSwitchToMinutes: true
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              autoSwitchToMinutes: true,
            },
          }}
        />
      </Section>
    </div>
  );
}
