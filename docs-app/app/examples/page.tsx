"use client";

import { useEffect, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";
import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { InfoBox } from "@/components/info-box";
import { Clock, Palette, Calendar, Settings, Zap, Lock } from "lucide-react";
import Link from "next/link";

interface ExampleCardProps {
  title: string;
  description: string;
  code: string;
  children: React.ReactNode;
}

function ExampleCard({ title, description, code, children }: ExampleCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-center min-h-[80px] rounded-lg border border-border bg-background p-4">
          {children}
        </div>
        <CodeBlock code={code} language="tsx" />
      </div>
    </div>
  );
}

function BasicExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Select time"
      className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function ClockTypeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: { type: "24h" },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="24-hour format"
      className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function ThemeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      ui: { theme: "dark" },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Dark theme"
      className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function CallbackExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      callbacks: {
        onConfirm: (data) => {
          const time = `${data.hour}:${data.minutes}${
            data.type ? " " + data.type : ""
          }`;
          setSelectedTime(time);
        },
      },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <div className="w-full max-w-xs space-y-3">
      <input
        ref={inputRef}
        type="text"
        placeholder="Select time"
        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {selectedTime && (
        <p className="text-sm text-muted-foreground text-center">
          Selected:{" "}
          <span className="text-primary font-medium">{selectedTime}</span>
        </p>
      )}
    </div>
  );
}

function IncrementExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: { incrementMinutes: 15 },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="15-minute intervals"
      className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function DisabledTimeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: {
        disabledTime: {
          interval: "12:00 PM - 1:00 PM",
        },
      },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Restricted hours"
      className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

export default function ExamplesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Examples</h1>
        <p className="text-lg text-muted-foreground">
          Working examples showing different configurations and use cases
        </p>
      </div>

      <InfoBox
        title="React Examples"
        variant="blue"
        emoji="⚛️"
        className="mb-8"
      >
        These examples use React and Next.js, but{" "}
        <strong>TimepickerUI works with any JavaScript framework</strong> or
        vanilla JS. The same API is available in Vue, Angular, Svelte, or plain
        JavaScript. Check the{" "}
        <Link
          href="/docs/quick-start"
          className="text-primary hover:underline font-medium"
        >
          Quick Start
        </Link>{" "}
        guide for framework-specific examples.
      </InfoBox>

      <Section icon={Zap} title="Basic Usage">
        <ExampleCard
          title="Default Timepicker"
          description="Simple time picker with default settings"
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function BasicTimePicker() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" placeholder="Select time" />;
}`}
        >
          <BasicExample />
        </ExampleCard>
      </Section>

      <Section icon={Clock} title="Clock Format">
        <ExampleCard
          title="24-Hour Format"
          description="Use 24-hour clock instead of 12-hour with AM/PM"
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function Clock24Example() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: { type: "24h" },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
        >
          <ClockTypeExample />
        </ExampleCard>
      </Section>

      <Section icon={Palette} title="Theming">
        <ExampleCard
          title="Dark Theme"
          description="Apply dark theme for better visual hierarchy"
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/theme-dark.css";

export default function DarkThemeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      ui: { theme: "dark" },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
        >
          <ThemeExample />
        </ExampleCard>
      </Section>

      <Section icon={Settings} title="Callbacks">
        <ExampleCard
          title="Handle Time Selection"
          description="React to user actions with callback functions"
          code={`import { useEffect, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function CallbackExample() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      callbacks: {
        onConfirm: (data) => {
          const time = \`\${data.hour}:\${data.minutes}\${data.type ? " " + data.type : ""}\`;
          setSelectedTime(time);
        },
      },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" />
      {selectedTime && <p>Selected: {selectedTime}</p>}
    </div>
  );
}`}
        >
          <CallbackExample />
        </ExampleCard>
      </Section>

      <Section icon={Calendar} title="Increments">
        <ExampleCard
          title="Custom Minute Steps"
          description="Allow only specific minute intervals (e.g., 15-minute increments)"
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function IncrementExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: { incrementMinutes: 15 },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
        >
          <IncrementExample />
        </ExampleCard>
      </Section>

      <Section icon={Lock} title="Restrictions">
        <ExampleCard
          title="Disabled Time Ranges"
          description="Prevent selection of specific hours or time intervals"
          code={`import { useEffect, useRef } from "react";
import { TimepickerUI } from "timepicker-ui";

export default function DisabledTimeExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, {
      clock: {
        disabledTime: {
          interval: "12:00 PM - 1:00 PM",
        },
      },
    });
    picker.create();
    return () => picker.destroy();
  }, []);

  return <input ref={inputRef} type="text" />;
}`}
        >
          <DisabledTimeExample />
        </ExampleCard>
      </Section>
    </div>
  );
}
