"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function BasicThemePage() {
  return (
    <div>
      <PageHeader
        title="Basic Theme"
        description="Default Material Design inspired theme"
      />

      <Section title="Default Basic Theme">
        <p>
          The basic theme is the default Material Design inspired style:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'basic' }
});
picker.create();`}
          options={{
            ui: { theme: "basic" },
          }}
        />
      </Section>

      <Section title="Basic Theme with 12h">
        <TimepickerExample
          themeControl
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

      <Section title="Basic Theme with 24h">
        <TimepickerExample
          themeControl
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

      <Section title="Basic with Custom Labels">
        <TimepickerExample
          display="field"
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'basic' },
  labels: {
    ok: 'Confirm',
    cancel: 'Close',
    clockTitle: 'Choose Your Time'
  }
});
picker.create();`}
          options={{
            ui: { theme: "basic" },
            labels: {
              ok: "Confirm",
              cancel: "Close",
              clockTitle: "Choose Your Time",
            },
          }}
        />
      </Section>
    </div>
  );
}
