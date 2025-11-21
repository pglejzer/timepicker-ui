"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Edit } from "lucide-react";

export default function EditablePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Editable Input
        </h1>
        <p className="text-lg text-muted-foreground">
          Allow manual input editing
        </p>
      </div>

      <Section icon={Edit} title="Enable Editable">
        <p className="text-muted-foreground mb-4">
          Allow users to manually type time:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { editable: true }
});
picker.create();`}
          options={{
            ui: { editable: true },
          }}
        />
      </Section>

      <Section icon={Edit} title="Editable with 24h">
        <TimepickerExample
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

      <Section icon={Edit} title="Editable with Validation">
        <p className="text-muted-foreground mb-4">
          Validate manually entered time with error callback:
        </p>
        <TimepickerExample
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
