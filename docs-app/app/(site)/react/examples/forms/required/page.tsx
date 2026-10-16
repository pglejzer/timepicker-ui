"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function RequiredPage() {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Submitted: ${time}`);
  };

  return (
    <div>
      <PageHeader
        title="Required Field"
        description="Use HTML5 required attribute for validation"
      />

      <Section title="Required Input">
        <p>
          Add required attribute for browser validation:
        </p>
        <h3>Required Field</h3>
        <p>Try submitting without selecting time</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setMessage(\`Submitted: \${time}\`);
    }}>
      <Timepicker
        name="time"
        required
        value={time}
        onUpdate={(data) => {
          setTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      <button type="submit">Submit</button>
      <p role="status">{message}</p>
    </form>
  );
}`}
          language="tsx"
        >
          <form onSubmit={handleSubmit} className={demo.form}>
            <div className={demo.field}>
              <label htmlFor="required-time" className={demo.label}>
                Time *
              </label>
              <Timepicker
                id="required-time"
                name="appointment-time"
                placeholder="Required field"
                required
                value={time}
                className={demo.input}
                onUpdate={(data) => {
                  setTime(`${data.hour}:${data.minutes} ${data.type}`);
                }}
              />
            </div>
            <button type="submit" className={demo.button}>
              Submit
            </button>
            <p role="status" aria-live="polite" className={demo.output}>
              {message}
            </p>
          </form>
        </Figure>
      </Section>

      <Section title="HTML5 Attributes">
        <p>
          Timepicker supports all standard input attributes:
        </p>
        <CodeBlock
          code={`<Timepicker
  name="appointment-time"
  required
  disabled={false}
  readOnly={false}
  placeholder="Select time"
/>`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
