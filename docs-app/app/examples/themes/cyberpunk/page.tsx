"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Zap } from "lucide-react";

export default function CyberpunkPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Cyberpunk Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Neon cyberpunk aesthetic with vibrant colors
        </p>
      </div>

      <Section icon={Zap} title="Cyberpunk Theme">
        <p className="text-muted-foreground mb-4">
          Bold cyberpunk design with neon accents:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'cyberpunk'
});
picker.create();`}
          options={{
            theme: "cyberpunk",
          }}
        />
      </Section>

      <Section icon={Zap} title="Cyberpunk with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'cyberpunk',
  clockType: '12h'
});
picker.create();`}
          options={{
            theme: "cyberpunk",
            clockType: "12h",
          }}
        />
      </Section>

      <Section icon={Zap} title="Cyberpunk with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'cyberpunk',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "cyberpunk",
            clockType: "24h",
          }}
        />
      </Section>
    </div>
  );
}
