"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function DarkThemePage() {
  return (
    <div>
      <PageHeader
        title="Dark Theme"
        description="Dark mode theme for reduced eye strain"
      />

      <Section title="Dark Theme">
        <p>
          Perfect for night-time use and dark interfaces:
        </p>
        <h3>Dark Theme</h3>
        <p>Optimized for low-light environments</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import "timepicker-ui/theme-dark.css";

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
        >
          <Timepicker
            placeholder="Dark theme"
            className={demo.input}
            options={{
              ui: { theme: "dark" },
            }}
          />
        </Figure>
      </Section>

      <Section title="Dark with 24h Format">
        <Figure
          code={`<Timepicker
  options={{
    ui: { theme: "dark" },
    clock: { type: "24h" }
  }}
/>`}
          language="tsx"
        >
          <Timepicker
            placeholder="Dark + 24h"
            className={demo.input}
            options={{
              ui: { theme: "dark" },
              clock: { type: "24h" },
            }}
          />
        </Figure>
      </Section>
    </div>
  );
}
