"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function CraneStraightPage() {
  return (
    <div>
      <PageHeader
        title="Crane Straight Theme"
        description="Google Crane inspired theme with straight edges"
      />

      <Section title="Crane Straight Theme">
        <p>
          Modern theme with sharp, straight edges:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane-straight' }
});
picker.create();`}
          options={{
            ui: { theme: "crane-straight" },
          }}
        />
      </Section>

      <Section title="With 12h Format">
        <TimepickerExample
          themeControl
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

      <Section title="With 24h Format">
        <TimepickerExample
          themeControl
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
