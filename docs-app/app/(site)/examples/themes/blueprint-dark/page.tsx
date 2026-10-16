"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function BlueprintDarkThemePage() {
  return (
    <div>
      <PageHeader
        title="Blueprint Dark"
        description="Dark sibling of Blueprint, brighter cobalt on navy surfaces with hairline borders"
      />

      <Section title="Blueprint Dark Theme">
        <p>
          The same technical, hairline-bordered aesthetic on navy
          surfaces with a brighter cobalt accent, distinct from the purple{" "}
          <code>dark</code> theme:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint-dark' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint-dark" },
          }}
        />
      </Section>

      <Section title="Blueprint Dark with 12h Format">
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint-dark' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint-dark" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section title="Blueprint Dark with 24h Format">
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint-dark' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint-dark" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
