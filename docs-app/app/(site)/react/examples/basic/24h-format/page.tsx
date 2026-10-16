"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function Format24hPage() {
  return (
    <div>
      <PageHeader
        title="24h Format"
        description="Use 24-hour clock format instead of 12-hour with AM/PM"
      />

      <Section title="24-Hour Clock">
        <p>
          Configure timepicker to use 24-hour format:
        </p>
        <h3>24h Format</h3>
        <p>Hours from 00 to 23</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      placeholder="Select time (24h)"
      options={{
        clock: { type: "24h" }
      }}
    />
  );
}`}
          language="tsx"
        >
          <Timepicker
            placeholder="Select time (24h)"
            className={demo.input}
            options={{
              clock: { type: "24h" },
            }}
          />
        </Figure>
      </Section>

      <Section title="With Auto-Switch">
        <p>
          Automatically switch to minutes after selecting hour:
        </p>
        <h3>Auto-Switch to Minutes</h3>
        <p>Improves user experience</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        clock: {
          type: "24h",
          autoSwitchToMinutes: true
        }
      }}
    />
  );
}`}
          language="tsx"
        >
          <Timepicker
            placeholder="Select time"
            className={demo.input}
            options={{
              clock: {
                type: "24h",
                autoSwitchToMinutes: true,
              },
            }}
          />
        </Figure>
      </Section>
    </div>
  );
}
