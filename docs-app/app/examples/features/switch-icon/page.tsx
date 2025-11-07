"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { ArrowLeftRight } from "lucide-react";

export default function SwitchIconPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Switch Icon
        </h1>
        <p className="text-lg text-muted-foreground">
          Enable icon to toggle between mobile and desktop views
        </p>
      </div>

      <Section icon={ArrowLeftRight} title="Enable Switch Icon">
        <p className="text-muted-foreground mb-4">
          Show icon to switch between mobile and desktop versions:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  enableSwitchIcon: true
});
picker.create();`}
          options={{
            enableSwitchIcon: true,
          }}
        />
      </Section>

      <Section icon={ArrowLeftRight} title="With Mobile Default">
        <p className="text-muted-foreground mb-4">
          Start in mobile mode with switch icon:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  mobile: true,
  enableSwitchIcon: true
});
picker.create();`}
          options={{
            mobile: true,
            enableSwitchIcon: true,
          }}
        />
      </Section>

      <Section icon={ArrowLeftRight} title="With Theme">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  enableSwitchIcon: true,
  theme: 'dark'
});
picker.create();`}
          options={{
            enableSwitchIcon: true,
            theme: "dark",
          }}
        />
      </Section>
    </div>
  );
}
