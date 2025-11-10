"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function CranePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Crane Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Google Crane theme with rounded corners
        </p>
      </div>

      <Section icon={Palette} title="Crane Theme">
        <p className="text-muted-foreground mb-4">
          Modern theme inspired by Google Material Design Crane with smooth
          rounded edges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane'
});
picker.create();`}
          options={{
            theme: "crane",
          }}
        />
      </Section>

      <Section icon={Palette} title="With 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane',
  clockType: '12h'
});
picker.create();`}
          options={{
            theme: "crane",
            clockType: "12h",
          }}
        />
      </Section>

      <Section icon={Palette} title="With 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "crane",
            clockType: "24h",
          }}
        />
      </Section>
    </div>
  );
}
