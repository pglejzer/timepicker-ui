"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Layers } from "lucide-react";
import { useState } from "react";

export default function MultiplePickersPage() {
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Multiple Pickers
        </h1>
        <p className="text-lg text-muted-foreground">
          Use multiple timepickers with independent state
        </p>
      </div>

      <Section icon={Layers} title="Independent Pickers">
        <p className="text-muted-foreground mb-4">
          Each timepicker manages its own state:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Time Range Selector
            </h3>
            <p className="text-sm text-muted-foreground">
              Start and end time with separate state
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <Timepicker
                  value={startTime}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  onUpdate={(data) => {
                    setStartTime(`${data.hour}:${data.minutes} ${data.type}`);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <Timepicker
                  value={endTime}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  onUpdate={(data) => {
                    setEndTime(`${data.hour}:${data.minutes} ${data.type}`);
                  }}
                />
              </div>
              <div className="rounded-lg bg-muted p-4 space-y-1">
                <p className="text-sm">
                  <strong>Start:</strong> {startTime}
                </p>
                <p className="text-sm">
                  <strong>End:</strong> {endTime}
                </p>
              </div>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");

  return (
    <div>
      <label>Start Time</label>
      <Timepicker
        value={startTime}
        onUpdate={(data) => {
          setStartTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />

      <label>End Time</label>
      <Timepicker
        value={endTime}
        onUpdate={(data) => {
          setEndTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      
      <p>Range: {startTime} - {endTime}</p>
    </div>
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
