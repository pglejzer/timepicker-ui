"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function InlineModePage() {
  return (
    <div>
      <PageHeader
        title="Inline Mode"
        description="Display timepicker without modal overlay"
      />

      <Section title="Inline with Theme">
        <p>
          Apply custom theme to inline timepicker:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      container: '#timepicker-container',
      autoUpdate: true
    },
    theme: 'dark'
  },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: {
              inline: {
                enabled: true,
                container: "#timepicker-container-inline",
                autoUpdate: true,
              },
              theme: "dark",
            },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
