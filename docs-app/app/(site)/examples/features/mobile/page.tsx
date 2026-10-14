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
        description={
          <>
            Open the picker in the keyboard view, where users type the time,
            with <code>ui.initialView: &apos;keyboard&apos;</code>.
          </>
        }
        eyebrow="Example · Features"
      />

      <Section icon={Smartphone} title="Start in the Keyboard View">
        <p className="text-muted-foreground mb-4">
          Open with the hour and minute fields instead of the clock face:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { initialView: 'keyboard' }
});
picker.create();`}
          options={{
            ui: { initialView: "keyboard" },
          }}
        />
      </Section>

      <Section icon={Smartphone} title="Keyboard View with Custom Labels">
        <p className="text-muted-foreground mb-4">
          Change the title and the field captions of the keyboard view:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { initialView: 'keyboard' },
  labels: {
    hour: 'Hour',
    minute: 'Minute',
    keyboardTitle: 'Enter Time'
  }
});
picker.create();`}
          options={{
            ui: { initialView: "keyboard" },
            labels: {
              hour: "Hour",
              minute: "Minute",
              keyboardTitle: "Enter Time",
            },
          }}
        />
      </Section>

      <Section icon={Smartphone} title="Keyboard View with View Switch">
        <p className="text-muted-foreground mb-4">
          Show the icon that switches between the keyboard view and the clock
          face:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    initialView: 'keyboard',
    viewSwitch: true
  }
});
picker.create();`}
          options={{
            ui: {
              initialView: "keyboard",
              viewSwitch: true,
            },
          }}
        />
      </Section>

      <Section icon={Smartphone} title="Keyboard View with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { initialView: 'keyboard' },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { initialView: "keyboard" },
            clock: { type: "24h" },
          }}
        />
      </Section>
    </div>
  );
}
