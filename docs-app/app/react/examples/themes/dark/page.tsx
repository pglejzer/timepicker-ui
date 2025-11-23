"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Moon } from "lucide-react";

export default function DarkThemePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Dark Theme
        </h1>
        <p className="text-lg text-muted-foreground">
          Dark mode theme for reduced eye strain
        </p>
      </div>

      <Section icon={Moon} title="Dark Theme">
        <p className="text-muted-foreground mb-4">
          Perfect for night-time use and dark interfaces:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Dark Theme
            </h3>
            <p className="text-sm text-muted-foreground">
              Optimized for low-light environments
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Dark theme"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: { theme: "dark" },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        ui: { theme: "dark" }
      }}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Moon} title="Dark with 24h Format">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Dark + 24h"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: { theme: "dark" },
                  clock: { type: "24h" },
                }}
              />
            </div>
            <CodeBlock
              code={`<Timepicker
  options={{
    ui: { theme: "dark" },
    clock: { type: "24h" }
  }}
/>`}
              language="tsx"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
