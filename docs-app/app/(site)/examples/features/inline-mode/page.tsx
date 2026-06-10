"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Layout } from "lucide-react";

export default function InlineModePage() {
  return (
    <div>
      <PageHeader
        title="Inline Mode"
        description="Display timepicker without modal overlay"
        eyebrow="Example · Features"
      />
      <div id="timepicker-container-inline" />

      <Section icon={Layout} title="Inline with Theme">
        <p className="text-muted-foreground mb-4">
          Apply custom theme to inline timepicker:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    inline: {
      enabled: true,
      containerId: 'timepicker-container',
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
                containerId: "timepicker-container-inline",
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
