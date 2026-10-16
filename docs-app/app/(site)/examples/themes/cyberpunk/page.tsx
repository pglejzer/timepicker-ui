"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function CyberpunkPage() {
  return (
    <div>
      <PageHeader
        title="Cyberpunk Theme"
        description="Neon cyan accents and a cyan glow on dark indigo surfaces"
      />

      <Section title="Cyberpunk Theme">
        <p>
          Bold cyberpunk design with neon accents:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'cyberpunk' }
});
picker.create();`}
          options={{
            ui: { theme: "cyberpunk" },
          }}
        />
      </Section>

      <Section title="Cyberpunk with 12h">
        <TimepickerExample
          themeControl
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

      <Section title="Cyberpunk with 24h">
        <TimepickerExample
          themeControl
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
