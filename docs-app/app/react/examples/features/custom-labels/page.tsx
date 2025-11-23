"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Type } from "lucide-react";

export default function CustomLabelsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Custom Labels
        </h1>
        <p className="text-lg text-muted-foreground">
          Customize button and label text
        </p>
      </div>

      <Section icon={Type} title="Button Labels">
        <p className="text-muted-foreground mb-4">
          Change OK and Cancel button text:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Custom Buttons
            </h3>
            <p className="text-sm text-muted-foreground">
              Confirm and Close instead of OK and Cancel
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Custom labels"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  labels: {
                    ok: "Confirm",
                    cancel: "Close",
                  },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        labels: {
          ok: "Confirm",
          cancel: "Close"
        }
      }}
    />
  );
}`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Type} title="Localization">
        <p className="text-muted-foreground mb-4">
          Translate labels to different languages:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Wybierz czas"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  labels: {
                    ok: "Potwierdź",
                    cancel: "Anuluj",
                  },
                }}
              />
            </div>
            <CodeBlock
              code={`// Polish localization
<Timepicker
  placeholder="Wybierz czas"
  options={{
    labels: {
      ok: "Potwierdź",
      cancel: "Anuluj"
    }
  }}
/>`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Type} title="Available Labels">
        <div className="rounded-lg border border-border bg-card p-6">
          <CodeBlock
            code={`interface LabelsOptions {
  ok?: string;        // Default: "OK"
  cancel?: string;    // Default: "Cancel"
}`}
            language="typescript"
          />
        </div>
      </Section>
    </div>
  );
}
