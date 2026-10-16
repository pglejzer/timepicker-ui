"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function ClearButtonPage() {
  return (
    <div>
      <PageHeader
        title="Clear Button"
        description="Reset time selection with a dedicated clear button"
      />

      <Section title="Enable Clear Button">
        <p>
          The clear button is off by default. Turn it on with{" "}
          <code>ui.clearButton: true</code>:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: { clearButton: true }
});
picker.create();`}
          options={{
            ui: { clearButton: true },
          }}
        />
      </Section>

      <Section title="Disabled Clear Button">
        <p>
          Hide the clear button (this is the default):
        </p>
        <TimepickerExample
          display="field"
          code={`new TimepickerUI(input, {
  ui: { clearButton: false }
}).create();`}
          options={{
            ui: { clearButton: false },
          }}
        />
      </Section>

      <Section title="Keep Input Value on Clear">
        <p>
          Clear the clock state but keep the input value, with the object form
          of <code>ui.clearButton</code>:
        </p>
        <TimepickerExample
          display="field"
          code={`new TimepickerUI(input, {
  ui: { clearButton: { clearInput: false } }
}).create();`}
          options={{
            ui: { clearButton: { clearInput: false } },
          }}
        />
      </Section>

      <Section title="Custom Label">
        <p>
          Use a custom label for the clear button:
        </p>
        <TimepickerExample
          display="field"
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

      <Section title="With Clear Callback">
        <p>
          Handle the clear event via callback:
        </p>
        <TimepickerExample
          display="field"
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
