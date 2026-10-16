"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ApiTable } from "@/components/api-table";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";
import styles from "./page.module.css";

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
      <PageHeader
        title="All Events"
        description="Listen to all available timepicker events"
      />

      <Section title="Complete Event Handling">
        <p>
          All events are logged below in real-time:
        </p>
        <h3>All Callbacks</h3>
        <p>Every interaction triggers a callback</p>
        <Figure
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
        >
          <div className={styles.demo}>
            <Timepicker
              placeholder="Select time to see events"
              className={demo.input}
              onOpen={(data) =>
                addLog(`[open] Opened: ${JSON.stringify(data)}`)
              }
              onConfirm={(data) =>
                addLog(
                  `[confirm] Confirmed: ${data.hour}:${data.minutes} ${data.type}`,
                )
              }
              onCancel={() => addLog("[cancel] Cancelled")}
              onUpdate={(data) =>
                addLog(
                  `[update] Updated: ${data.hour}:${data.minutes} ${data.type}`,
                )
              }
              onSelectHour={(data) =>
                addLog(`[hour] Hour selected: ${data.hour}`)
              }
              onSelectMinute={(data) =>
                addLog(`[minute] Minute selected: ${data.minutes}`)
              }
              onSelectAM={() => addLog("[am] AM selected")}
              onSelectPM={() => addLog("[pm] PM selected")}
            />

            <div className={styles.log}>
              <div className={styles.head}>
                <h4>Event Log</h4>
                {logs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setLogs([])}
                    className={demo.buttonSecondary}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div
                role="log"
                aria-label="Event Log"
                tabIndex={0}
                className={`${demo.output} ${styles.entries}`}
              >
                {logs.length === 0 ? (
                  <div className={demo.hint}>
                    No events yet. Interact with the timepicker above.
                  </div>
                ) : (
                  <div>
                    {logs.map((log) => (
                      <div key={log}>{log}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Figure>
      </Section>

      <Section title="Available Events">
        <ApiTable
          columns={[
            { key: "event", label: "Event" },
            { key: "description", label: "Description" },
          ]}
          rows={[
            { event: "onOpen", description: "Timepicker modal opened" },
            { event: "onConfirm", description: "OK button clicked" },
            {
              event: "onCancel",
              description: "Cancel button or backdrop clicked",
            },
            { event: "onUpdate", description: "Time value changed" },
            { event: "onSelectHour", description: "Hour selected on clock" },
            {
              event: "onSelectMinute",
              description: "Minute selected on clock",
            },
            {
              event: "onSelectAM",
              description: "AM button clicked (12h mode)",
            },
            {
              event: "onSelectPM",
              description: "PM button clicked (12h mode)",
            },
          ]}
          rowKey="event"
        />
      </Section>
    </div>
  );
}
