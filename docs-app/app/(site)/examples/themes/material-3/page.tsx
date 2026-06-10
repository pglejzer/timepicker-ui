"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function Material3Page() {
  return (
    <div>
      <PageHeader
        title="Material 3 Green Theme"
        description="Material Design 3 (Material You) with green color scheme"
        eyebrow="Example · Themes"
      />

      <Section icon={Palette} title="Material 3 Green Theme">
        <p className="text-muted-foreground mb-4">
          Latest Material Design 3 inspired theme with green accents:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm3-green' }
});
picker.create();`}
          options={{
            ui: { theme: "m3-green" },
          }}
        />
      </Section>

      <Section icon={Palette} title="M3 Green with 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm3-green' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "m3-green" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Palette} title="M3 Green with 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm3-green' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "m3-green" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
