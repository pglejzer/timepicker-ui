"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function CustomLabelsPage() {
  return (
    <div>
      <PageHeader
        title="Custom Labels"
        description="Customize button and label text"
      />

      <Section title="Button Labels">
        <p>
          Change OK and Cancel button text:
        </p>
        <h3>Custom Buttons</h3>
        <p>Confirm and Close instead of OK and Cancel</p>
        <Figure
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
        >
          <Timepicker
            placeholder="Custom labels"
            className={demo.input}
            options={{
              labels: {
                ok: "Confirm",
                cancel: "Close",
              },
            }}
          />
        </Figure>
      </Section>

      <Section title="Localization">
        <p>
          Translate labels to different languages:
        </p>
        <Figure
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
        >
          <Timepicker
            placeholder="Wybierz czas"
            className={demo.input}
            options={{
              labels: {
                ok: "Potwierdź",
                cancel: "Anuluj",
              },
            }}
          />
        </Figure>
      </Section>

      <Section title="Available Labels">
        <CodeBlock
          code={`// Visible text labels (options.labels)
interface LabelsOptions {
  am?: string;            // Default: "AM"
  pm?: string;            // Default: "PM"
  ok?: string;            // Default: "OK"
  cancel?: string;        // Default: "Cancel"
  clear?: string;         // Default: "Clear"
  clockTitle?: string;    // Default: "Select time"
  keyboardTitle?: string; // Default: "Enter Time"
  hour?: string;          // Default: "Hour"
  minute?: string;        // Default: "Minute"
  second?: string;        // Default: "Second"
}`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
