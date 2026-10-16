"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { ApiTable } from "@/components/api-table";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function OnUpdatePage() {
  const [liveTime, setLiveTime] = useState("");

  return (
    <div>
      <PageHeader
        title="onUpdate Event"
        description="React to every time change in real-time"
      />

      <Section title="Live Updates">
        <p>
          The <code>onUpdate</code> event fires on every time change:
        </p>
        <h3>Real-time Updates</h3>
        <p>See changes as you select hours and minutes</p>
        <Figure
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
        >
          <div className={demo.form}>
            <Timepicker
              placeholder="Select time"
              className={demo.input}
              onUpdate={(data) => {
                setLiveTime(
                  `${data.hour}:${data.minutes} ${data.type || ""}`
                );
              }}
            />
            <p className={demo.output} aria-live="polite">
              <strong>Live value:</strong> {liveTime || "Not selected"}
            </p>
          </div>
        </Figure>
      </Section>

      <Section title="onUpdate vs onConfirm">
        <p>
          Choose the right event for your use case:
        </p>
        <ApiTable
          columns={[
            { key: "event", label: "Event" },
            { key: "when", label: "When it fires" },
            { key: "useCase", label: "Use case" },
          ]}
          rows={[
            {
              event: <code>onUpdate</code>,
              when: "Every time change",
              useCase: "Live preview, real-time sync",
            },
            {
              event: <code>onConfirm</code>,
              when: "OK button click",
              useCase: "Form submission, final value",
            },
          ]}
          rowKey="event"
        />
      </Section>
    </div>
  );
}
