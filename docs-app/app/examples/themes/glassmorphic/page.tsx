"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Sparkles } from "lucide-react";

export default function GlassmorphicPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Glassmorphic Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Modern glass effect with blur and transparency
        </p>
      </div>

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
