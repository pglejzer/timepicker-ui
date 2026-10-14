"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Focus } from "lucide-react";

export default function FocusTrapPage() {
  return (
    <div>
      <PageHeader
        title="Focus Trap"
        description="Control focus behavior for accessibility"
        eyebrow="Example · Features"
      />

      <Section icon={Focus} title="Enable Focus Trap (Default)">
        <p className="text-muted-foreground mb-4">
          Keep focus within modal for accessibility:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  behavior: { focusTrap: true } // This is the default
});
picker.create();`}
          options={{
            behavior: { focusTrap: true },
          }}
        />
      </Section>

      <Section icon={Focus} title="Disable Focus Trap">
        <p className="text-muted-foreground mb-4">
          Allow focus to move outside modal:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  behavior: { focusTrap: false }
});
picker.create();`}
          options={{
            behavior: { focusTrap: false },
          }}
        />
      </Section>

      <Section icon={Focus} title="Return Focus After Close">
        <p className="text-muted-foreground mb-4">
          Return focus to the input after closing the modal with{" "}
          <code>behavior.returnFocus</code>:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  behavior: {
    focusTrap: true,
    returnFocus: true
  }
});
picker.create();`}
          options={{
            behavior: {
              focusTrap: true,
              returnFocus: true,
            },
          }}
        />
      </Section>

      <Section icon={Focus} title="Complete Accessibility Setup">
        <p className="text-muted-foreground mb-4">
          Recommended accessibility configuration:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  behavior: {
    focusTrap: true,
    returnFocus: true
  },
  ui: {
    backdrop: true,
    animation: true
  }
});
picker.create();`}
          options={{
            behavior: {
              focusTrap: true,
              returnFocus: true,
            },
            ui: {
              backdrop: true,
              animation: true,
            },
          }}
        />
      </Section>
    </div>
  );
}
