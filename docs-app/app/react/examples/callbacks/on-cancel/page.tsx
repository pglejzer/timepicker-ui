"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { X } from "lucide-react";
import { useState } from "react";

export default function OnCancelPage() {
  const [cancelCount, setCancelCount] = useState(0);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          onCancel
        </h1>
        <p className="text-lg text-muted-foreground">
          Handle cancellation when user closes the picker
        </p>
      </div>

      <Section icon={X} title="Cancel Callback">
        <p className="text-muted-foreground mb-4">
          The onCancel event fires when user clicks Cancel or backdrop:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Cancellation Handler
            </h3>
            <p className="text-sm text-muted-foreground">
              Tracks how many times picker was cancelled
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <Timepicker
                placeholder="Try cancelling"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                onCancel={() => {
                  setCancelCount((prev) => prev + 1);
                }}
              />
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm">
                  <strong>Cancelled:</strong> {cancelCount}{" "}
                  {cancelCount === 1 ? "time" : "times"}
                </p>
              </div>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [cancelCount, setCancelCount] = useState(0);

  return (
    <div>
      <Timepicker
        onCancel={() => {
          setCancelCount((prev) => prev + 1);
        }}
      />
      <p>Cancelled: {cancelCount} times</p>
    </div>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={X} title="Use Cases">
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Revert form changes</li>
          <li>Track user behavior analytics</li>
          <li>Reset temporary state</li>
          <li>Show "selection cancelled" message</li>
        </ul>
      </Section>
    </div>
  );
}
