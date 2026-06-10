"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Heart } from "lucide-react";

export default function PastelPage() {
  return (
    <div>
      <PageHeader
        title="Pastel Theme"
        description="Soft pastel colors for a gentle, calming interface"
        eyebrow="Example · Themes"
      />

      <Section icon={Heart} title="Pastel Theme">
        <p className="text-muted-foreground mb-4">
          Soft and pleasant pastel color palette:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'pastel' }
});
picker.create();`}
          options={{
            ui: { theme: "pastel" },
          }}
        />
      </Section>

      <Section icon={Heart} title="Pastel with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'pastel' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "pastel" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Heart} title="Pastel with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'pastel' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "pastel" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
