"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Zap } from "lucide-react";

export default function CyberpunkPage() {
  return (
    <div>
      <PageHeader
        title="Cyberpunk Theme"
        description="Neon cyberpunk aesthetic with vibrant colors"
        eyebrow="Example · Themes"
      />

      <Section icon={Zap} title="Cyberpunk Theme">
        <p className="text-muted-foreground mb-4">
          Bold cyberpunk design with neon accents:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'cyberpunk' }
});
picker.create();`}
          options={{
            ui: { theme: "cyberpunk" },
          }}
        />
      </Section>

      <Section icon={Zap} title="Cyberpunk with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'cyberpunk' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "cyberpunk" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Zap} title="Cyberpunk with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'cyberpunk' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "cyberpunk" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
