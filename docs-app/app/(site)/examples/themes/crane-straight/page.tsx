"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function CraneStraightPage() {
  return (
    <div>
      <PageHeader
        title="Crane Straight Theme"
        description="Google Crane inspired theme with straight edges"
        eyebrow="Example · Themes"
      />

      <Section icon={Palette} title="Crane Straight Theme">
        <p className="text-muted-foreground mb-4">
          Modern theme with sharp, straight edges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane-straight' }
});
picker.create();`}
          options={{
            ui: { theme: "crane-straight" },
          }}
        />
      </Section>

      <Section icon={Palette} title="With 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane-straight' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "crane-straight" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Palette} title="With 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane-straight' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "crane-straight" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
