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

      <Section icon={Ban} title="Dynamic DisabledTime Update">
        <p className="text-muted-foreground mb-4">
          Update disabled times dynamically using the update() method:
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
picker.update({
  options: {
    clock: {
      disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] }
    }
  },
  create: true
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

      <Section icon={Ban} title="Dynamic Interval Update">
        <p className="text-muted-foreground mb-4">
          Update disabled intervals dynamically for shift scheduling or business
          rules:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: { interval: '09:00 - 12:00' }
  }
});
picker.create();

// Update to different interval
picker.update({
  options: {
    clock: {
      disabledTime: { interval: '14:00 - 18:00' }
    }
  },
  create: true
});

// Update to multiple intervals
picker.update({
  options: {
    clock: {
      disabledTime: {
        interval: ['00:00 - 08:00', '12:00 - 13:00', '18:00 - 23:59']
      }
    }
  },
  create: true
});

// Switch from interval to hours
picker.update({
  options: {
    clock: {
      disabledTime: { hours: [20, 21, 22, 23] }
    }
  },
  create: true
});`}
          options={{
            clock: {
              type: "24h",
              disabledTime: {
                interval: "09:00 - 12:00",
              },
            },
          }}
        />
      </Section>
    </div>
  );
}
