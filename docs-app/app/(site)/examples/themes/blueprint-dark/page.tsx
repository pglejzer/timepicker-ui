"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Ruler } from "lucide-react";

export default function BlueprintDarkThemePage() {
  return (
    <div>
      <PageHeader
        title="Blueprint Dark"
        description="Dark sibling of Blueprint — brighter cobalt on near-black surfaces with hairline borders"
        eyebrow="Example · Themes"
      />

      <Section icon={Ruler} title="Blueprint Dark Theme">
        <p className="text-muted-foreground mb-4">
          The same technical, hairline-bordered aesthetic on near-black
          surfaces with a brighter cobalt accent — distinct from the purple{" "}
          <code>dark</code> theme:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint-dark' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint-dark" },
          }}
        />
      </Section>

      <Section icon={Ruler} title="Blueprint Dark with 12h Format">
        <TimepickerExample
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

      <Section icon={Ruler} title="Blueprint Dark with 24h Format">
        <TimepickerExample
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
