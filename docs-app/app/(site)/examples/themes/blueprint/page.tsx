"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Ruler } from "lucide-react";

export default function BlueprintThemePage() {
  return (
    <div>
      <PageHeader
        title="Blueprint"
        description="Light precision-instrument look with a vivid cobalt accent and hairline borders"
        eyebrow="Example · Themes"
      />

      <Section icon={Ruler} title="Blueprint Theme">
        <p className="text-muted-foreground mb-4">
          A clean, technical aesthetic on white surfaces — vivid cobalt accent
          and crisp hairline borders that match the docs&apos; own look:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'blueprint' }
});
picker.create();`}
          options={{
            ui: { theme: "blueprint" },
          }}
        />
      </Section>

      <Section icon={Ruler} title="Blueprint with 12h Format">
        <TimepickerExample
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

      <Section icon={Ruler} title="Blueprint with 24h Format">
        <TimepickerExample
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
