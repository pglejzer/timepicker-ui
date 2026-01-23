"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Palette } from "lucide-react";
import Link from "next/link";

export default function M3GreenPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Material 3 Green
        </h1>
        <p className="text-lg text-muted-foreground">
          Material Design 3 green theme
        </p>
      </div>

      <Section icon={Palette} title="M3 Green Theme">
        <p className="text-muted-foreground mb-4">
          Modern Material Design 3 aesthetics with green accent:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              M3 Green
            </h3>
            <p className="text-sm text-muted-foreground">
              Material Design 3 specification
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="M3 Green"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: { theme: "m3-green" },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        ui: { theme: "m3-green" }
      }}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Palette} title="Available Themes">
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              •{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                basic
              </code>{" "}
              - Default light theme
            </li>
            <li>
              •{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">dark</code>{" "}
              - Dark mode
            </li>
            <li>
              •{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                m3-green
              </code>{" "}
              - Material Design 3 green
            </li>
            <li>
              •{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                crane
              </code>{" "}
              - Crane theme
            </li>
            <li>
              •{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                crane-straight
              </code>{" "}
              - Crane straight variant
            </li>
            <li>
              • Check{" "}
              <Link
                href="/examples/themes"
                className="text-primary hover:underline"
              >
                vanilla examples
              </Link>{" "}
              for more themes
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
