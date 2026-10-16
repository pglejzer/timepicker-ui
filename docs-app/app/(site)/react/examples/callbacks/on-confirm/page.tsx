"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function OnConfirmPage() {
  const [confirmedTime, setConfirmedTime] = useState("");

  return (
    <div>
      <PageHeader
        title="onConfirm"
        description="Handle time confirmation when user clicks OK"
      />

      <Section title="Confirm Callback">
        <p>
          The onConfirm event fires when user clicks the OK button:
        </p>
        <h3>Confirmation Handler</h3>
        <p>Only saves value when confirmed</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [confirmedTime, setConfirmedTime] = useState("");

  return (
    <div>
      <Timepicker
        onConfirm={(data) => {
          setConfirmedTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
        }}
      />
      {confirmedTime && <p>Confirmed: {confirmedTime}</p>}
    </div>
  );
}`}
          language="tsx"
        >
          <div className={demo.form}>
            <Timepicker
              placeholder="Select and confirm time"
              className={demo.input}
              onConfirm={(data) => {
                setConfirmedTime(`${data.hour}:${data.minutes} ${data.type}`);
              }}
            />
            <p className={demo.output} aria-live="polite">
              {confirmedTime && (
                <>
                  Confirmed: <strong>{confirmedTime}</strong>
                </>
              )}
            </p>
          </div>
        </Figure>
      </Section>

      <Section title="Event Data">
        <p>
          The onConfirm callback receives an object with selected time:
        </p>
        <CodeBlock
          code={`interface ConfirmEventData {
  hour?: string;         // e.g., "03", "15"
  minutes?: string;      // e.g., "30", "00"
  type?: string;         // "AM" or "PM", only in 12h mode
  autoCommit?: boolean;  // true when wheel.commitOnScroll confirmed it
}

onConfirm={(data) => {
  console.log(data.hour);     // "03"
  console.log(data.minutes);  // "30"
  console.log(data.type);     // "PM"
}}`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
