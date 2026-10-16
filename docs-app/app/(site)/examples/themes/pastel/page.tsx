"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function PastelPage() {
  return (
    <div>
      <PageHeader
        title="Pastel Theme"
        description="Soft pastel colors for a gentle, calming interface"
      />

      <Section title="Pastel Theme">
        <p>
          Soft and pleasant pastel color palette:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'pastel' }
});
picker.create();`}
          options={{
            ui: { theme: "pastel" },
          }}
        />
      </Section>

      <Section title="Pastel with 12h">
        <TimepickerExample
          themeControl
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

      <Section title="Pastel with 24h">
        <TimepickerExample
          themeControl
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
