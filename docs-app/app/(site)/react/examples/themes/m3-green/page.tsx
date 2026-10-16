"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import Link from "next/link";

export default function M3GreenPage() {
  return (
    <div>
      <PageHeader
        title="Material 3 Green"
        description="Material Design 3 green theme"
      />

      <Section title="M3 Green Theme">
        <p>
          Modern Material Design 3 aesthetics with green accent:
        </p>
        <h3>M3 Green</h3>
        <p>Material Design 3 specification</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import "timepicker-ui/theme-m3-green.css";

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
        >
          <Timepicker
            placeholder="M3 Green"
            className={demo.input}
            options={{
              ui: { theme: "m3-green" },
            }}
          />
        </Figure>
      </Section>

      <Section title="Available Themes">
        <ul>
          <li>
            <code>basic</code> - Default light theme
          </li>
          <li>
            <code>dark</code> - Dark mode
          </li>
          <li>
            <code>m3-green</code> - Material Design 3 green
          </li>
          <li>
            <code>crane</code> - Crane theme
          </li>
          <li>
            <code>crane-straight</code> - Crane straight variant
          </li>
          <li>
            Check <Link href="/examples/themes/basic">vanilla examples</Link>{" "}
            for more themes
          </li>
        </ul>
      </Section>
    </div>
  );
}
