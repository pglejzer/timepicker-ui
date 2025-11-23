"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { FileCheck } from "lucide-react";
import { useState } from "react";

export default function ValidationPage() {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time) {
      setError("Time is required");
      return;
    }

    setError("");
    alert(`Form submitted with time: ${time}`);
  };

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Form Validation
        </h1>
        <p className="text-lg text-muted-foreground">
          Validate timepicker input in forms
        </p>
      </div>

      <Section icon={FileCheck} title="Custom Validation">
        <p className="text-muted-foreground mb-4">
          Implement custom validation logic:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Validated Form
            </h3>
            <p className="text-sm text-muted-foreground">
              Shows error if time is not selected
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Appointment Time *
                  </label>
                  <Timepicker
                    value={time}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      error ? "border-red-500" : "border-border"
                    } bg-background`}
                    onUpdate={(data) => {
                      setTime(`${data.hour}:${data.minutes} ${data.type}`);
                      setError("");
                    }}
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!time) {
      setError("Time is required");
      return;
    }

    setError("");
    alert(\`Form submitted: \${time}\`);
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
    </form>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={FileCheck} title="Validation Scenarios">
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Required field validation</li>
          <li>Time range validation (e.g., must be between 9 AM - 5 PM)</li>
          <li>Business hours validation</li>
          <li>Future time only validation</li>
        </ul>
      </Section>
    </div>
  );
}
