"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Zap } from "lucide-react";

export default function NoAnimationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Without Animation
        </h1>
        <p className="text-lg text-muted-foreground">
          Disable animations for instant timepicker display
        </p>
      </div>

      <Section icon={Zap} title="Disable Animation">
        <p className="text-muted-foreground mb-4">
          Turn off animations for faster display:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  animation: false
});
picker.create();`}
          options={{
            animation: false,
          }}
        />
      </Section>

      <Section icon={Zap} title="Performance Mode">
        <p className="text-muted-foreground mb-4">
          Optimize for performance with minimal effects:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  animation: false,
  backdrop: false,
  delayHandler: 0
});
picker.create();`}
          options={{
            animation: false,
            backdrop: false,
            delayHandler: 0,
          }}
        />
      </Section>

      <Section icon={Zap} title="No Animation with Theme">
        <p className="text-muted-foreground mb-4">
          Disable animation while keeping theme styles:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  animation: false,
  theme: 'cyberpunk',
  backdrop: true
});
picker.create();`}
          options={{
            animation: false,
            theme: "cyberpunk",
            backdrop: true,
          }}
        />
      </Section>

      <Section icon={Zap} title="Accessibility First">
        <p className="text-muted-foreground mb-4">
          Disable animations while maintaining accessibility features:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  animation: false,
  focusTrap: true,
  focusInputAfterCloseModal: true,
  backdrop: true
});
picker.create();`}
          options={{
            animation: false,
            focusTrap: true,
            focusInputAfterCloseModal: true,
            backdrop: true,
          }}
        />
      </Section>
    </div>
  );
}
