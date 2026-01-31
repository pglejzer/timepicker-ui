"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { RotateCw } from "lucide-react";

export default function SmoothHourSnapPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Smooth Hour Snap
        </h1>
        <p className="text-lg text-muted-foreground">
          Enable fluid hour dragging with smooth snapping animation
        </p>
      </div>

      <Section icon={RotateCw} title="Smooth Hour Dragging">
        <p className="text-muted-foreground mb-4">
          Drag the clock hand smoothly between hours (like minutes), with
          animated snap on release:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { smoothHourSnap: true }
});
picker.create();`}
          options={{
            clock: { smoothHourSnap: true },
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
    smoothHourSnap: true
  }
});
picker.create();`}
          options={{
            clock: {
              type: "24h",
              smoothHourSnap: true,
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
    smoothHourSnap: true
  }
});
picker.create();`}
          options={{
            clock: {
              incrementHours: 2,
              smoothHourSnap: true,
            },
          }}
        />
      </Section>

      <Section icon={RotateCw} title="Comparison: Default vs Smooth">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Default (Discrete)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clock hand jumps directly to each hour
            </p>
            <TimepickerExample
              code={`const picker = new TimepickerUI(input, {
  clock: { smoothHourSnap: false }
});
picker.create();`}
              options={{
                clock: { smoothHourSnap: false },
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">
              Smooth Hour Snap
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Clock hand drags fluidly, snaps on release
            </p>
            <TimepickerExample
              code={`const picker = new TimepickerUI(input, {
  clock: { smoothHourSnap: true }
});
picker.create();`}
              options={{
                clock: { smoothHourSnap: true },
              }}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
