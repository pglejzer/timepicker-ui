"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { CheckCircle2 } from "lucide-react";

export default function WithCallbacksPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          With Callbacks
        </h1>
        <p className="text-lg text-muted-foreground">
          Handle time selection with callback functions
        </p>
      </div>

      <Section icon={CheckCircle2} title="onConfirm Callback">
        <p className="text-muted-foreground mb-4">
          Execute code when user confirms time selection:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Confirm Handler
            </h3>
            <p className="text-sm text-muted-foreground">
              Shows alert with selected time
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Select time"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                onConfirm={(data) => {
                  alert(`Selected: ${data.hour}:${data.minutes} ${data.type}`);
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      placeholder="Select time"
      onConfirm={(data) => {
        alert(\`Selected: \${data.hour}:\${data.minutes} \${data.type}\`);
      }}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={CheckCircle2} title="Multiple Callbacks">
        <p className="text-muted-foreground mb-4">Listen to multiple events:</p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Open, Confirm, Cancel
            </h3>
            <p className="text-sm text-muted-foreground">
              Check console (F12) for event logs
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Open console (F12)"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                onOpen={(data) => console.log("Opened:", data)}
                onConfirm={(data) => console.log("Confirmed:", data)}
                onCancel={() => console.log("Cancelled")}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      onOpen={(data) => console.log("Opened:", data)}
      onConfirm={(data) => console.log("Confirmed:", data)}
      onCancel={() => console.log("Cancelled")}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
