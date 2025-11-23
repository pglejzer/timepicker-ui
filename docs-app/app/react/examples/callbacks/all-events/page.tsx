"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Zap } from "lucide-react";
import { useState } from "react";

export default function AllEventsPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} - ${message}`,
    ]);
  };

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          All Events
        </h1>
        <p className="text-lg text-muted-foreground">
          Listen to all available timepicker events
        </p>
      </div>

      <Section icon={Zap} title="Complete Event Handling">
        <p className="text-muted-foreground mb-4">
          All events are logged below in real-time:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              All Callbacks
            </h3>
            <p className="text-sm text-muted-foreground">
              Every interaction triggers a callback
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6 space-y-4">
              <Timepicker
                placeholder="Select time to see events"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                onOpen={(data) => addLog(`📂 Opened: ${JSON.stringify(data)}`)}
                onConfirm={(data) =>
                  addLog(
                    `✅ Confirmed: ${data.hour}:${data.minutes} ${data.type}`
                  )
                }
                onCancel={() => addLog("❌ Cancelled")}
                onUpdate={(data) =>
                  addLog(
                    `🔄 Updated: ${data.hour}:${data.minutes} ${data.type}`
                  )
                }
                onSelectHour={(data) =>
                  addLog(`🕐 Hour selected: ${data.hour}`)
                }
                onSelectMinute={(data) =>
                  addLog(`🕑 Minute selected: ${data.minutes}`)
                }
                onSelectAM={() => addLog("🌅 AM selected")}
                onSelectPM={() => addLog("🌆 PM selected")}
              />

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold">Event Log</h4>
                  {logs.length > 0 && (
                    <button
                      onClick={() => setLogs([])}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="rounded bg-background p-3 max-h-64 overflow-y-auto font-mono text-xs">
                  {logs.length === 0 ? (
                    <div className="text-muted-foreground italic">
                      No events yet. Interact with the timepicker above.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div key={index} className="text-foreground">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      onOpen={(data) => console.log("Opened:", data)}
      onConfirm={(data) => console.log("Confirmed:", data)}
      onCancel={() => console.log("Cancelled")}
      onUpdate={(data) => console.log("Updated:", data)}
      onSelectHour={(data) => console.log("Hour:", data)}
      onSelectMinute={(data) => console.log("Minute:", data)}
      onSelectAM={() => console.log("AM selected")}
      onSelectPM={() => console.log("PM selected")}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Zap} title="Available Events">
        <div className="rounded-lg border border-border bg-card p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4">Event</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onOpen</td>
                <td className="py-2">Timepicker modal opened</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onConfirm</td>
                <td className="py-2">OK button clicked</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onCancel</td>
                <td className="py-2">Cancel button or backdrop clicked</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onUpdate</td>
                <td className="py-2">Time value changed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onSelectHour</td>
                <td className="py-2">Hour selected on clock</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onSelectMinute</td>
                <td className="py-2">Minute selected on clock</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 font-mono text-xs">onSelectAM</td>
                <td className="py-2">AM button clicked (12h mode)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">onSelectPM</td>
                <td className="py-2">PM button clicked (12h mode)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
