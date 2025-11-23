"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function OnConfirmPage() {
  const [confirmedTime, setConfirmedTime] = useState("");

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          onConfirm
        </h1>
        <p className="text-lg text-muted-foreground">
          Handle time confirmation when user clicks OK
        </p>
      </div>

      <Section icon={CheckCircle2} title="Confirm Callback">
        <p className="text-muted-foreground mb-4">
          The onConfirm event fires when user clicks the OK button:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Confirmation Handler
            </h3>
            <p className="text-sm text-muted-foreground">
              Only saves value when confirmed
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <Timepicker
                placeholder="Select and confirm time"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                onConfirm={(data) => {
                  setConfirmedTime(`${data.hour}:${data.minutes} ${data.type}`);
                }}
              />
              {confirmedTime && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✅ Confirmed: <strong>{confirmedTime}</strong>
                  </p>
                </div>
              )}
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [confirmedTime, setConfirmedTime] = useState("");

  return (
    <div>
      <Timepicker
        onConfirm={(data) => {
          setConfirmedTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      {confirmedTime && <p>Confirmed: {confirmedTime}</p>}
    </div>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={CheckCircle2} title="Event Data">
        <p className="text-muted-foreground mb-4">
          The onConfirm callback receives an object with selected time:
        </p>
        <CodeBlock
          code={`interface ConfirmEventData {
  hour: string;        // e.g., "3", "15"
  minutes: string;     // e.g., "30", "00"
  type?: "AM" | "PM";  // Only in 12h mode
  degreesHours: number;
  degreesMinutes: number;
}

onConfirm={(data) => {
  console.log(data.hour);     // "3"
  console.log(data.minutes);  // "30"
  console.log(data.type);     // "PM"
}}`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
