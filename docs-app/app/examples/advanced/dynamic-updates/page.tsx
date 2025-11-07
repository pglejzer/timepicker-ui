"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { TimepickerUI } from "timepicker-ui";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { RefreshCw, Settings } from "lucide-react";
import { InfoBox } from "@/components/info-box";
import "timepicker-ui/index.css";

export default function DynamicUpdatesPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [clockType, setClockType] = useState<"12h" | "24h">("12h");
  const [theme, setTheme] = useState<"basic" | "dark">("basic");

  const options = useMemo(
    () => ({
      clockType,
      theme,
    }),
    [clockType, theme]
  );

  useEffect(() => {
    if (!inputRef.current) return;

    if (pickerRef.current) {
      // Update existing picker instead of recreating
      pickerRef.current.update({ options });
    } else {
      // Create initial picker
      pickerRef.current = new TimepickerUI(inputRef.current, options);
      pickerRef.current.create();
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, [options]);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Dynamic Updates
        </h1>
        <p className="text-lg text-muted-foreground">
          Update timepicker options dynamically without destroying the instance
        </p>
      </div>

      <InfoBox title="Update Method" variant="blue" className="mb-8">
        Use the{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          update()
        </code>{" "}
        method to change options on an existing timepicker instance without
        recreating it.
      </InfoBox>

      <Section icon={Settings} title="Interactive Demo">
        <p className="text-muted-foreground mb-4">
          Change options dynamically and see the timepicker update:
        </p>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => setClockType(clockType === "12h" ? "24h" : "12h")}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Toggle Format: {clockType}
            </button>
            <button
              onClick={() => setTheme(theme === "basic" ? "dark" : "basic")}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Toggle Theme: {theme}
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Select time"
            className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <CodeBlock
          code={`import { useState, useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function DynamicTimepicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  const [clockType, setClockType] = useState<'12h' | '24h'>('12h');
  const [theme, setTheme] = useState<'basic' | 'dark'>('basic');

  const options = useMemo(() => ({
    clockType,
    theme,
  }), [clockType, theme]);

  useEffect(() => {
    if (!inputRef.current) return;

    if (pickerRef.current) {
      // Update existing picker
      pickerRef.current.update({ options });
    } else {
      // Create initial picker
      pickerRef.current = new TimepickerUI(inputRef.current, options);
      pickerRef.current.create();
    }

    return () => {
      pickerRef.current?.destroy();
    };
  }, [options]);

  return (
    <>
      <button onClick={() => setClockType(
        clockType === '12h' ? '24h' : '12h'
      )}>
        Toggle Format
      </button>
      <input ref={inputRef} type="text" />
    </>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section icon={RefreshCw} title="Update Method">
        <p className="text-muted-foreground mb-4">
          The update method allows you to change options without destroying the
          picker:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clockType: '12h',
  theme: 'basic'
});

picker.create();

// Later, update options
picker.update({
  options: {
    clockType: '24h',
    theme: 'dark'
  }
});

// Or with create option to reinitialize
picker.update({
  options: {
    clockType: '12h'
  },
  create: true
});`}
          language="typescript"
        />
      </Section>

      <Section icon={Settings} title="Update with Callbacks">
        <p className="text-muted-foreground mb-4">
          Update options including event callbacks:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();

// Update with new callbacks
picker.update({
  options: {
    onConfirm: (data) => {
      console.log('New time selected:', data);
    },
    onCancel: () => {
      console.log('Selection cancelled');
    }
  }
});`}
          language="typescript"
        />
      </Section>

      <Section icon={RefreshCw} title="Conditional Updates">
        <p className="text-muted-foreground mb-4">
          Update picker based on user preferences or app state:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();

// Update based on user preference
function updatePickerTheme(isDarkMode: boolean) {
  picker.update({
    options: {
      theme: isDarkMode ? 'dark' : 'basic'
    }
  });
}

// Update based on device
function updateForMobile(isMobile: boolean) {
  picker.update({
    options: {
      mobile: isMobile,
      animation: !isMobile // Disable animation on mobile
    }
  });
}

// Listen to system theme changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    updatePickerTheme(e.matches);
  });`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
