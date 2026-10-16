"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function GettingStartedPage() {
  return (
    <div>
      <PageHeader
        title="Getting Started"
        description="Simple example to start using timepicker-ui-react"
      />

      <Section title="Basic Usage">
        <p>
          The simplest way to create a timepicker with default settings:
        </p>
        <h3>Basic Timepicker</h3>
        <p>Default 12-hour format with AM/PM</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

function App() {
  return (
    <Timepicker
      placeholder="Select time"
      className="px-4 py-2 rounded-lg border"
    />
  );
}`}
          language="tsx"
        >
          <Timepicker placeholder="Select time" className={demo.input} />
        </Figure>
      </Section>

      <Section title="Installation">
        <p>
          Install the package and import required styles:
        </p>
        <CodeBlock
          code={`# Install timepicker-ui-react
npm install timepicker-ui-react

# Import in your component
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";`}
          language="bash"
        />
      </Section>

      <Section title="Props">
        <p>
          The component extends standard HTML input attributes:
        </p>
        <CodeBlock
          code={`<Timepicker
  // Standard input props
  placeholder="Select time"
  className="custom-class"
  disabled={false}
  required
  name="appointment-time"
  
  // Timepicker-specific props
  value="12:00 PM"
  defaultValue="9:00 AM"
  options={{
    clock: { type: "12h" },
    ui: { theme: "basic" }
  }}
/>`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
