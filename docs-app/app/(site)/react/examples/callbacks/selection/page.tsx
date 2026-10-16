"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { useState } from "react";
import styles from "./page.module.css";

export default function SelectionEventsPage() {
  const [lastHour, setLastHour] = useState("");
  const [lastMinute, setLastMinute] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <div>
      <PageHeader
        title="Selection Events"
        description="Track hour, minute, and AM/PM selections"
      />

      <Section title="Individual Selection Callbacks">
        <p>
          Listen to specific selection events:
        </p>
        <h3>Selection Tracking</h3>
        <p>See individual hour/minute selections</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [lastHour, setLastHour] = useState("");
  const [lastMinute, setLastMinute] = useState("");
  const [period, setPeriod] = useState("");

  return (
    <Timepicker
      onSelectHour={(data) => setLastHour(data.hour)}
      onSelectMinute={(data) => setLastMinute(data.minutes)}
      onSelectAM={() => setPeriod("AM")}
      onSelectPM={() => setPeriod("PM")}
    />
  );
}`}
          language="tsx"
        >
          <div className={demo.form}>
            <Timepicker
              placeholder="Select time"
              className={demo.input}
              onSelectHour={(data) => setLastHour(data.hour)}
              onSelectMinute={(data) => setLastMinute(data.minutes)}
              onSelectAM={() => setPeriod("AM")}
              onSelectPM={() => setPeriod("PM")}
            />
            <dl className={styles.stats} aria-live="polite">
              <div>
                <dt className={demo.hint}>Hour</dt>
                <dd className={demo.output}>{lastHour || "-"}</dd>
              </div>
              <div>
                <dt className={demo.hint}>Minute</dt>
                <dd className={demo.output}>{lastMinute || "-"}</dd>
              </div>
              <div>
                <dt className={demo.hint}>Period</dt>
                <dd className={demo.output}>{period || "-"}</dd>
              </div>
            </dl>
          </div>
        </Figure>
      </Section>

      <Section title="Event Data Structure">
        <CodeBlock
          code={`// onSelectHour
interface HourSelectData {
  hour: string;
}

// onSelectMinute
interface MinuteSelectData {
  minutes: string;
}

// onSelectAM, onSelectPM
// No parameters - just fires when clicked`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
