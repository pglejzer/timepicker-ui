"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Database } from "lucide-react";
import { useState } from "react";

export default function FormStatePage() {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Form State
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage timepicker as part of form state
        </p>
      </div>

      <Section icon={Database} title="Complete Form Example">
        <p className="text-muted-foreground mb-4">
          Integrate timepicker with other form fields:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Event Form
            </h3>
            <p className="text-sm text-muted-foreground">
              Multiple fields with shared state
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 rounded-lg border border-border bg-background p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    placeholder="Team Meeting"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Time
                    </label>
                    <Timepicker
                      value={formData.startTime}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      onUpdate={(data) => {
                        setFormData({
                          ...formData,
                          startTime: `${data.hour}:${data.minutes} ${data.type}`,
                        });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Time
                    </label>
                    <Timepicker
                      value={formData.endTime}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      onUpdate={(data) => {
                        setFormData({
                          ...formData,
                          endTime: `${data.hour}:${data.minutes} ${data.type}`,
                        });
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    rows={3}
                    placeholder="Optional notes"
                  />
                </div>

                <div className="rounded-lg bg-muted p-4 text-sm">
                  <strong>Current state:</strong>
                  <pre className="mt-2 text-xs overflow-x-auto">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Submit Form
                </button>
              </form>
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    notes: ""
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      console.log(formData);
    }}>
      <input
        value={formData.name}
        onChange={(e) => 
          setFormData({ ...formData, name: e.target.value })
        }
      />

      <Timepicker
        value={formData.startTime}
        onUpdate={(data) => {
          setFormData({
            ...formData,
            startTime: \`\${data.hour}:\${data.minutes} \${data.type}\`
          });
        }}
      />

      <Timepicker
        value={formData.endTime}
        onUpdate={(data) => {
          setFormData({
            ...formData,
            endTime: \`\${data.hour}:\${data.minutes} \${data.type}\`
          });
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
    </div>
  );
}
