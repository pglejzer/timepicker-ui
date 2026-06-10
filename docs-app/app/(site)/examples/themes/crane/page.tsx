"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function CranePage() {
  return (
    <div>
      <PageHeader
        title="Crane Theme"
        description="Google Crane theme with rounded corners"
        eyebrow="Example · Themes"
      />

      <Section icon={Palette} title="Crane Theme">
        <p className="text-muted-foreground mb-4">
          Modern theme inspired by Google Material Design Crane with smooth
          rounded edges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane' }
});
picker.create();`}
          options={{
            ui: { theme: "crane" },
          }}
        />
      </Section>

      <Section icon={Palette} title="With 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "crane" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Palette} title="With 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "crane" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
