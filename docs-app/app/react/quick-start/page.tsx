import Link from "next/link";
import { Code2, ArrowRight, Zap, Package } from "lucide-react";
import { CodeBlock } from "@/components/code-block";

export const metadata = {
  title: "Quick Start - React - Timepicker-UI",
  description: "Get started with timepicker-ui-react",
};

export default function QuickStartPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
        <p className="text-xl text-muted-foreground">
          Get started with your first timepicker component in minutes
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Basic Usage
        </h2>
        <p className="text-muted-foreground mb-4">
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
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Common Patterns</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-3">Controlled Component</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage timepicker value with React state:
            </p>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-3">With Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Customize timepicker with options:
            </p>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-3">In Forms</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use with form validation:
            </p>
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
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Key Props</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-sm">
                value / defaultValue
              </h3>
              <p className="text-sm text-muted-foreground">
                Control or initialize the timepicker value
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm">onConfirm</h3>
              <p className="text-sm text-muted-foreground">
                Callback when user clicks OK button
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm">onUpdate</h3>
              <p className="text-sm text-muted-foreground">
                Callback on every time change (real-time sync)
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm">options</h3>
              <p className="text-sm text-muted-foreground">
                Configuration object for clock, UI, labels, etc.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1 text-sm">
                Standard HTML attributes
              </h3>
              <p className="text-sm text-muted-foreground">
                Supports all input props: placeholder, className, disabled,
                required, etc.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <div className="space-y-3">
          <Link
            href="/react/examples"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Code2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">View All Examples</div>
              <div className="text-sm text-muted-foreground">
                Explore 19+ interactive examples
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <a
            href="https://github.com/pglejzer/timepicker-ui-react#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Package className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Full API Reference</div>
              <div className="text-sm text-muted-foreground">
                Complete props documentation
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </a>

          <Link
            href="/docs"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Package className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Core Library Options</div>
              <div className="text-sm text-muted-foreground">
                Learn about all configuration options
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
