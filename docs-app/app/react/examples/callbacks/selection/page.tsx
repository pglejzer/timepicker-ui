"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { MousePointer } from "lucide-react";
import { useState } from "react";

export default function SelectionEventsPage() {
  const [lastHour, setLastHour] = useState("");
  const [lastMinute, setLastMinute] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Selection Events
        </h1>
        <p className="text-lg text-muted-foreground">
          Track hour, minute, and AM/PM selections
        </p>
      </div>

      <Section icon={MousePointer} title="Individual Selection Callbacks">
        <p className="text-muted-foreground mb-4">
          Listen to specific selection events:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Selection Tracking
            </h3>
            <p className="text-sm text-muted-foreground">
              See individual hour/minute selections
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <Timepicker
                placeholder="Select time"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                onSelectHour={(data) => setLastHour(data.hour)}
                onSelectMinute={(data) => setLastMinute(data.minutes)}
                onSelectAM={() => setPeriod("AM")}
                onSelectPM={() => setPeriod("PM")}
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Hour</p>
                  <p className="text-lg font-semibold">{lastHour || "-"}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Minute</p>
                  <p className="text-lg font-semibold">{lastMinute || "-"}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Period</p>
                  <p className="text-lg font-semibold">{period || "-"}</p>
                </div>
              </div>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [lastHour, setLastHour] = useState("");
  const [lastMinute, setLastMinute] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <Timepicker
      onSelectHour={(data) => setLastHour(data.hour)}
      onSelectMinute={(data) => setLastMinute(data.minutes)}
      onSelectAM={() => setPeriod("AM")}
      onSelectPM={() => setPeriod("PM")}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={MousePointer} title="Event Data Structure">
        <CodeBlock
          code={`// onSelectHour
interface HourSelectData {
  hour: string;
  degreesHours: number;
}

// onSelectMinute
interface MinuteSelectData {
  minutes: string;
  degreesMinutes: number;
}

// onSelectAM, onSelectPM
// No parameters - just fires when clicked`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
