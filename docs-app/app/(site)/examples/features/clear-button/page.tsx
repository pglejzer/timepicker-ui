"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Trash2, Settings, Bell } from "lucide-react";

export default function ClearButtonPage() {
  return (
    <div>
      <PageHeader
        title="Clear Button"
        description="Reset time selection with a dedicated clear button"
        eyebrow="Example · Features"
      />

      <Section icon={Trash2} title="Enable Clear Button">
        <p className="text-muted-foreground mb-4">
          The clear button is off by default. Turn it on with{" "}
          <code>ui.clearButton: true</code>:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { clearButton: true }
});
picker.create();`}
          options={{
            ui: { clearButton: true },
          }}
        />
      </Section>

      <Section icon={Settings} title="Disabled Clear Button">
        <p className="text-muted-foreground mb-4">
          Hide the clear button (this is the default):
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { clearButton: false }
}).create();`}
          options={{
            ui: { clearButton: false },
          }}
        />
      </Section>

      <Section icon={Settings} title="Keep Input Value on Clear">
        <p className="text-muted-foreground mb-4">
          Clear the clock state but keep the input value, with the object form
          of <code>ui.clearButton</code>:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { clearButton: { clearInput: false } }
}).create();`}
          options={{
            ui: { clearButton: { clearInput: false } },
          }}
        />
      </Section>

      <Section icon={Trash2} title="Custom Label">
        <p className="text-muted-foreground mb-4">
          Use a custom label for the clear button:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { clearButton: true },
  labels: { clear: 'Reset' }
}).create();`}
          options={{
            ui: { clearButton: true },
            labels: { clear: "Reset" },
          }}
        />
      </Section>

      <Section icon={Bell} title="With Clear Callback">
        <p className="text-muted-foreground mb-4">
          Handle the clear event via callback:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  ui: { clearButton: true },
  callbacks: {
    onClear: (data) => {
      console.log('Cleared! Previous:', data.previousValue);
    }
  }
}).create();`}
          options={{
            ui: { clearButton: true },
            callbacks: {
              onClear: (data: { previousValue: string }) => {
                console.log("Cleared! Previous:", data.previousValue);
              },
            },
          }}
        />
      </Section>
    </div>
  );
}
