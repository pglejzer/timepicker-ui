"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function ValidationPage() {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time) {
      setError("Time is required");
      return;
    }

    setError("");
    setMessage(`Form submitted with time: ${time}`);
  };

  return (
    <div>
      <PageHeader
        title="Form Validation"
        description="Validate timepicker input in forms"
      />

      <Section title="Custom Validation">
        <p>
          Implement custom validation logic:
        </p>
        <h3>Validated Form</h3>
        <p>Shows error if time is not selected</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!time) {
      setError("Time is required");
      return;
    }

    setError("");
    setMessage(\`Form submitted: \${time}\`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Timepicker
        value={time}
        className={error ? "border-red-500" : ""}
        onUpdate={(data) => {
          setTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
          setError("");
        }}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Submit</button>
      <p role="status">{message}</p>
    </form>
  );
}`}
          language="tsx"
        >
          <form onSubmit={handleSubmit} className={demo.form}>
            <div className={demo.field}>
              <label htmlFor="validation-time" className={demo.label}>
                Appointment Time *
              </label>
              <Timepicker
                id="validation-time"
                value={time}
                className={demo.input}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "validation-time-error" : undefined}
                onUpdate={(data) => {
                  setTime(`${data.hour}:${data.minutes} ${data.type}`);
                  setError("");
                }}
              />
              {error && (
                <p
                  id="validation-time-error"
                  role="alert"
                  className={demo.error}
                >
                  {error}
                </p>
              )}
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

      <Section title="Validation Scenarios">
        <ul>
          <li>Required field validation</li>
          <li>Time range validation (e.g., must be between 9 AM - 5 PM)</li>
          <li>Business hours validation</li>
          <li>Future time only validation</li>
        </ul>
      </Section>
    </div>
  );
}
