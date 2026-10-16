"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function Format12hPage() {
  return (
    <div>
      <PageHeader
        title="12h Format"
        description="Examples using 12-hour clock format with AM/PM"
      />

      <Section title="Default 12h Format">
        <p>
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

      <Section title="Custom AM/PM Labels">
        <p>
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

      <Section title="With Current Time">
        <p>
          Initialize with current time in 12h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    defaultTime: 'now'
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              defaultTime: "now",
            },
          }}
        />
      </Section>

      <Section title="Disabled Hours (12h)">
        <p>
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

      <Section title="Time Range Restriction">
        <p>
          Disable time ranges in 12h format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      ranges: '10:00 AM - 2:00 PM'
    }
  }
});
picker.create();`}
          options={{
            clock: {
              type: "12h",
              disabledTime: {
                ranges: "10:00 AM - 2:00 PM",
              },
            },
          }}
        />
      </Section>

      <Section title="Auto-switch to Minutes">
        <p>
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
