"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Clock } from "lucide-react";

export default function GettingStartedPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Getting Started
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple example to start using timepicker-ui-react
        </p>
      </div>

      <Section icon={Clock} title="Basic Usage">
        <p className="text-muted-foreground mb-4">
          The simplest way to create a timepicker with default settings:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Basic Timepicker
            </h3>
            <p className="text-sm text-muted-foreground">
              Default 12-hour format with AM/PM
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Select time"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

function App() {
  return (
    <Timepicker
      placeholder="Select time"
      className="px-4 py-2 rounded-lg border"
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Clock} title="Installation">
        <p className="text-muted-foreground mb-4">
          Install the package and import required styles:
        </p>
        <CodeBlock
          code={`# Install timepicker-ui-react
npm install timepicker-ui-react

# Import in your component
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";`}
          language="bash"
        />
      </Section>

      <Section icon={Clock} title="Props">
        <p className="text-muted-foreground mb-4">
          The component extends standard HTML input attributes:
        </p>
        <CodeBlock
          code={`<Timepicker
  // Standard input props
  placeholder="Select time"
  className="custom-class"
  disabled={false}
  required
  name="appointment-time"
  
  // Timepicker-specific props
  value="12:00 PM"
  defaultValue="9:00 AM"
  options={{
    clock: { type: "12h" },
    ui: { theme: "basic" }
  }}
/>`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
