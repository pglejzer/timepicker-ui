"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { ArrowLeftRight } from "lucide-react";

export default function SwitchIconPage() {
  return (
    <div>
      <PageHeader
        title="Switch Icon"
        description="Enable icon to toggle between mobile and desktop views"
        eyebrow="Example · Features"
      />

      <Section icon={ArrowLeftRight} title="Enable Switch Icon">
        <p className="text-muted-foreground mb-4">
          Show icon to switch between mobile and desktop versions:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { enableSwitchIcon: true }
});
picker.create();`}
          options={{
            ui: { enableSwitchIcon: true },
          }}
        />
      </Section>

      <Section icon={ArrowLeftRight} title="With Mobile Default">
        <p className="text-muted-foreground mb-4">
          Start in mobile mode with switch icon:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    mobile: true,
    enableSwitchIcon: true
  }
});
picker.create();`}
          options={{
            ui: {
              mobile: true,
              enableSwitchIcon: true,
            },
          }}
        />
      </Section>

      <Section icon={ArrowLeftRight} title="With Theme">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    enableSwitchIcon: true,
    theme: 'dark'
  }
});
picker.create();`}
          options={{
            ui: {
              enableSwitchIcon: true,
              theme: "dark",
            },
          }}
        />
      </Section>
    </div>
  );
}
