"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Sparkles } from "lucide-react";

export default function GlassmorphicPage() {
  return (
    <div>
      <PageHeader
        title="Glassmorphic Theme"
        description="Modern glass effect with blur and transparency"
        eyebrow="Example · Themes"
      />

      <Section icon={Sparkles} title="Glassmorphic Theme">
        <p className="text-muted-foreground mb-4">
          Trendy glassmorphism design with frosted glass effect:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'glassmorphic' }
});
picker.create();`}
          options={{
            ui: { theme: "glassmorphic" },
          }}
        />
      </Section>

      <Section icon={Sparkles} title="Glassmorphic with 12h">
        <TimepickerExample
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

      <Section icon={Sparkles} title="Glassmorphic with 24h">
        <TimepickerExample
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
