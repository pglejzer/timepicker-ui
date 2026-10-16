"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function BlueprintThemePage() {
  return (
    <div>
      <PageHeader
        title="Blueprint"
        description="Light precision-instrument look with a vivid cobalt accent and hairline borders"
      />

      <Section title="Blueprint Theme">
        <p>
          A clean, technical aesthetic on pale blue surfaces, vivid cobalt accent
          and crisp hairline borders that match the docs&apos; own look:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint" },
          }}
        />
      </Section>

      <Section title="Blueprint with 12h Format">
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section title="Blueprint with 24h Format">
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
