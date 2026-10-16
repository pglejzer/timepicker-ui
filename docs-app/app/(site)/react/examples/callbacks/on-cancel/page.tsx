"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";

export default function OnCancelPage() {
  const [cancelCount, setCancelCount] = useState(0);

  return (
    <div>
      <PageHeader
        title="onCancel"
        description="Handle cancellation when user closes the picker"
      />

      <Section title="Cancel Callback">
        <p>
          The onCancel event fires when user clicks Cancel or backdrop:
        </p>
        <h3>Cancellation Handler</h3>
        <p>Tracks how many times picker was cancelled</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [cancelCount, setCancelCount] = useState(0);

  return (
    <div>
      <Timepicker
        onCancel={() => {
          setCancelCount((prev) => prev + 1);
        }}
      />
      <p>Cancelled: {cancelCount} times</p>
    </div>
  );
}`}
          language="tsx"
        >
          <div className={demo.form}>
            <Timepicker
              placeholder="Try cancelling"
              className={demo.input}
              onCancel={() => {
                setCancelCount((prev) => prev + 1);
              }}
            />
            <p className={demo.output} aria-live="polite">
              <strong>Cancelled:</strong> {cancelCount}{" "}
              {cancelCount === 1 ? "time" : "times"}
            </p>
          </div>
        </Figure>
      </Section>

      <Section title="Use Cases">
        <ul>
          <li>Revert form changes</li>
          <li>Track user behavior analytics</li>
          <li>Reset temporary state</li>
          <li>Show &quot;selection cancelled&quot; message</li>
        </ul>
      </Section>
    </div>
  );
}
