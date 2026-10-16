import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";

export const metadata = buildMetadata({
  title: "React Quick Start",
  description:
    "React time picker quick start - render your first timepicker-ui-react component in minutes. SSR-safe and fully typed, with copy-paste JSX.",
  path: "/react/quick-start",
});

export default function QuickStartPage() {
  return (
    <div>
      <PageHeader
        title="Quick Start"
        description="Get started with your first timepicker component in minutes"
      />

      <h2>Basic Usage</h2>
      <p>
        Import the Timepicker component and CSS, then use it in your React
        component:
      </p>
      <CodeBlock
        code={`import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

function App() {
  return (
    <Timepicker
      placeholder="Select time"
      onConfirm={(data) => {
        console.log(data.hour, data.minutes, data.type);
      }}
    />
  );
}`}
        language="tsx"
      />

      <h2>Common Patterns</h2>

      <h3>Controlled Component</h3>
      <p>Manage timepicker value with React state:</p>
      <CodeBlock
        code={`import { Timepicker } from "timepicker-ui-react";
import { useState } from "react";

function App() {
  const [time, setTime] = useState("12:00 PM");

  return (
    <Timepicker
      value={time}
      onUpdate={(data) => {
        setTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
      }}
    />
  );
}`}
        language="tsx"
      />

      <h3>With Options</h3>
      <p>Customize timepicker with options:</p>
      <CodeBlock
        code={`<Timepicker
  placeholder="Select time"
  options={{
    clock: { type: "24h" },
    ui: { theme: "dark" }
  }}
  onConfirm={(data) => console.log(data)}
/>`}
        language="tsx"
      />

      <h3>In Forms</h3>
      <p>Use with form validation:</p>
      <CodeBlock
        code={`<form onSubmit={handleSubmit}>
  <Timepicker
    name="appointment-time"
    required
    value={time}
    onUpdate={(data) => {
      setTime(\`\${data.hour}:\${data.minutes} \${data.type}\`);
    }}
  />
  <button type="submit">Submit</button>
</form>`}
        language="tsx"
      />

      <h2>Key Props</h2>
      <dl>
        <div>
          <dt>value / defaultValue</dt>
          <dd>Control or initialize the timepicker value</dd>
        </div>
        <div>
          <dt>onConfirm</dt>
          <dd>Callback when user clicks OK button</dd>
        </div>
        <div>
          <dt>onUpdate</dt>
          <dd>Callback on every time change (real-time sync)</dd>
        </div>
        <div>
          <dt>options</dt>
          <dd>Configuration object for clock, UI, labels, etc.</dd>
        </div>
        <div>
          <dt>Standard HTML attributes</dt>
          <dd>
            Supports all input props: placeholder, className, disabled,
            required, etc.
          </dd>
        </div>
      </dl>

      <h2>Next Steps</h2>
      <dl>
        <div>
          <dt>
            <Link href="/react/examples">View All Examples</Link>
          </dt>
          <dd>Explore 19+ interactive examples</dd>
        </div>
        <div>
          <dt>
            <a
              href="https://github.com/pglejzer/timepicker-ui-react#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              Full API Reference
            </a>
          </dt>
          <dd>Complete props documentation</dd>
        </div>
        <div>
          <dt>
            <Link href="/docs">Core Library Options</Link>
          </dt>
          <dd>Learn about all configuration options</dd>
        </div>
      </dl>
    </div>
  );
}

