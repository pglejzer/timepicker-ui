"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function IncrementPage() {
  return (
    <div>
      <PageHeader
        title="Increment Steps"
        description="Allow only specific minute intervals"
      />

      <Section title="15-Minute Intervals">
        <p>
          Restrict minute selection to 15-minute increments:
        </p>
        <h3>15-Minute Steps</h3>
        <p>Only 00, 15, 30, 45 available</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        clock: { incrementMinutes: 15 }
      }}
    />
  );
}`}
          language="tsx"
        >
          <Timepicker
            placeholder="15-min intervals"
            className={demo.input}
            options={{
              clock: { incrementMinutes: 15 },
            }}
          />
        </Figure>
      </Section>

      <Section title="30-Minute Intervals">
        <Figure
          code={`<Timepicker
  options={{
    clock: { incrementMinutes: 30 }
  }}
/>`}
          language="tsx"
        >
          <Timepicker
            placeholder="30-min intervals"
            className={demo.input}
            options={{
              clock: { incrementMinutes: 30 },
            }}
          />
        </Figure>
      </Section>

      <Section title="Use Cases">
        <ul>
          <li>Appointment scheduling (15 or 30-minute slots)</li>
          <li>Meeting duration selection</li>
          <li>Business hours with fixed time slots</li>
          <li>Simplified time selection for users</li>
        </ul>
      </Section>
    </div>
  );
}
