"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";

export default function BackdropPage() {
  return (
    <div>
      <PageHeader
        title="Backdrop"
        description="Control backdrop overlay behavior"
      />

      <Section title="With Backdrop (Default)">
        <p>
          Backdrop is enabled by default and darkens the background:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: { backdrop: true } // This is the default
});
picker.create();`}
          options={{
            ui: { backdrop: true },
          }}
        />
      </Section>

      <Section title="Without Backdrop">
        <p>
          Disable backdrop to keep background visible:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: { backdrop: false }
});
picker.create();`}
          options={{
            ui: { backdrop: false },
          }}
        />
      </Section>

      <Section title="Backdrop with Scroll">
        <p>
          Let the page scroll while the backdrop is visible:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: {
    backdrop: true,
    allowPageScroll: true
  }
});
picker.create();`}
          options={{
            ui: {
              backdrop: true,
              allowPageScroll: true,
            },
          }}
        />
      </Section>

      <Section title="Backdrop with Focus Trap">
        <p>
          Combine backdrop with focus trap for better accessibility:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: {
    backdrop: true
  },
  behavior: {
    focusTrap: true,
    returnFocus: true
  }
});
picker.create();`}
          options={{
            ui: { backdrop: true },
            behavior: {
              focusTrap: true,
              returnFocus: true,
            },
          }}
        />
      </Section>

      <Section title="No Backdrop, No Animation">
        <p>
          Minimal setup without backdrop and animations:
        </p>
        <TimepickerExample
          display="field"
          code={`const picker = new TimepickerUI(input, {
  ui: {
    backdrop: false,
    animation: false
  }
});
picker.create();`}
          options={{
            ui: {
              backdrop: false,
              animation: false,
            },
          }}
        />
      </Section>
    </div>
  );
}
