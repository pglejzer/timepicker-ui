"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function DisabledTimePage() {
  return (
    <div>
      <PageHeader
        title="Disabled Time"
        description="Restrict specific hours, minutes, or time ranges"
      />

      <Section title="Disabled Hours">
        <p>
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

      <Section title="Disabled Minutes">
        <p>
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

      <Section title="Time Range">
        <p>
          Disable a time range with <code>disabledTime.ranges</code> (the
          hours, minutes and seconds lists are ignored when ranges is set):
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

      <Section title="Multiple Time Ranges">
        <p>
          Disable multiple time ranges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      ranges: [
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
                ranges: [
                  "9:00 AM - 11:00 AM",
                  "1:00 PM - 3:00 PM",
                  "5:00 PM - 7:00 PM",
                ],
              },
            },
          }}
        />
      </Section>

      <Section title="24h Format with Range">
        <p>
          Disable time range in 24h format:
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

      <Section title="Dynamic DisabledTime Update">
        <p>
          Update disabled times at runtime with the setOptions() method:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: { hours: [9, 10, 11, 12] }
  }
});
picker.create();

// Later, update disabled times
picker.setOptions({
  clock: {
    disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
  }
});`}
          options={{
            clock: {
              type: "24h",
              disabledTime: {
                hours: [9, 10, 11, 12],
              },
            },
          }}
        />
      </Section>

      <Section title="Dynamic Range Update">
        <p>
          Update disabled ranges at runtime for shift scheduling or business
          rules:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: { ranges: '09:00 - 12:00' }
  }
});
picker.create();

// Update to a different range
picker.setOptions({
  clock: {
    disabledTime: { ranges: '14:00 - 18:00' }
  }
});

// Update to multiple ranges
picker.setOptions({
  clock: {
    disabledTime: {
      ranges: ['00:00 - 08:00', '12:00 - 13:00', '18:00 - 23:59']
    }
  }
});

// Switch from ranges to hours
picker.setOptions({
  clock: {
    disabledTime: { hours: [20, 21, 22, 23] }
  }
});`}
          options={{
            clock: {
              type: "24h",
              disabledTime: {
                ranges: "09:00 - 12:00",
              },
            },
          }}
        />
      </Section>
    </div>
  );
}
