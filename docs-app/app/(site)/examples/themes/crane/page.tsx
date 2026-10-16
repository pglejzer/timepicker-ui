"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function CranePage() {
  return (
    <div>
      <PageHeader
        title="Crane Theme"
        description="Google Crane theme with rounded corners"
      />

      <Section title="Crane Theme">
        <p>
          Modern theme inspired by Google Material Design Crane with smooth
          rounded edges:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'crane' }
});
picker.create();`}
          options={{
            ui: { theme: "crane" },
          }}
        />
      </Section>

      <Section title="With 12h Format">
        <TimepickerExample
          themeControl
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

      <Section title="With 24h Format">
        <TimepickerExample
          themeControl
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
