"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function CraneRadiusPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Crane Radius Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Google Crane theme with rounded edges
        </p>
      </div>

      <Section icon={Palette} title="Crane Radius Theme">
        <p className="text-muted-foreground mb-4">
          Modern theme with smooth, rounded edges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane-radius'
});
picker.create();`}
          options={{
            theme: "crane-radius",
          }}
        />
      </Section>

      <Section icon={Palette} title="With 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane-radius',
  clockType: '12h'
});
picker.create();`}
          options={{
            theme: "crane-radius",
            clockType: "12h",
          }}
        />
      </Section>

      <Section icon={Palette} title="With 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane-radius',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "crane-radius",
            clockType: "24h",
          }}
        />
      </Section>
    </div>
  );
}
