"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function Material2Page() {
  return (
    <div>
      <PageHeader
        title="Material 2 Theme"
        description="Classic Material Design 2 theme"
      />

      <Section title="Material 2 Theme">
        <p>
          Classic Material Design 2 theme preserving the traditional look:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'm2' }
});
picker.create();`}
          options={{
            ui: { theme: "m2" },
          }}
        />
      </Section>

      <Section title="M2 with 12h Format">
        <TimepickerExample
          themeControl
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

      <Section title="M2 with 24h Format">
        <TimepickerExample
          themeControl
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
