"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Lock } from "lucide-react";

export default function DisabledPage() {
  return (
    <div>
      <PageHeader
        title="Disabled Input"
        description="Disabled state styling and behavior"
        eyebrow="React · Features"
      />

      <Section icon={Lock} title="Disabled Timepicker">
        <p className="text-muted-foreground mb-4">
          Use the disabled prop to prevent interaction:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Disabled State
            </h3>
            <p className="text-sm text-muted-foreground">
              Picker cannot be opened
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Disabled"
                disabled
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      placeholder="Disabled"
      disabled
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Lock} title="Conditional Disable">
        <p className="text-muted-foreground mb-4">
          Dynamically enable/disable based on state:
        </p>
        <CodeBlock
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
        Enable timepicker
      </label>

      <Timepicker
        disabled={!isEnabled}
      />
    </div>
  );
}`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
