"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function CraneStraightPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Crane Straight Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Google Crane inspired theme with straight edges
        </p>
      </div>

      <Section icon={Palette} title="Crane Straight Theme">
        <p className="text-muted-foreground mb-4">
          Modern theme with sharp, straight edges:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane-straight'
});
picker.create();`}
          options={{
            theme: "crane-straight",
          }}
        />
      </Section>

      <Section icon={Palette} title="With 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane-straight',
  clockType: '12h'
});
picker.create();`}
          options={{
            theme: "crane-straight",
            clockType: "12h",
          }}
        />
      </Section>

      <Section icon={Palette} title="With 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'crane-straight',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "crane-straight",
            clockType: "24h",
          }}
        />
      </Section>
    </div>
  );
}
