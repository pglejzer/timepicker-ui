"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function CustomLabelsPage() {
  return (
    <div>
      <PageHeader
        title="Custom Labels"
        description="Customize all text labels for localization"
      />

      <Section title="Button Labels">
        <p>
          Customize OK and Cancel button text:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  labels: {
    ok: 'Confirm',
    cancel: 'Close'
  }
});
picker.create();`}
          options={{
            labels: {
              ok: "Confirm",
              cancel: "Close",
            },
          }}
        />
      </Section>

      <Section title="AM/PM Labels">
        <p>
          Customize AM and PM labels:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  labels: {
    am: 'a.m.',
    pm: 'p.m.'
  }
});
picker.create();`}
          options={{
            clock: { type: "12h" },
            labels: {
              am: "a.m.",
              pm: "p.m.",
            },
          }}
        />
      </Section>

      <Section title="Clock View Title">
        <p>
          Change the heading of the clock face view with{" "}
          <code>labels.clockTitle</code>:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  labels: { clockTitle: 'Choose Your Time' }
});
picker.create();`}
          options={{
            labels: { clockTitle: "Choose Your Time" },
          }}
        />
      </Section>

      <Section title="Keyboard View Labels">
        <p>
          Change the labels of the keyboard view. <code>labels.hour</code> and{" "}
          <code>labels.minute</code> also name the fields for screen readers:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { initialView: 'keyboard' },
  labels: {
    hour: 'Hours',
    minute: 'Minutes',
    keyboardTitle: 'Set Time'
  }
});
picker.create();`}
          options={{
            ui: { initialView: "keyboard" },
            labels: {
              hour: "Hours",
              minute: "Minutes",
              keyboardTitle: "Set Time",
            },
          }}
        />
      </Section>

      <Section title="Polish Localization">
        <p>
          Example with Polish labels:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  labels: {
    ok: 'Zatwierdź',
    cancel: 'Anuluj',
    clockTitle: 'Wybierz godzinę'
  }
});
picker.create();`}
          options={{
            labels: {
              ok: "Zatwierdź",
              cancel: "Anuluj",
              clockTitle: "Wybierz godzinę",
            },
          }}
        />
      </Section>
    </div>
  );
}
