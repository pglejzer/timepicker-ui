"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Bot } from "lucide-react";

export default function AIThemePage() {
  return (
    <div>
      <PageHeader
        title="AI Theme"
        description="Futuristic AI-inspired theme with modern aesthetics"
        eyebrow="Example · Themes"
      />

      <Section icon={Bot} title="AI Theme">
        <p className="text-muted-foreground mb-4">
          Futuristic theme inspired by AI interfaces:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'ai' }
});
picker.create();`}
          options={{
            ui: { theme: "ai" },
          }}
        />
      </Section>

      <Section icon={Bot} title="AI with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'ai' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "ai" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Bot} title="AI with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'ai' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "ai" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
