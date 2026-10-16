"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import styles from "./page.module.css";

export default function SmoothHourSnapPage() {
  return (
    <div>
      <PageHeader
        title="Smooth Hour Snap"
        description={
          <>
            Fluid hour dragging with a snap animation on release. Set{" "}
            <code>clock.discreteHourJump</code> to make the hand jump from hour
            to hour instead.
          </>
        }
      />

      <Section title="Smooth Hour Dragging">
        <p>
          Drag the clock hand smoothly between hours (like minutes), with
          animated snap on release:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { discreteHourJump: false } // This is the default
});
picker.create();`}
          options={{
            clock: { discreteHourJump: false },
          }}
        />
      </Section>

      <Section title="With 24h Format">
        <p>
          Works perfectly with 24-hour clock format:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    discreteHourJump: false
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              discreteHourJump: false,
            },
          }}
        />
      </Section>

      <Section title="With Increments">
        <p>
          Combine with hour increments for flexible selection:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: {
    incrementHours: 2,
    discreteHourJump: false
  }
});
picker.create();`}
          options={{
            clock: {
              incrementHours: 2,
              discreteHourJump: false,
            },
          }}
        />
      </Section>

      <Section title="Comparison: Discrete vs Smooth">
        <div className={styles.comparison}>
          <div>
            <h3>
              Discrete
            </h3>
            <p>
              Clock hand jumps directly to each hour
            </p>
            <TimepickerExample
              code={`const picker = new TimepickerUI(input, {
  clock: { discreteHourJump: true }
});
picker.create();`}
              options={{
                clock: { discreteHourJump: true },
              }}
            />
          </div>
          <div>
            <h3>
              Smooth Hour Snap (Default)
            </h3>
            <p>
              Clock hand drags fluidly, snaps on release
            </p>
            <TimepickerExample
              code={`const picker = new TimepickerUI(input, {
  clock: { discreteHourJump: false }
});
picker.create();`}
              options={{
                clock: { discreteHourJump: false },
              }}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
