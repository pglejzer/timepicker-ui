"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Zap } from "lucide-react";

export default function NoAnimationPage() {
  return (
    <div>
      <PageHeader
        title="Without Animation"
        description="Disable animations for instant timepicker display"
        eyebrow="Example · Basic"
      />

      <Section icon={Zap} title="Disable Animation">
        <p className="text-muted-foreground mb-4">
          With <code>ui.animation: false</code> the picker opens and closes at
          once, with no fade. When the system asks for reduced motion (
          <code>prefers-reduced-motion</code>), the picker does the same
          without this option.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: { animation: false }
});
picker.create();`}
          options={{
            ui: { animation: false },
          }}
        />
      </Section>

      <Section icon={Zap} title="Performance Mode">
        <p className="text-muted-foreground mb-4">
          No fade and no backdrop. <code>behavior.delayHandler</code> is{" "}
          <code>0</code> by default, so the picker starts to close as soon as
          you press OK or Cancel. Set it only if you need an extra wait before
          closing.
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    animation: false,
    backdrop: false
  }
});
picker.create();`}
          options={{
            ui: {
              animation: false,
              backdrop: false,
            },
          }}
        />
      </Section>

      <Section icon={Zap} title="No Animation with Theme">
        <p className="text-muted-foreground mb-4">
          Disable animation while keeping theme styles:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    animation: false,
    theme: 'cyberpunk',
    backdrop: true
  }
});
picker.create();`}
          options={{
            ui: {
              animation: false,
              theme: "cyberpunk",
              backdrop: true,
            },
          }}
        />
      </Section>

      <Section icon={Zap} title="Accessibility First">
        <p className="text-muted-foreground mb-4">
          Disable animations while maintaining accessibility features:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  ui: {
    animation: false,
    backdrop: true
  },
  behavior: {
    focusTrap: true,
    returnFocus: true
  }
});
picker.create();`}
          options={{
            ui: {
              animation: false,
              backdrop: true,
            },
            behavior: {
              focusTrap: true,
              returnFocus: true,
            },
          }}
        />
      </Section>
    </div>
  );
}
