"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Sparkles } from "lucide-react";

export default function BackdropPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Backdrop
        </h1>
        <p className="text-lg text-muted-foreground">
          Control backdrop overlay behavior
        </p>
      </div>

      <Section icon={Sparkles} title="With Backdrop (Default)">
        <p className="text-muted-foreground mb-4">
          Backdrop is enabled by default and darkens the background:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { backdrop: true } // This is the default
});
picker.create();`}
          options={{
            ui: { backdrop: true },
          }}
        />
      </Section>

      <Section icon={Sparkles} title="Without Backdrop">
        <p className="text-muted-foreground mb-4">
          Disable backdrop to keep background visible:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { backdrop: false }
});
picker.create();`}
          options={{
            ui: { backdrop: false },
          }}
        />
      </Section>

      <Section icon={Sparkles} title="Backdrop with Scroll">
        <p className="text-muted-foreground mb-4">
          Enable scrollbar while backdrop is visible:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    backdrop: true,
    enableScrollbar: true
  }
});
picker.create();`}
          options={{
            ui: {
              backdrop: true,
              enableScrollbar: true,
            },
          }}
        />
      </Section>

      <Section icon={Sparkles} title="Backdrop with Focus Trap">
        <p className="text-muted-foreground mb-4">
          Combine backdrop with focus trap for better accessibility:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    backdrop: true
  },
  behavior: {
    focusTrap: true,
    focusInputAfterClose: true
  }
});
picker.create();`}
          options={{
            ui: { backdrop: true },
            behavior: {
              focusTrap: true,
              focusInputAfterClose: true,
            },
          }}
        />
      </Section>

      <Section icon={Sparkles} title="No Backdrop, No Animation">
        <p className="text-muted-foreground mb-4">
          Minimal setup without backdrop and animations:
        </p>
        <TimepickerExample
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
