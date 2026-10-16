"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function WithCallbacksPage() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <PageHeader
        title="With Callbacks"
        description="Handle time selection with callback functions"
      />

      <Section title="onConfirm Callback">
        <p>
          Execute code when user confirms time selection:
        </p>
        <h3>Confirm Handler</h3>
        <p>Shows the selected time below the field</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  return (
    <div>
      <Timepicker
        placeholder="Select time"
        onConfirm={(data) => {
          setMessage(\`Selected: \${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      <p role="status">{message}</p>
    </div>
  );
}`}
          language="tsx"
        >
          <div className={demo.form}>
            <Timepicker
              placeholder="Select time"
              className={demo.input}
              onConfirm={(data) => {
                setMessage(`Selected: ${data.hour}:${data.minutes} ${data.type}`);
              }}
            />
            <p role="status" aria-live="polite" className={demo.output}>
              {message}
            </p>
          </div>
        </Figure>
      </Section>

      <Section title="Multiple Callbacks">
        <p>Listen to multiple events:</p>
        <h3>Open, Confirm, Cancel</h3>
        <p>Check console (F12) for event logs</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      onOpen={(data) => console.log("Opened:", data)}
      onConfirm={(data) => console.log("Confirmed:", data)}
      onCancel={() => console.log("Cancelled")}
    />
  );
}`}
          language="tsx"
        >
          <Timepicker
            placeholder="Open console (F12)"
            className={demo.input}
            onOpen={(data) => console.log("Opened:", data)}
            onConfirm={(data) => console.log("Confirmed:", data)}
            onCancel={() => console.log("Cancelled")}
          />
        </Figure>
      </Section>
    </div>
  );
}
