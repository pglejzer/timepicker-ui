"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function CurrentTimePage() {
  return (
    <div>
      <PageHeader
        title="Current Time"
        description={
          <>
            Start the picker on the current time, or on a time you choose, with{" "}
            <code>clock.defaultTime</code>.
          </>
        }
      />

      <Section title="Simple Current Time">
        <p>
          Set <code>defaultTime</code> to <code>&apos;now&apos;</code> to show
          the current time and write it to the input:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { defaultTime: 'now' }
});
picker.create();`}
          options={{
            clock: { defaultTime: "now" },
          }}
        />
      </Section>

      <Section title="Current Time Without Updating the Input">
        <p>
          With the object form and <code>updateInput: false</code>, the picker
          opens on the current time and the input stays empty until the user
          confirms:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  clock: {
    defaultTime: {
      time: 'now',
      updateInput: false
    }
  }
});
picker.create();`}
          options={{
            clock: {
              defaultTime: {
                time: "now",
                updateInput: false,
              },
            },
          }}
        />
      </Section>

      <Section title="Clock Type from the Locale">
        <p>
          Use <code>clock.type: &apos;auto&apos;</code> to pick 12h or 24h from
          the browser locale:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: 'auto',
    defaultTime: 'now'
  }
});
picker.create();`}
          options={{
            clock: {
              type: "auto",
              defaultTime: "now",
            },
          }}
        />
      </Section>

      <Section title="Custom Time">
        <p>
          Set specific time instead of current:
        </p>
        <TimepickerExample
          code={`const customTime = new Date();
customTime.setHours(14, 30, 0);

const picker = new TimepickerUI(input, {
  clock: {
    defaultTime: {
      time: customTime,
      updateInput: true
    }
  }
});
picker.create();`}
          options={{
            clock: {
              defaultTime: {
                updateInput: true,
                time: (() => {
                  const customTime = new Date();
                  customTime.setHours(14, 30, 0);
                  return customTime;
                })(),
              },
            },
          }}
        />
      </Section>
    </div>
  );
}
