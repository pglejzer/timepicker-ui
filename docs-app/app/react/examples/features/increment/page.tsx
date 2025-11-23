"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Clock3 } from "lucide-react";

export default function IncrementPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Increment Steps
        </h1>
        <p className="text-lg text-muted-foreground">
          Allow only specific minute intervals
        </p>
      </div>

      <Section icon={Clock3} title="15-Minute Intervals">
        <p className="text-muted-foreground mb-4">
          Restrict minute selection to 15-minute increments:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              15-Minute Steps
            </h3>
            <p className="text-sm text-muted-foreground">
              Only 00, 15, 30, 45 available
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="15-min intervals"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  clock: { incrementMinutes: 15 },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        clock: { incrementMinutes: 15 }
      }}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Clock3} title="30-Minute Intervals">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="30-min intervals"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  clock: { incrementMinutes: 30 },
                }}
              />
            </div>
            <CodeBlock
              code={`<Timepicker
  options={{
    clock: { incrementMinutes: 30 }
  }}
/>`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Clock3} title="Use Cases">
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Appointment scheduling (15 or 30-minute slots)</li>
          <li>Meeting duration selection</li>
          <li>Business hours with fixed time slots</li>
          <li>Simplified time selection for users</li>
        </ul>
      </Section>
    </div>
  );
}
