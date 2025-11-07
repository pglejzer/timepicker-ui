"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Bot } from "lucide-react";

export default function AIThemePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          AI Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Futuristic AI-inspired theme with modern aesthetics
        </p>
      </div>

      <Section icon={Bot} title="AI Theme">
        <p className="text-muted-foreground mb-4">
          Futuristic theme inspired by AI interfaces:
        </p>
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'ai'
});
picker.create();`}
          options={{
            theme: "ai",
          }}
        />
      </Section>

      <Section icon={Bot} title="AI with 12h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'ai',
  clockType: '12h'
});
picker.create();`}
          options={{
            theme: "ai",
            clockType: "12h",
          }}
        />
      </Section>

      <Section icon={Bot} title="AI with 24h">
        <TimepickerExample
          code={`const picker = new TimepickerUI(input, {
  theme: 'ai',
  clockType: '24h'
});
picker.create();`}
          options={{
            theme: "ai",
            clockType: "24h",
          }}
        />
      </Section>
    </div>
  );
}
