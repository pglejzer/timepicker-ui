"use client";

import { useId, useRef, useState } from "react";
import type { PickerValue } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { useDatepicker } from "@/lib/use-datepicker";
import styles from "../advanced.module.css";

const CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date");
picker.create();

picker.open();
picker.setValue("2026-03-14");
picker.getValue(); // { value: "2026-03-14", date: Date, formatted: "03/14/2026" }
picker.setValue(null);
picker.close();`;

function describe(value: PickerValue | null): string {
  if (value === null) return "null";
  if ("value" in value) return `${value.value} (${value.formatted})`;
  return "not a single date";
}

export default function ExternalApiExamplePage() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState("");

  const pickerRef = useDatepicker({ inputRef });

  const open = () => pickerRef.current?.open();
  const close = () => pickerRef.current?.close();
  const setDate = () => pickerRef.current?.setValue("2026-03-14");
  const clearDate = () => pickerRef.current?.setValue(null);
  const readValue = () => {
    const picker = pickerRef.current;
    if (picker) setResult(describe(picker.getValue()));
  };

  return (
    <div>
      <PageHeader
        title="External API"
        description={
          <>
            Drive a picker from your own buttons and code. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="open, setValue, getValue, close">
        <p>
          The methods of the instance work without any user input. <code>setValue()</code> takes a{" "}
          <code>Date</code> or an ISO string and writes the input text. <code>getValue()</code> returns the
          committed value, or <code>null</code>.
        </p>
        <Figure label="External API" code={CODE}>
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
            <div className={styles.group}>
              <button type="button" className={demo.button} onClick={open}>
                open()
              </button>
              <button type="button" className={demo.buttonSecondary} onClick={setDate}>
                setValue(&quot;2026-03-14&quot;)
              </button>
              <button type="button" className={demo.buttonSecondary} onClick={readValue}>
                getValue()
              </button>
              <button type="button" className={demo.buttonSecondary} onClick={clearDate}>
                setValue(null)
              </button>
              <button type="button" className={demo.buttonSecondary} onClick={close}>
                close()
              </button>
            </div>
            <p className={demo.output} aria-live="polite">
              getValue(): <output>{result === "" ? "not read yet" : result}</output>
            </p>
          </div>
        </Figure>
        <Callout>
          <code>setValue()</code> does not emit <code>confirm</code>. The shape of the value has to match{" "}
          <code>calendar.mode</code>, otherwise an <code>error</code> event with the code{" "}
          <code>invalid-date</code> is emitted.
        </Callout>
      </Section>
    </div>
  );
}
