"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Moon } from "lucide-react";

export default function DarkThemePage() {
  return (
    <div>
      <PageHeader
        title="Dark Theme"
        description="Dark mode theme for reduced eye strain"
        eyebrow="Example · Themes"
      />

      <Section icon={Moon} title="Dark Theme">
        <p className="text-muted-foreground mb-4">
          Perfect for night-time use and dark interfaces:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'dark' }
});
picker.create();`}
          options={{
            ui: { theme: "dark" },
          }}
        />
      </Section>

      <Section icon={Moon} title="Dark with 12h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'dark' },
  clock: { type: '12h' }
});
picker.create();`}
          options={{
            ui: { theme: "dark" },
            clock: { type: "12h" },
          }}
        />
      </Section>

      <Section icon={Moon} title="Dark with 24h Format">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'dark' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "dark" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
