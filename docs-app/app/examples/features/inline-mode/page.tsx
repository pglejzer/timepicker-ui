"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Layout } from "lucide-react";

export default function InlineModePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Inline Mode
        </h1>
        <p className="text-lg text-muted-foreground">
          Display timepicker without modal overlay
        </p>
      </div>
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
