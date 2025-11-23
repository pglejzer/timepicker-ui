"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Clock } from "lucide-react";

export default function Format24hPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          24h Format
        </h1>
        <p className="text-lg text-muted-foreground">
          Use 24-hour clock format instead of 12-hour with AM/PM
        </p>
      </div>

      <Section icon={Clock} title="24-Hour Clock">
        <p className="text-muted-foreground mb-4">
          Configure timepicker to use 24-hour format:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              24h Format
            </h3>
            <p className="text-sm text-muted-foreground">Hours from 00 to 23</p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Select time (24h)"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  clock: { type: "24h" },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      placeholder="Select time (24h)"
      options={{
        clock: { type: "24h" }
      }}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Clock} title="With Auto-Switch">
        <p className="text-muted-foreground mb-4">
          Automatically switch to minutes after selecting hour:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Auto-Switch to Minutes
            </h3>
            <p className="text-sm text-muted-foreground">
              Improves user experience
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Select time"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  clock: {
                    type: "24h",
                    autoSwitchToMinutes: true,
                  },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        clock: {
          type: "24h",
          autoSwitchToMinutes: true
        }
      }}
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
