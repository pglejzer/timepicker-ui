"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

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
      />

      <Section title="Enable the View Switch">
        <p>
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

      <Section title="Start in the Keyboard View">
        <p>
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

      <Section title="With Theme">
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
