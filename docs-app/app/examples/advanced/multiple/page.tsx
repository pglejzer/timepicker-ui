"use client";

import { useEffect, useRef, useMemo } from "react";
import { TimepickerUI } from "timepicker-ui";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Clock, Users } from "lucide-react";
import { InfoBox } from "@/components/info-box";
import "timepicker-ui/index.css";

export default function MultiplePickers() {
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const picker1Ref = useRef<TimepickerUI | null>(null);
  const picker2Ref = useRef<TimepickerUI | null>(null);

  const options1 = useMemo(
    () => ({
      ui: { theme: "basic" as const },
    }),
    []
  );

  const options2 = useMemo(
    () => ({
      ui: { theme: "crane-straight" as const },
    }),
    []
  );

  useEffect(() => {
    if (startTimeRef.current && endTimeRef.current) {
      // @ts-ignore
      picker1Ref.current = new TimepickerUI(startTimeRef.current, options1);
      picker1Ref.current.create();
      // @ts-ignore
      picker2Ref.current = new TimepickerUI(endTimeRef.current, options2);
      picker2Ref.current.create();
    }

    return () => {
      picker1Ref.current?.destroy();
      picker2Ref.current?.destroy();
    };
  }, []);

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Multiple Timepickers
        </h1>
        <p className="text-lg text-muted-foreground">
          Use multiple timepicker instances on the same page
        </p>
      </div>

      <InfoBox title="Multiple Instances" variant="blue" className="mb-8">
        Each timepicker instance is independent. You can have as many pickers as
        needed with different configurations.
      </InfoBox>

      <Section icon={Clock} title="Different Themes">
        <p className="text-muted-foreground mb-4">
          Two pickers with different themes on the same page:
        </p>

        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              Start Time (Basic Theme)
            </label>
            <input
              ref={startTimeRef}
              type="text"
              placeholder="Select start time"
              className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">
              End Time (Crane Theme)
            </label>
            <input
              ref={endTimeRef}
              type="text"
              placeholder="Select end time"
              className="w-full max-w-xs rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function MultipleTimepickers() {
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const picker1Ref = useRef<TimepickerUI | null>(null);
  const picker2Ref = useRef<TimepickerUI | null>(null);

  const options1 = useMemo(() => ({
    ui: { theme: 'basic' },
  }), []);

  const options2 = useMemo(() => ({
    ui: { theme: 'crane-straight' },
  }), []);

  useEffect(() => {
    if (startTimeRef.current && endTimeRef.current) {
      picker1Ref.current = new TimepickerUI(
        startTimeRef.current, 
        options1
      );
      picker1Ref.current.create();

      picker2Ref.current = new TimepickerUI(
        endTimeRef.current, 
        options2
      );
      picker2Ref.current.create();
    }

    return () => {
      picker1Ref.current?.destroy();
      picker2Ref.current?.destroy();
    };
  }, []);

  return (
    <>
      <input ref={startTimeRef} type="text" />
      <input ref={endTimeRef} type="text" />
    </>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section icon={Users} title="Array of Pickers">
        <p className="text-muted-foreground mb-4">
          Managing multiple pickers using an array pattern:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function MultiplePickersArray() {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const pickersRef = useRef<TimepickerUI[]>([]);

  useEffect(() => {
    // Initialize all pickers
    inputRefs.current.forEach((input, index) => {
      if (input) {
        const picker = new TimepickerUI(input, {
          ui: { theme: index % 2 === 0 ? 'basic' : 'dark' },
        });
        picker.create();
        pickersRef.current.push(picker);
      }
    });

    // Cleanup all pickers
    return () => {
      pickersRef.current.forEach(picker => picker.destroy());
      pickersRef.current = [];
    };
  }, []);

  return (
    <div>
      {['Morning', 'Afternoon', 'Evening'].map((label, i) => (
        <input
          key={label}
          ref={el => inputRefs.current[i] = el!}
          type="text"
          placeholder={\`Select \${label} time\`}
        />
      ))}
    </div>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section icon={Clock} title="Vanilla JavaScript">
        <p className="text-muted-foreground mb-4">
          Multiple pickers in vanilla JavaScript:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

// Select all timepicker inputs
const inputs = document.querySelectorAll('.timepicker-input');

// Store pickers for cleanup
const pickers = [];

// Initialize each picker
inputs.forEach((input, index) => {
  const picker = new TimepickerUI(input, {
    ui: { theme: index % 2 === 0 ? 'basic' : 'dark' },
    clock: { type: '24h' }
  });
  
  picker.create();
  pickers.push(picker);
});

// Cleanup when needed
function destroyAllPickers() {
  pickers.forEach(picker => picker.destroy());
  pickers.length = 0;
}`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
