"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function ControlledValuePage() {
  const [time, setTime] = useState("12:00 PM");

  return (
    <div>
      <PageHeader
        title="Controlled Value"
        description="Manage timepicker value with React state"
      />

      <Section title="Controlled Component">
        <p>
          Use the <code>value</code> prop to control the timepicker:
        </p>
        <h3>Controlled Timepicker</h3>
        <p>Value is managed by React state</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [time, setTime] = useState("12:00 PM");

  return (
    <div>
      <Timepicker
        value={time}
        onUpdate={(data) => {
          setTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      <p>Current value: {time}</p>
      <button onClick={() => setTime("3:30 PM")}>
        Set to 3:30 PM
      </button>
    </div>
  );
}`}
          language="tsx"
        >
          <div className={demo.form}>
            <Timepicker
              value={time}
              className={demo.input}
              onUpdate={(data) => {
                setTime(`${data.hour}:${data.minutes} ${data.type}`);
              }}
            />
            <p className={demo.output} aria-live="polite">
              <strong>Current value:</strong> {time}
            </p>
            <div className={demo.row}>
              <button
                type="button"
                onClick={() => setTime("3:30 PM")}
                className={demo.button}
              >
                Set to 3:30 PM
              </button>
            </div>
          </div>
        </Figure>
      </Section>

      <Section title="Key Points">
        <ul>
          <li>
            Use <code>value</code> prop to control the input
          </li>
          <li>
            Use <code>onUpdate</code> to sync state on every change
          </li>
          <li>
            Use <code>onConfirm</code> to sync state only on confirm
          </li>
          <li>The component handles internal state synchronization</li>
        </ul>
      </Section>
    </div>
  );
}
