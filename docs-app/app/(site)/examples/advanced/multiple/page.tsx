"use client";

import { useEffect, useId, useRef, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { TimepickerUI } from "timepicker-ui";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { Figure } from "@/components/figure";
import demo from "@/components/demo-controls.module.css";
import styles from "./page.module.css";
import "timepicker-ui/index.css";

export default function MultiplePickers() {
  const fieldId = useId();
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
      picker1Ref.current = new TimepickerUI(startTimeRef.current, options1);
      picker1Ref.current.create();
      picker2Ref.current = new TimepickerUI(endTimeRef.current, options2);
      picker2Ref.current.create();
    }

    return () => {
      picker1Ref.current?.destroy();
      picker2Ref.current?.destroy();
    };
  }, [options1, options2]);

  return (
    <div>
      <PageHeader
        title="Multiple Timepickers"
        description="Use multiple timepicker instances on the same page"
      />

      <Callout title="Multiple Instances">
        Each timepicker instance is independent. You can have as many pickers as
        needed with different configurations.
      </Callout>

      <Section title="Different Themes">
        <p>
          Two pickers with different themes on the same page:
        </p>

        <Figure
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
        >
          <div className={`${demo.form} ${styles.stage}`}>
            <div className={demo.field}>
              <label htmlFor={`${fieldId}-start`} className={demo.label}>
                Start Time (Basic Theme)
              </label>
              <input
                id={`${fieldId}-start`}
                ref={startTimeRef}
                type="text"
                placeholder="Select start time"
                className={demo.input}
              />
            </div>
            <div className={demo.field}>
              <label htmlFor={`${fieldId}-end`} className={demo.label}>
                End Time (Crane Straight Theme)
              </label>
              <input
                id={`${fieldId}-end`}
                ref={endTimeRef}
                type="text"
                placeholder="Select end time"
                className={demo.input}
              />
            </div>
          </div>
        </Figure>
      </Section>

      <Section title="Array of Pickers">
        <p>
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

      <Section title="Vanilla JavaScript">
        <p>
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
