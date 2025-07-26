"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Palette } from "lucide-react";

export default function BasicThemePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Basic Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Default Material Design inspired theme
        </p>
      </div>

      <Section icon={Palette} title="Default Basic Theme">
        <p className="text-muted-foreground mb-4">
          The basic theme is the default Material Design inspired style:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'basic'
});
picker.create();`}
          options={{
            theme: "basic",
          }}
        />
      </Section>

      <Section icon={Palette} title="Basic Theme with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'basic',
  clockType: '12h',
  switchToMinutesAfterSelectHour: true
});
picker.create();`}
          options={{
            theme: "basic",
            clockType: "12h",
            switchToMinutesAfterSelectHour: true,
          }}
        />
      </Section>

      <Section icon={Palette} title="Basic Theme with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'basic',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "basic",
            clockType: "24h",
          }}
        />
      </Section>

      <Section icon={Palette} title="Basic with Custom Labels">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'basic',
  okLabel: 'Confirm',
  cancelLabel: 'Close',
  timeLabel: 'Choose Your Time'
});
picker.create();`}
          options={{
            theme: "basic",
            okLabel: "Confirm",
            cancelLabel: "Close",
            timeLabel: "Choose Your Time",
          }}
        />
      </Section>
    </div>
  );
}
