"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

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
      />

      <Section title="Start in the Keyboard View">
        <p>
          Open with the hour and minute fields instead of the clock face:
        </p>
        <TimepickerExample
          display="field"
          phoneControl
          code={`const picker = new TimepickerUI(input, {
  ui: { initialView: 'keyboard' }
});
picker.create();`}
          options={{
            ui: { initialView: "keyboard" },
          }}
        />
      </Section>

      <Section title="Keyboard View with Custom Labels">
        <p>
          Change the title and the field captions of the keyboard view:
        </p>
        <TimepickerExample
          display="field"
          phoneControl
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

      <Section title="Keyboard View with View Switch">
        <p>
          Show the icon that switches between the keyboard view and the clock
          face:
        </p>
        <TimepickerExample
          display="field"
          phoneControl
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

      <Section title="Keyboard View with 24h">
        <TimepickerExample
          display="field"
          phoneControl
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
