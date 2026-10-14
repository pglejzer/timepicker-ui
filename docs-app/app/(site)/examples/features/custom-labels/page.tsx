"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Type } from "lucide-react";

export default function CustomLabelsPage() {
  return (
    <div>
      <PageHeader
        title="Custom Labels"
        description="Customize all text labels for localization"
        eyebrow="Example · Features"
      />

      <Section icon={Type} title="Button Labels">
        <p className="text-muted-foreground mb-4">
          Customize OK and Cancel button text:
        </p>
        <TimepickerExample
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

      <Section icon={Type} title="AM/PM Labels">
        <p className="text-muted-foreground mb-4">
          Customize AM and PM labels:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  labels: {
    am: 'Morning',
    pm: 'Evening'
  }
});
picker.create();`}
          options={{
            clock: { type: "12h" },
            labels: {
              am: "Morning",
              pm: "Evening",
            },
          }}
        />
      </Section>

      <Section icon={Type} title="Clock View Title">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={Type} title="Keyboard View Labels">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={Type} title="Polish Localization">
        <p className="text-muted-foreground mb-4">
          Example with Polish labels:
        </p>
        <TimepickerExample
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
