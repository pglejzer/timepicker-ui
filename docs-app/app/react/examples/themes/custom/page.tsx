"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Paintbrush } from "lucide-react";

export default function CustomStylingPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Custom Styling
        </h1>
        <p className="text-lg text-muted-foreground">
          Apply custom classes and inline styles
        </p>
      </div>

      <Section icon={Paintbrush} title="Custom Classes">
        <p className="text-muted-foreground mb-4">
          Use className prop to apply custom styles:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tailwind Classes
            </h3>
            <p className="text-sm text-muted-foreground">
              Custom border, padding, and colors
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Custom styled"
                className="w-full max-w-xs px-6 py-3 text-lg rounded-xl border-2 border-purple-500 dark:border-purple-400 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-background"
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      className="px-6 py-3 text-lg rounded-xl border-2 border-purple-500"
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Paintbrush} title="Inline Styles">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Monospace font"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                style={{ fontFamily: "monospace", fontSize: "16px" }}
              />
            </div>
            <CodeBlock
              code={`<Timepicker
  style={{
    fontFamily: "monospace",
    fontSize: "16px"
  }}
/>`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Paintbrush} title="Combined Styling">
        <p className="text-muted-foreground mb-4">
          Combine className, style, and theme options:
        </p>
        <CodeBlock
          code={`<Timepicker
  className="custom-timepicker"
  style={{ maxWidth: "300px" }}
  options={{
    ui: { theme: "dark" }
  }}
/>`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
