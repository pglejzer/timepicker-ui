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
        description={
          <>
            Show a button that switches between the clock face and the
            keyboard view, with <code>ui.viewSwitch</code>.
          </>
        }
        eyebrow="Example · Features"
      />

      <Section icon={ArrowLeftRight} title="Enable the View Switch">
        <p className="text-muted-foreground mb-4">
          Show the icon that switches between the clock face and the keyboard
          view:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { viewSwitch: true }
});
picker.create();`}
          options={{
            ui: { viewSwitch: true },
          }}
        />
      </Section>

      <Section icon={ArrowLeftRight} title="Start in the Keyboard View">
        <p className="text-muted-foreground mb-4">
          Open in the keyboard view, with the icon to switch to the clock face:
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

      <Section icon={ArrowLeftRight} title="With Theme">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    viewSwitch: true,
    theme: 'dark'
  }
});
picker.create();`}
          options={{
            ui: {
              viewSwitch: true,
              theme: "dark",
            },
          }}
        />
      </Section>
    </div>
  );
}
