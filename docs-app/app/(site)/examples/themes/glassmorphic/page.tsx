"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function GlassmorphicPage() {
  return (
    <div>
      <PageHeader
        title="Glassmorphic Theme"
        description="Modern glass effect with blur and transparency"
      />

      <Section title="Glassmorphic Theme">
        <p>
          Trendy glassmorphism design with frosted glass effect:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'glassmorphic' }
});
picker.create();`}
          options={{
            ui: { theme: "glassmorphic" },
          }}
        />
      </Section>

      <Section title="Glassmorphic with 12h">
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'glassmorphic' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "glassmorphic" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section title="Glassmorphic with 24h">
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'glassmorphic' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "glassmorphic" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
