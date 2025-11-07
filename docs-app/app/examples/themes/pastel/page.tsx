"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Heart } from "lucide-react";

export default function PastelPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Pastel Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Soft pastel colors for a gentle, calming interface
        </p>
      </div>

      <Section icon={Heart} title="Pastel Theme">
        <p className="text-muted-foreground mb-4">
          Soft and pleasant pastel color palette:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'pastel'
});
picker.create();`}
          options={{
            theme: "pastel",
          }}
        />
      </Section>

      <Section icon={Heart} title="Pastel with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'pastel',
  clockType: '12h'
});
picker.create();`}
          options={{
            theme: "pastel",
            clockType: "12h",
          }}
        />
      </Section>

      <Section icon={Heart} title="Pastel with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'pastel',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "pastel",
            clockType: "24h",
          }}
        />
      </Section>
    </div>
  );
}
