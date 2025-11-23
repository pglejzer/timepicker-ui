"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function RequiredPage() {
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted: ${time}`);
  };

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Required Field
        </h1>
        <p className="text-lg text-muted-foreground">
          Use HTML5 required attribute for validation
        </p>
      </div>

      <Section icon={AlertCircle} title="Required Input">
        <p className="text-muted-foreground mb-4">
          Add required attribute for browser validation:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Required Field
            </h3>
            <p className="text-sm text-muted-foreground">
              Try submitting without selecting time
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time *
                  </label>
                  <Timepicker
                    name="appointment-time"
                    placeholder="Required field"
                    required
                    value={time}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    onUpdate={(data) => {
                      setTime(`${data.hour}:${data.minutes} ${data.type}`);
                    }}
                  />
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

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      alert(\`Submitted: \${time}\`);
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
    </form>
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={AlertCircle} title="HTML5 Attributes">
        <p className="text-muted-foreground mb-4">
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
