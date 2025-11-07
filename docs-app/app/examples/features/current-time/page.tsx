"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Clock } from "lucide-react";

export default function CurrentTimePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Current Time
        </h1>
        <p className="text-lg text-muted-foreground">
          Initialize with current time
        </p>
      </div>

      <Section icon={Clock} title="Simple Current Time">
        <p className="text-muted-foreground mb-4">
          Set to true to use current time:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  currentTime: true
});
picker.create();`}
          options={{
            currentTime: true,
          }}
        />
      </Section>

      <Section icon={Clock} title="Update Input with Current Time">
        <p className="text-muted-foreground mb-4">
          Automatically set input value to current time:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  currentTime: {
    updateInput: true,
    time: new Date()
  }
});
picker.create();`}
          options={{
            currentTime: {
              updateInput: true,
              time: new Date(),
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="With Locale">
        <p className="text-muted-foreground mb-4">
          Use specific locale for time formatting:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  currentTime: {
    updateInput: true,
    time: new Date(),
    locales: 'en-US'
  }
});
picker.create();`}
          options={{
            currentTime: {
              updateInput: true,
              time: new Date(),
              locales: "en-US",
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="Prevent Clock Type">
        <p className="text-muted-foreground mb-4">
          Force clock type based on locale:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  currentTime: {
    updateInput: true,
    time: new Date(),
    preventClockType: true
  }
});
picker.create();`}
          options={{
            currentTime: {
              updateInput: true,
              time: new Date(),
              preventClockType: true,
            },
          }}
        />
      </Section>

      <Section icon={Clock} title="Custom Time">
        <p className="text-muted-foreground mb-4">
          Set specific time instead of current:
        </p>
        <TimepickerExample
          code={`const customTime = new Date();
customTime.setHours(14, 30, 0);

const picker = new TimepickerUI(input, {
  currentTime: {
    updateInput: true,
    time: customTime
  }
});
picker.create();`}
          options={{
            currentTime: {
              updateInput: true,
              time: (() => {
                const customTime = new Date();
                customTime.setHours(14, 30, 0);
                return customTime;
              })(),
            },
          }}
        />
      </Section>
    </div>
  );
}
