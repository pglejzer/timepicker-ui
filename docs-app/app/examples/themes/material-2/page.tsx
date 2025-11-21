"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function Material2Page() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Material 2 Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Classic Material Design 2 theme
        </p>
      </div>

      <Section icon={Palette} title="Material 2 Theme">
        <p className="text-muted-foreground mb-4">
          Classic Material Design 2 theme preserving the traditional look:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm2' }
});
picker.create();`}
          options={{
            ui: { theme: "m2" },
          }}
        />
      </Section>

      <Section icon={Palette} title="M2 with 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm2' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "m2" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Palette} title="M2 with 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm2' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "m2" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
