"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Type } from "lucide-react";

export default function CustomLabelsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Custom Labels
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize all text labels for localization
        </p>
      </div>

      <Section icon={Type} title="Button Labels">
        <p className="text-muted-foreground mb-4">
          Customize OK and Cancel button text:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  okLabel: 'Confirm',
  cancelLabel: 'Close'
});
picker.create();`}
          options={{
            okLabel: "Confirm",
            cancelLabel: "Close",
          }}
        />
      </Section>

      <Section icon={Type} title="AM/PM Labels">
        <p className="text-muted-foreground mb-4">
          Customize AM and PM labels:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  clockType: '12h',
  amLabel: 'Morning',
  pmLabel: 'Evening'
});
picker.create();`}
          options={{
            clockType: "12h",
            amLabel: "Morning",
            pmLabel: "Evening",
          }}
        />
      </Section>

      <Section icon={Type} title="Time Label">
        <p className="text-muted-foreground mb-4">
          Customize time selection label:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  timeLabel: 'Choose Your Time'
});
picker.create();`}
          options={{
            timeLabel: "Choose Your Time",
          }}
        />
      </Section>

      <Section icon={Type} title="Mobile Labels">
        <p className="text-muted-foreground mb-4">
          Customize labels for mobile version:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  mobile: true,
  hourMobileLabel: 'H',
  minuteMobileLabel: 'M',
  mobileTimeLabel: 'Set Time'
});
picker.create();`}
          options={{
            mobile: true,
            hourMobileLabel: "H",
            minuteMobileLabel: "M",
            mobileTimeLabel: "Set Time",
          }}
        />
      </Section>

      <Section icon={Type} title="Polish Localization">
        <p className="text-muted-foreground mb-4">
          Example with Polish labels:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  okLabel: 'Zatwierdź',
  cancelLabel: 'Anuluj',
  timeLabel: 'Wybierz godzinę'
});
picker.create();`}
          options={{
            okLabel: "Zatwierdź",
            cancelLabel: "Anuluj",
            timeLabel: "Wybierz godzinę",
          }}
        />
      </Section>
    </div>
  );
}
