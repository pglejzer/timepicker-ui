"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import styles from "./page.module.css";

export default function CustomStylingPage() {
  return (
    <div>
      <PageHeader
        title="Custom Styling"
        description="Apply custom classes and inline styles"
      />

      <Section title="Custom Classes">
        <p>
          Use className prop to apply custom styles:
        </p>
        <h3>Tailwind Classes</h3>
        <p>Custom border, padding, and colors</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      className="px-6 py-3 text-lg rounded-xl border-2 border-purple-500"
    />
  );
}`}
          language="tsx"
        >
          <Timepicker placeholder="Custom styled" className={styles.custom} />
        </Figure>
      </Section>

      <Section title="Inline Styles">
        <Figure
          code={`<Timepicker
  style={{
    fontFamily: "monospace",
    fontSize: "16px"
  }}
/>`}
          language="tsx"
        >
          <Timepicker
            placeholder="Monospace font"
            className={demo.input}
            style={{ fontFamily: "monospace", fontSize: "16px" }}
          />
        </Figure>
      </Section>

      <Section title="Combined Styling">
        <p>
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
