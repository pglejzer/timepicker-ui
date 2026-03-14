"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Disc3, Palette, Settings } from "lucide-react";

export default function WheelModePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Wheel Mode
        </h1>
        <p className="text-lg text-muted-foreground">
          Scroll-spinner interface replacing the analog clock face
        </p>
      </div>

      <Section icon={Disc3} title="12h Wheel">
        <p className="text-muted-foreground mb-4">
          Basic wheel mode with 12-hour format and AM/PM column:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { mode: 'wheel' }
}).create();`}
          options={{
            ui: { mode: "wheel" },
          }}
        />
      </Section>

      <Section icon={Disc3} title="24h Wheel">
        <p className="text-muted-foreground mb-4">
          Wheel mode with 24-hour format (no AM/PM column):
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  clock: { type: '24h' },
  ui: { mode: 'wheel' }
}).create();`}
          options={{
            clock: { type: "24h" },
            ui: { mode: "wheel" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Wheel + Dark Theme">
        <p className="text-muted-foreground mb-4">
          Wheel mode styled with the dark theme:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'dark' }
}).create();`}
          options={{
            ui: { mode: "wheel", theme: "dark" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Wheel + M3 Theme">
        <p className="text-muted-foreground mb-4">
          Wheel mode with Material Design 3 green theme:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'm3-green' }
}).create();`}
          options={{
            ui: { mode: "wheel", theme: "m3-green" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Wheel + Cyberpunk Theme">
        <p className="text-muted-foreground mb-4">
          Wheel mode with the cyberpunk theme:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { mode: 'wheel', theme: 'cyberpunk' }
}).create();`}
          options={{
            ui: { mode: "wheel", theme: "cyberpunk" },
          }}
        />
      </Section>

      <Section icon={Settings} title="Wheel + 5 Minute Steps">
        <p className="text-muted-foreground mb-4">
          Wheel mode with 5-minute increment between wheel items:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  clock: { incrementMinutes: 5 },
  ui: { mode: 'wheel' }
}).create();`}
          options={{
            clock: { incrementMinutes: 5 },
            ui: { mode: "wheel" },
          }}
        />
      </Section>
    </div>
  );
}
