"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
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
      clock: { type: clockType },
      ui: { theme },
    }),
    [clockType, theme],
  );

  useEffect(() => {
    if (!inputRef.current) return;

    if (!pickerRef.current) {
      // Create initial picker only once
      pickerRef.current = new TimepickerUI(inputRef.current, options);
      pickerRef.current.create();
    }

    return () => {
      // Cleanup only on component unmount
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create once on mount; option changes are applied by the separate update effect below
  }, []); // Empty deps - run only once

  // Separate effect for updates
  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.setOptions(options);
    }
  }, [options]);

  return (
    <div>
      <PageHeader
        title="Dynamic Updates"
        description="Update timepicker options dynamically without destroying the instance"
        eyebrow="Example · Advanced"
      />

      <InfoBox title="setOptions()" variant="blue" className="mb-8">
        Use the{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          setOptions()
        </code>{" "}
        method to change options on an existing timepicker instance without
        recreating it. It replaces{" "}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
          update({"{ options }"})
        </code>
        , which still works until 5.0.
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
            className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
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
    clock: { type: clockType },
    ui: { theme },
  }), [clockType, theme]);

  useEffect(() => {
    if (!inputRef.current) return;

    if (!pickerRef.current) {
      // Create picker only once
      pickerRef.current = new TimepickerUI(inputRef.current, options);
      pickerRef.current.create();
    }

    return () => {
      // Cleanup on unmount
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };
  }, []); // Empty deps - run only once

  // Update picker when options change
  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.setOptions(options);
    }
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

      <Section icon={RefreshCw} title="setOptions() Method">
        <p className="text-muted-foreground mb-4">
          <code>setOptions()</code> changes options without destroying the
          picker. Groups you leave out keep their values:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  ui: { theme: 'basic' }
});

picker.create();

// Later, change options
picker.setOptions({
  clock: { type: '24h' },
  ui: { theme: 'dark' }
});

// Only the clock group changes; ui keeps theme: 'dark'
picker.setOptions({
  clock: { type: '12h' }
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
picker.setOptions({
  callbacks: {
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
  picker.setOptions({
    ui: { theme: isDarkMode ? 'dark' : 'basic' }
  });
}

// Update based on device
function updateForMobile(isMobile: boolean) {
  picker.setOptions({
    ui: {
      initialView: isMobile ? 'keyboard' : 'clock',
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

      <Section icon={RefreshCw} title="Update DisabledTime Dynamically">
        <p className="text-muted-foreground mb-4">
          Change disabled times based on business rules or user context:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      hours: [9, 10, 11, 12] // Morning hours disabled
    }
  }
});
picker.create();

// Update to disable evening hours instead
function switchToEveningRestriction() {
  picker.setOptions({
    clock: {
      disabledTime: {
        hours: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      }
    }
  });
}

// Clear all restrictions
function clearRestrictions() {
  picker.setOptions({
    clock: {
      disabledTime: {}
    }
  });
}

// Update based on day of week
function updateForDayOfWeek() {
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;

  picker.setOptions({
    clock: {
      disabledTime: isWeekend
        ? {} // No restrictions on weekends
        : { hours: [0, 1, 2, 3, 4, 5, 6, 22, 23] } // Business hours only
    }
  });
}`}
          language="typescript"
        />
      </Section>

      <Section icon={RefreshCw} title="Update Disabled Ranges Dynamically">
        <p className="text-muted-foreground mb-4">
          Change disabled time ranges for business hours, shifts, or
          scheduling:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      ranges: '09:00 - 17:00' // Block business hours
    }
  }
});
picker.create();

// Update to block after-hours
function switchToAfterHoursBlock() {
  picker.setOptions({
    clock: {
      disabledTime: {
        ranges: ['00:00 - 08:00', '18:00 - 23:59']
      }
    }
  });
}

// Multiple ranges for break times
function setBreakSchedule() {
  picker.setOptions({
    clock: {
      disabledTime: {
        ranges: [
          '00:00 - 09:00',  // Before work
          '12:00 - 13:00',  // Lunch break
          '18:00 - 23:59'   // After work
        ]
      }
    }
  });
}

// 12h format ranges
const picker12h = new TimepickerUI('#picker-12h', {
  clock: {
    type: '12h',
    disabledTime: {
      ranges: '09:00 AM - 05:00 PM'
    }
  }
});
picker12h.create();

// Update 12h format ranges
picker12h.setOptions({
  clock: {
    disabledTime: {
      ranges: ['06:00 AM - 08:00 AM', '06:00 PM - 10:00 PM']
    }
  }
});`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
