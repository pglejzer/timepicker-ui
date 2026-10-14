"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Smartphone } from "lucide-react";

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
        eyebrow="React · Features"
      />

      <Section icon={Smartphone} title="Keyboard View">
        <p className="text-muted-foreground mb-4">
          Open in the keyboard view, where the time is typed into the hour and
          minute fields:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Keyboard View
            </h3>
            <p className="text-sm text-muted-foreground">
              Better for touch interactions
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Keyboard view"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: { initialView: "keyboard" },
                }}
              />
            </div>
            <CodeBlock
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
            />
          </div>
        </div>
      </Section>

      <Section icon={Smartphone} title="With Switch Icon">
        <p className="text-muted-foreground mb-4">
          Add the switch icon with <code>ui.viewSwitch</code> to toggle between
          the keyboard view and the clock face:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Keyboard view with icon"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: {
                    initialView: "keyboard",
                    viewSwitch: true,
                  },
                }}
              />
            </div>
            <CodeBlock
              code={`<Timepicker
  options={{
    ui: {
      initialView: "keyboard",
      viewSwitch: true
    }
  }}
/>`}
              language="tsx"
            />
          </div>
        </div>
      </Section>

      <Section icon={Smartphone} title="Responsive Design">
        <p className="text-muted-foreground mb-4">
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
