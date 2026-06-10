"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function BasicThemePage() {
  return (
    <div>
      <PageHeader
        title="Basic Theme"
        description="Default Material Design inspired theme"
        eyebrow="Example · Themes"
      />

      <Section icon={Palette} title="Default Basic Theme">
        <p className="text-muted-foreground mb-4">
          The basic theme is the default Material Design inspired style:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'basic' }
});
picker.create();`}
          options={{
            ui: { theme: "basic" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Basic Theme with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'basic' },
  clock: {
    type: '12h',
    autoSwitchToMinutes: true
  }
});
picker.create();`}
          options={{
            ui: { theme: "basic" },
            clock: {
              type: "12h",
              autoSwitchToMinutes: true,
            },
          }}
        />
      </Section>

      <Section icon={Palette} title="Basic Theme with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'basic' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { theme: "basic" },
            clock: { type: "24h" },
          }}
        />
      </Section>

      <Section icon={Palette} title="Basic with Custom Labels">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'basic' },
  labels: {
    ok: 'Confirm',
    cancel: 'Close',
    time: 'Choose Your Time'
  }
});
picker.create();`}
          options={{
            ui: { theme: "basic" },
            labels: {
              ok: "Confirm",
              cancel: "Close",
              time: "Choose Your Time",
            },
          }}
        />
      </Section>
    </div>
  );
}
