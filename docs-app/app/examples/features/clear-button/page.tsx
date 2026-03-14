"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Trash2, Settings, Bell } from "lucide-react";

export default function ClearButtonPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Clear Button
        </h1>
        <p className="text-lg text-muted-foreground">
          Reset time selection with a dedicated clear button
        </p>
      </div>

      <Section icon={Trash2} title="Default (Enabled)">
        <p className="text-muted-foreground mb-4">
          The clear button is enabled by default in all pickers:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input);
picker.create();
// Clear button is visible by default`}
          options={{}}
        />
      </Section>

      <Section icon={Settings} title="Disabled Clear Button">
        <p className="text-muted-foreground mb-4">Hide the clear button:</p>
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
          Clear the clock state but keep the input value:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  clearBehavior: { clearInput: false }
}).create();`}
          options={{
            clearBehavior: { clearInput: false },
          }}
        />
      </Section>

      <Section icon={Trash2} title="Custom Label">
        <p className="text-muted-foreground mb-4">
          Use a custom label for the clear button:
        </p>
        <TimepickerExample
          code={`new TimepickerUI(input, {
  labels: { clear: 'Reset' }
}).create();`}
          options={{
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
  callbacks: {
    onClear: (data) => {
      console.log('Cleared! Previous:', data.previousValue);
    }
  }
}).create();`}
          options={{
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
