"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Focus } from "lucide-react";

export default function FocusTrapPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Focus Trap
        </h1>
        <p className="text-lg text-muted-foreground">
          Control focus behavior for accessibility
        </p>
      </div>

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

      <Section icon={Focus} title="Focus Input After Close">
        <p className="text-muted-foreground mb-4">
          Return focus to input after closing modal:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  behavior: {
    focusTrap: true,
    focusInputAfterClose: true
  }
});
picker.create();`}
          options={{
            behavior: {
              focusTrap: true,
              focusInputAfterClose: true,
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
    focusInputAfterClose: true
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
              focusInputAfterClose: true,
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
