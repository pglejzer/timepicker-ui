"use client";

import Link from "next/link";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function DarkThemePage() {
  return (
    <div>
      <PageHeader
        title="Dark Theme"
        description="Dark mode theme for reduced eye strain"
      />

      <p>
        Since 4.7.0 the <code>dark</code> theme follows the Material 3 baseline
        dark palette. See the{" "}
        <Link href="/docs/features/themes">Themes page</Link> for the old
        values.
      </p>

      <Section title="Dark Theme">
        <p>
          Perfect for night-time use and dark interfaces:
        </p>
        <TimepickerExample
          themeControl
          code={`const picker = new TimepickerUI(input, {
  ui: { theme: 'dark' }
});
picker.create();`}
          options={{
            ui: { theme: "dark" },
          }}
        />
      </Section>

      <Section title="Dark with 12h Format">
        <TimepickerExample
          themeControl
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

      <Section title="Dark with 24h Format">
        <TimepickerExample
          themeControl
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
