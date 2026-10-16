"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function DisabledPage() {
  return (
    <div>
      <PageHeader
        title="Disabled Input"
        description="Disabled state styling and behavior"
      />

      <Section title="Disabled Timepicker">
        <p>
          Use the disabled prop to prevent interaction:
        </p>
        <h3>Disabled State</h3>
        <p>Picker cannot be opened</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      placeholder="Disabled"
      disabled
    />
  );
}`}
          language="tsx"
        >
          <Timepicker
            placeholder="Disabled"
            disabled
            className={demo.input}
          />
        </Figure>
      </Section>

      <Section title="Conditional Disable">
        <p>
          Dynamically enable/disable based on state:
        </p>
        <CodeBlock
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
        />
        Enable timepicker
      </label>

      <Timepicker
        disabled={!isEnabled}
      />
    </div>
  );
}`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
