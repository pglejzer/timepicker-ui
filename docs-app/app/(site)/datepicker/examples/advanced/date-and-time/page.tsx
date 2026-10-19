"use client";

import { useId, useRef, useState } from "react";
import { Callout } from "@/components/callout";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { DATEPICKER_THEMES, isDatepickerTheme, type DatepickerThemeName } from "@/lib/datepicker";
import { useDatepicker } from "@/lib/use-datepicker";
import { useTimepicker } from "@/lib/use-timepicker";
import styles from "../advanced.module.css";

const CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import { TimepickerUI } from "timepicker-ui";
import "@pglejzer/datepicker-ui/index.css";
import "timepicker-ui/index.css";

const theme = "crane";

new DatepickerUI("#date", { ui: { theme } }).create();
new TimepickerUI("#time", { ui: { theme } }).create();`;

export default function DateAndTimeExamplePage() {
  const dateId = useId();
  const timeId = useId();
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState<DatepickerThemeName>("basic");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useDatepicker({ inputRef: dateRef, theme, onValue: setDate });
  useTimepicker({ inputRef: timeRef, theme, onValue: setTime });

  const chooseTheme = (next: string) => {
    if (isDatepickerTheme(next)) setTheme(next);
  };

  const combined = [date, time].filter((part) => part !== "").join(" at ");

  return (
    <div>
      <PageHeader
        title="Date and Time Picker"
        description={
          <>
            Pair a date field with a time field from timepicker-ui. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="One theme for both">
        <p>
          The two libraries are separate and do not depend on each other. Both accept the same ten theme names in{" "}
          <code>ui.theme</code>, so one value styles the date and the time field alike. Use the select to switch
          both at once.
        </p>
        <Figure
          label="Date and time"
          code={CODE}
          controls={
            <label className={styles.select}>
              <span className="sr-only">Theme</span>
              <select value={theme} onChange={(event) => chooseTheme(event.target.value)}>
                {DATEPICKER_THEMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          }
        >
          <div className={styles.stage}>
            <div className={demo.field}>
              <label htmlFor={dateId} className={demo.label}>
                Date
              </label>
              <input ref={dateRef} id={dateId} type="text" placeholder="Select date" className={demo.input} />
            </div>
            <div className={demo.field}>
              <label htmlFor={timeId} className={demo.label}>
                Time
              </label>
              <input ref={timeRef} id={timeId} type="text" placeholder="Select time" className={demo.input} />
            </div>
            <p className={demo.output}>
              Combined: <output>{combined === "" ? "nothing selected" : combined}</output>
            </p>
          </div>
        </Figure>
        <Callout>
          Import <code>timepicker-ui/index.css</code> next to <code>@pglejzer/datepicker-ui/index.css</code>. Each
          library styles its own picker. The time field has two more themes of its own, <code>dark</code> and{" "}
          <code>blueprint-dark</code>.
        </Callout>
      </Section>
    </div>
  );
}
