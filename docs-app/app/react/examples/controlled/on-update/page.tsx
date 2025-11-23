"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export default function OnUpdatePage() {
  const [liveTime, setLiveTime] = useState("");

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          onUpdate Event
        </h1>
        <p className="text-lg text-muted-foreground">
          React to every time change in real-time
        </p>
      </div>

      <Section icon={RefreshCw} title="Live Updates">
        <p className="text-muted-foreground mb-4">
          The{" "}
          <code className="text-sm bg-muted px-1 py-0.5 rounded">onUpdate</code>{" "}
          event fires on every time change:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Real-time Updates
            </h3>
            <p className="text-sm text-muted-foreground">
              See changes as you select hours and minutes
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <Timepicker
                placeholder="Select time"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                onUpdate={(data) => {
                  setLiveTime(
                    `${data.hour}:${data.minutes} ${data.type || ""}`
                  );
                }}
              />
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <strong>Live value:</strong> {liveTime || "Not selected"}
                </p>
              </div>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [liveTime, setLiveTime] = useState("");

  return (
    <div>
      <Timepicker
        onUpdate={(data) => {
          setLiveTime(\`\${data.hour}:\${data.minutes} \${data.type || ""}\`);
        }}
      />
      <p>Live value: {liveTime}</p>
    </div>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={RefreshCw} title="onUpdate vs onConfirm">
        <p className="text-muted-foreground mb-4">
          Choose the right event for your use case:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4">Event</th>
                <th className="text-left py-2 pr-4">When it fires</th>
                <th className="text-left py-2">Use case</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    onUpdate
                  </code>
                </td>
                <td className="py-2 pr-4">Every time change</td>
                <td className="py-2">Live preview, real-time sync</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    onConfirm
                  </code>
                </td>
                <td className="py-2 pr-4">OK button click</td>
                <td className="py-2">Form submission, final value</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
