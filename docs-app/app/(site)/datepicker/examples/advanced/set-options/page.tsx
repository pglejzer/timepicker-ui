"use client";

import { useCallback, useId, useRef, useState } from "react";
import type DatepickerUI from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { useDatepicker } from "@/lib/use-datepicker";
import styles from "../advanced.module.css";

type Mode = "single" | "range" | "multiple";
type Theme = "basic" | "crane" | "cyberpunk";

const THEMES: readonly Theme[] = ["basic", "crane", "cyberpunk"];
const MODES: readonly Mode[] = ["single", "range", "multiple"];
const MONTHS: readonly number[] = [1, 2];

const CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date");
picker.create();

picker.setOptions({ ui: { theme: "crane" } });
picker.setOptions({ calendar: { mode: "range" } });
picker.setOptions({ calendar: { months: 2 } });`;

export default function SetOptionsExamplePage() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<DatepickerUI | null>(null);
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState<Theme>("basic");
  const [mode, setMode] = useState<Mode>("single");
  const [months, setMonths] = useState(1);
  const [value, setValue] = useState("");

  const handlePicker = useCallback((picker: DatepickerUI | null) => {
    pickerRef.current = picker;
    setReady(picker !== null);
    setTheme("basic");
    setMode("single");
    setMonths(1);
  }, []);

  useDatepicker({ inputRef, onPicker: handlePicker, onValue: setValue });

  const chooseTheme = (next: Theme) => {
    pickerRef.current?.setOptions({ ui: { theme: next } });
    setTheme(next);
  };

  const chooseMode = (next: Mode) => {
    pickerRef.current?.setOptions({ calendar: { mode: next } });
    setMode(next);
  };

  const chooseMonths = (next: number) => {
    pickerRef.current?.setOptions({ calendar: { months: next } });
    setMonths(next);
  };

  return (
    <div>
      <PageHeader
        title="Dynamic Options"
        description={
          <>
            Change options of a live picker with <code>setOptions()</code>. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="setOptions()">
        <p>
          <code>picker.setOptions(patch)</code> merges a partial options object into the current options and applies
          it, then emits <code>update</code>. Use the buttons to change the theme, the selection mode and the number
          of months, and open the picker to see the result.
        </p>
        <Figure label="setOptions" code={CODE} status={value ? <output>{value}</output> : undefined}>
          <div className={styles.stage}>
            <div className={demo.field}>
              <label htmlFor={inputId} className={demo.label}>
                Date
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                placeholder="Select date"
                className={demo.input}
              />
            </div>
            <div>
              <span className={styles.groupLabel} id={`${inputId}-theme`}>
                Theme
              </span>
              <div className={styles.group} role="group" aria-labelledby={`${inputId}-theme`}>
                {THEMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`${demo.button} ${styles.pressed}`}
                    aria-pressed={theme === name}
                    disabled={!ready}
                    onClick={() => chooseTheme(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={styles.groupLabel} id={`${inputId}-mode`}>
                Mode
              </span>
              <div className={styles.group} role="group" aria-labelledby={`${inputId}-mode`}>
                {MODES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={`${demo.button} ${styles.pressed}`}
                    aria-pressed={mode === name}
                    disabled={!ready}
                    onClick={() => chooseMode(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={styles.groupLabel} id={`${inputId}-months`}>
                Months
              </span>
              <div className={styles.group} role="group" aria-labelledby={`${inputId}-months`}>
                {MONTHS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`${demo.button} ${styles.pressed}`}
                    aria-pressed={months === count}
                    disabled={!ready}
                    onClick={() => chooseMonths(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Figure>
        <Callout>
          Changing <code>calendar.mode</code> with <code>setOptions()</code> empties the selection. The width for{" "}
          <code>calendar.months</code> is read when the picker opens and on <code>setOptions()</code>.
        </Callout>
      </Section>
    </div>
  );
}
