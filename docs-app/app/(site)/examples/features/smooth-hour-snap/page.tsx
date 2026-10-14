"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { RotateCw } from "lucide-react";

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
        eyebrow="Example · Features"
      />

      <Section icon={RotateCw} title="Smooth Hour Dragging">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={RotateCw} title="With 24h Format">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={RotateCw} title="With Increments">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={RotateCw} title="Comparison: Discrete vs Smooth">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Discrete
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
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
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Smooth Hour Snap (Default)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
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
