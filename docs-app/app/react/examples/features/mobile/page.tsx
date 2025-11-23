"use client";

import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Timepicker } from "timepicker-ui-react";
import "timepicker-ui/main.css";
import { Smartphone } from "lucide-react";

export default function MobilePage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Mobile Mode
        </h1>
        <p className="text-lg text-muted-foreground">
          Optimized interface for mobile devices
        </p>
      </div>

      <Section icon={Smartphone} title="Mobile View">
        <p className="text-muted-foreground mb-4">
          Enable mobile-optimized UI with larger touch targets:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Mobile Mode
            </h3>
            <p className="text-sm text-muted-foreground">
              Better for touch interactions
            </p>
          </div>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Mobile view"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: { mobile: true },
                }}
              />
            </div>
            <CodeBlock
              code={`import { Timepicker } from "timepicker-ui-react";

function App() {
  return (
    <Timepicker
      options={{
        ui: { mobile: true }
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
          Add switch icon for better hour/minute navigation:
        </p>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
              <Timepicker
                placeholder="Mobile with icon"
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-border bg-background"
                options={{
                  ui: {
                    mobile: true,
                    enableSwitchIcon: true,
                  },
                }}
              />
            </div>
            <CodeBlock
              code={`<Timepicker
  options={{
    ui: {
      mobile: true,
      enableSwitchIcon: true
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
          Automatically switch to mobile mode based on screen size:
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
        ui: { mobile: isMobile }
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
