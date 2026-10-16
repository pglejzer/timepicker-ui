"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function FocusTrapPage() {
  return (
    <div>
      <PageHeader
        title="Focus Trap"
        description="Control focus behavior for accessibility"
      />

      <Section title="Enable Focus Trap (Default)">
        <p>
          Keep focus within modal for accessibility:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  behavior: { focusTrap: true } // This is the default
});
picker.create();`}
          options={{
            behavior: { focusTrap: true },
          }}
        />
      </Section>

      <Section title="Disable Focus Trap">
        <p>
          Allow focus to move outside modal:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  behavior: { focusTrap: false }
});
picker.create();`}
          options={{
            behavior: { focusTrap: false },
          }}
        />
      </Section>

      <Section title="Return Focus After Close">
        <p>
          Return focus to the input after closing the modal with{" "}
          <code>behavior.returnFocus</code>:
        </p>
        <TimepickerExample
          display="field"
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

      <Section title="Complete Accessibility Setup">
        <p>
          Recommended accessibility configuration:
        </p>
        <TimepickerExample
          display="field"
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
