"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function MultiplePickersPage() {
  const [startTime, setStartTime] = useState("9:00 AM");
  const [endTime, setEndTime] = useState("5:00 PM");

  return (
    <div>
      <PageHeader
        title="Multiple Pickers"
        description="Use multiple timepickers with independent state"
      />

      <Section title="Independent Pickers">
        <p>
          Each timepicker manages its own state:
        </p>
        <h3>Time Range Selector</h3>
        <p>Start and end time with separate state</p>
        <Figure
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
        >
          <div className={demo.form}>
            <div className={demo.field}>
              <label htmlFor="multiple-start-time" className={demo.label}>
                Start Time
              </label>
              <Timepicker
                id="multiple-start-time"
                value={startTime}
                className={demo.input}
                onUpdate={(data) => {
                  setStartTime(`${data.hour}:${data.minutes} ${data.type}`);
                }}
              />
            </div>
            <div className={demo.field}>
              <label htmlFor="multiple-end-time" className={demo.label}>
                End Time
              </label>
              <Timepicker
                id="multiple-end-time"
                value={endTime}
                className={demo.input}
                onUpdate={(data) => {
                  setEndTime(`${data.hour}:${data.minutes} ${data.type}`);
                }}
              />
            </div>
            <div className={demo.output} aria-live="polite">
              <p>
                <strong>Start:</strong> {startTime}
              </p>
              <p>
                <strong>End:</strong> {endTime}
              </p>
            </div>
          </div>
        </Figure>
      </Section>
    </div>
  );
}
