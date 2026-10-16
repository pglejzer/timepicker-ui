"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function AIThemePage() {
  return (
    <div>
      <PageHeader
        title="AI Theme"
        description="Futuristic AI-inspired theme with modern aesthetics"
      />

      <Section title="AI Theme">
        <p>
          Futuristic theme inspired by AI interfaces:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'ai' }
});
picker.create();`}
          options={{
            ui: { theme: "ai" },
          }}
        />
      </Section>

      <Section title="AI with 12h">
        <TimepickerExample
          themeControl
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

      <Section title="AI with 24h">
        <TimepickerExample
          themeControl
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
