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
  }, []); // Empty deps - run only once

  // Separate effect for updates
  useEffect(() => {
    if (pickerRef.current) {
      pickerRef.current.update({ options });
    }
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
      pickerRef.current.update({ options });
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

      <Section icon={RefreshCw} title="Update Method">
        <p className="text-muted-foreground mb-4">
          The update method allows you to change options without destroying the
          picker:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: { type: '12h' },
  ui: { theme: 'basic' }
});

picker.create();

// Later, update options
picker.update({
  options: {
    clock: { type: '24h' },
    ui: { theme: 'dark' }
  }
});

// Or with create option to reinitialize
picker.update({
  options: {
    clock: { type: '12h' }
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
    callbacks: {
      onConfirm: (data) => {
        console.log('New time selected:', data);
      },
      onCancel: () => {
        console.log('Selection cancelled');
      }
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
      ui: { theme: isDarkMode ? 'dark' : 'basic' }
    }
  });
}

// Update based on device
function updateForMobile(isMobile: boolean) {
  picker.update({
    options: {
      ui: {
        mobile: isMobile,
        animation: !isMobile // Disable animation on mobile
      }
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
  picker.update({
    options: {
      clock: {
        disabledTime: {
          hours: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
      }
    },
    create: true // Reinitialize to apply changes
  });
}

// Clear all restrictions
function clearRestrictions() {
  picker.update({
    options: {
      clock: {
        disabledTime: {}
      }
    },
    create: true
  });
}

// Update based on day of week
function updateForDayOfWeek() {
  const day = new Date().getDay();
  const isWeekend = day === 0 || day === 6;
  
  picker.update({
    options: {
      clock: {
        disabledTime: isWeekend
          ? {} // No restrictions on weekends
          : { hours: [0, 1, 2, 3, 4, 5, 6, 22, 23] } // Business hours only
      }
    },
    create: true
  });
}`}
          language="typescript"
        />
      </Section>

      <Section icon={RefreshCw} title="Update Disabled Intervals Dynamically">
        <p className="text-muted-foreground mb-4">
          Change disabled time intervals for business hours, shifts, or
          scheduling:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    disabledTime: {
      interval: '09:00 - 17:00' // Block business hours
    }
  }
});
picker.create();

// Update to block after-hours
function switchToAfterHoursBlock() {
  picker.update({
    options: {
      clock: {
        disabledTime: {
          interval: ['00:00 - 08:00', '18:00 - 23:59']
        }
      }
    },
    create: true
  });
}

// Multiple intervals for break times
function setBreakSchedule() {
  picker.update({
    options: {
      clock: {
        disabledTime: {
          interval: [
            '00:00 - 09:00',  // Before work
            '12:00 - 13:00',  // Lunch break  
            '18:00 - 23:59'   // After work
          ]
        }
      }
    },
    create: true
  });
}

// 12h format intervals
const picker12h = new TimepickerUI('#picker-12h', {
  clock: {
    type: '12h',
    disabledTime: {
      interval: '09:00 AM - 05:00 PM'
    }
  }
});

// Update 12h format intervals
picker12h.update({
  options: {
    clock: {
      disabledTime: {
        interval: ['06:00 AM - 08:00 AM', '06:00 PM - 10:00 PM']
      }
    }
  },
  create: true
});`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
