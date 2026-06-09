"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Smartphone } from "lucide-react";

export default function MobilePage() {
  return (
    <div>
      <PageHeader
        title="Mobile Version"
        description="Force mobile-optimized interface"
        eyebrow="Example · Features"
      />

      <Section icon={Smartphone} title="Force Mobile Version">
        <p className="text-muted-foreground mb-4">
          Enable mobile-optimized version:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { mobile: true }
});
picker.create();`}
          options={{
            ui: { mobile: true },
          }}
        />
      </Section>

      <Section icon={Smartphone} title="Mobile with Custom Labels">
        <p className="text-muted-foreground mb-4">
          Customize labels for mobile version:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { mobile: true },
  labels: {
    mobileHour: 'Hour',
    mobileMinute: 'Minute',
    mobileTime: 'Enter Time'
  }
});
picker.create();`}
          options={{
            ui: { mobile: true },
            labels: {
              mobileHour: "Hour",
              mobileMinute: "Minute",
              mobileTime: "Enter Time",
            },
          }}
        />
      </Section>

      <Section icon={Smartphone} title="Mobile with Switch Icon">
        <p className="text-muted-foreground mb-4">
          Enable icon to switch between mobile and desktop:
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

      <Section icon={Smartphone} title="Mobile with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { mobile: true },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { mobile: true },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
