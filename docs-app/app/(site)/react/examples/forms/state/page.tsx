"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";
import styles from "./page.module.css";

export default function FormStatePage() {
  const [formData, setFormData] = useState({
    name: "",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    notes: "",
  });
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setSubmitted(JSON.stringify(formData, null, 2));
  };

  return (
    <div>
      <PageHeader
        title="Form State"
        description="Manage timepicker as part of form state"
      />

      <Section title="Complete Form Example">
        <p>
          Integrate timepicker with other form fields:
        </p>
        <h3>Event Form</h3>
        <p>Multiple fields with shared state</p>
        <Figure
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
        >
          <form onSubmit={handleSubmit} className={demo.form}>
            <div className={demo.field}>
              <label htmlFor="state-name" className={demo.label}>
                Event Name
              </label>
              <input
                id="state-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={demo.input}
                placeholder="Team Meeting"
              />
            </div>

            <div className={styles.times}>
              <div className={demo.field}>
                <label htmlFor="state-start-time" className={demo.label}>
                  Start Time
                </label>
                <Timepicker
                  id="state-start-time"
                  value={formData.startTime}
                  className={demo.input}
                  onUpdate={(data) => {
                    setFormData({
                      ...formData,
                      startTime: `${data.hour}:${data.minutes} ${data.type}`,
                    });
                  }}
                />
              </div>

              <div className={demo.field}>
                <label htmlFor="state-end-time" className={demo.label}>
                  End Time
                </label>
                <Timepicker
                  id="state-end-time"
                  value={formData.endTime}
                  className={demo.input}
                  onUpdate={(data) => {
                    setFormData({
                      ...formData,
                      endTime: `${data.hour}:${data.minutes} ${data.type}`,
                    });
                  }}
                />
              </div>
            </div>

            <div className={demo.field}>
              <label htmlFor="state-notes" className={demo.label}>
                Notes
              </label>
              <textarea
                id="state-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className={styles.textarea}
                rows={3}
                placeholder="Optional notes"
              />
            </div>

            <div className={demo.output}>
              <strong>Current state:</strong>
              <pre className={styles.json}>
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>

            <button type="submit" className={demo.button}>
              Submit Form
            </button>
            <pre
              role="status"
              aria-live="polite"
              className={`${demo.output} ${styles.json}`}
            >
              {submitted}
            </pre>
          </form>
        </Figure>
      </Section>
    </div>
  );
}
