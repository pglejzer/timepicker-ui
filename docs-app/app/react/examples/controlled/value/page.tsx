"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Code2 } from "lucide-react";
import { useState } from "react";

export default function ControlledValuePage() {
  const [time, setTime] = useState("12:00 PM");

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Controlled Value
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage timepicker value with React state
        </p>
      </div>

      <Section icon={Code2} title="Controlled Component">
        <p className="text-muted-foreground mb-4">
          Use the{" "}
          <code className="text-sm bg-muted px-1 py-0.5 rounded">value</code>{" "}
          prop to control the timepicker:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Controlled Timepicker
            </h3>
            <p className="text-sm text-muted-foreground">
              Value is managed by React state
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <Timepicker
                value={time}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                onUpdate={(data) => {
                  setTime(`${data.hour}:${data.minutes} ${data.type}`);
                }}
              />
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <strong>Current value:</strong> {time}
                </p>
              </div>
              <button
                onClick={() => setTime("3:30 PM")}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
              >
                Set to 3:30 PM
              </button>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [time, setTime] = useState("12:00 PM");

  return (
    <div>
      <Timepicker
        value={time}
        onUpdate={(data) => {
          setTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      <p>Current value: {time}</p>
      <button onClick={() => setTime("3:30 PM")}>
        Set to 3:30 PM
      </button>
    </div>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Code2} title="Key Points">
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Use{" "}
            <code className="text-sm bg-muted px-1 py-0.5 rounded">value</code>{" "}
            prop to control the input
          </li>
          <li>
            Use{" "}
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              onUpdate
            </code>{" "}
            to sync state on every change
          </li>
          <li>
            Use{" "}
            <code className="text-sm bg-muted px-1 py-0.5 rounded">
              onConfirm
            </code>{" "}
            to sync state only on confirm
          </li>
          <li>The component handles internal state synchronization</li>
        </ul>
      </Section>
    </div>
  );
}
