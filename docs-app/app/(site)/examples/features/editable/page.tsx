"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function EditablePage() {
  return (
    <div>
      <PageHeader
        title="Editable Input"
        description="Allow manual input editing"
      />

      <Section title="Enable Editable">
        <p>
          Allow users to manually type time:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: { editable: true }
});
picker.create();`}
          options={{
            ui: { editable: true },
          }}
        />
      </Section>

      <Section title="Editable with 24h">
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: { editable: true },
  clock: { type: '24h' }
});
picker.create();`}
          options={{
            ui: { editable: true },
            clock: { type: "24h" },
          }}
        />
      </Section>

      <Section title="Editable with Validation">
        <p>
          Validate manually entered time with error callback:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: { editable: true },
  callbacks: {
    onError: (data) => {
      console.log('Invalid time:', data.error);
    }
  }
});
picker.create();`}
          options={{
            ui: { editable: true },
            callbacks: {
              onError: (data: { error?: string }) =>
                console.log("Invalid time:", data.error),
            },
          }}
        />
      </Section>
    </div>
  );
}
