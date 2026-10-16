"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";

export default function MobilePage() {
  return (
    <div>
      <PageHeader
        title="Mobile Mode"
        description={
          <>
            Open the picker in the keyboard view, where users type the time,
            with <code>ui.initialView: &quot;keyboard&quot;</code>.
          </>
        }
      />

      <Section title="Keyboard View">
        <p>
          Open in the keyboard view, where the time is typed into the hour and
          minute fields:
        </p>
        <h3>Keyboard View</h3>
        <p>Better for touch interactions</p>
        <Figure
          code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        ui: { initialView: "keyboard" }
      }}
    />
  );
}`}
          language="tsx"
        >
          <Timepicker
            placeholder="Keyboard view"
            className={demo.input}
            options={{
              ui: { initialView: "keyboard" },
            }}
          />
        </Figure>
      </Section>

      <Section title="With Switch Icon">
        <p>
          Add the switch icon with <code>ui.viewSwitch</code> to toggle between
          the keyboard view and the clock face:
        </p>
        <Figure
          code={`<Timepicker
  options={{
    ui: {
      initialView: "keyboard",
      viewSwitch: true
    }
  }}
/>`}
          language="tsx"
        >
          <Timepicker
            placeholder="Keyboard view with icon"
            className={demo.input}
            options={{
              ui: {
                initialView: "keyboard",
                viewSwitch: true,
              },
            }}
          />
        </Figure>
      </Section>

      <Section title="Responsive Design">
        <p>
          Open in the keyboard view on small screens:
        </p>
        <CodeBlock
          code={`import { Timepicker } from "timepicker-ui-react";
import { useState, useEffect } from "react";

function ResponsiveTimepicker() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Timepicker
      options={{
        ui: { initialView: isMobile ? "keyboard" : "clock" }
      }}
    />
  );
}`}
          language="tsx"
        />
      </Section>
    </div>
  );
}
