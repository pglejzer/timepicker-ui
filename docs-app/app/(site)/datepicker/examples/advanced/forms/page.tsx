"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { useDatepicker } from "@/lib/use-datepicker";
import styles from "../advanced.module.css";

type Entry = { key: string; value: string };

const CODE = `<form id="booking">
  <label for="checkin">Check-in</label>
  <input id="checkin" name="checkin" />
  <button type="submit">Submit</button>
</form>

<script type="module">
  import DatepickerUI from "@pglejzer/datepicker-ui";
  import "@pglejzer/datepicker-ui/index.css";

  new DatepickerUI("#checkin", { ui: { format: "dd.MM.yyyy" } }).create();

  document.querySelector("#booking").addEventListener("submit", (event) => {
    event.preventDefault();
    console.log(Object.fromEntries(new FormData(event.currentTarget)));
  });
</script>`;

const RANGE_CODE = `<input id="start" name="checkin" />
<input id="end" name="checkout" />

<script type="module">
  import DatepickerUI from "@pglejzer/datepicker-ui";
  import "@pglejzer/datepicker-ui/index.css";

  new DatepickerUI("#start", {
    calendar: { mode: "range" },
    ui: { endInput: "#end" },
  }).create();
</script>`;

const FORMAT_OPTIONS: DatepickerOptions = { ui: { format: "dd.MM.yyyy" } };

export default function FormsExamplePage() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useDatepicker({ inputRef, options: FORMAT_OPTIONS });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setEntries(Array.from(data.entries(), ([key, value]) => ({ key, value: String(value) })));
  };

  const reset = () => setEntries(null);

  return (
    <div>
      <PageHeader
        title="Date Picker in a Form"
        description={
          <>
            Submit ISO dates from a plain HTML form while the field shows a local format. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Hidden ISO value">
        <p>
          When the input has a <code>name</code>, the picker moves the name to a hidden input placed after it. The
          form submits the ISO value (<code>YYYY-MM-DD</code>) instead of the displayed text. The hidden input is
          removed and the name restored on <code>destroy()</code>. Pick a date and submit the form to see what it
          sends.
        </p>
        <Figure label="Form" code={CODE}>
          <form className={styles.stage} onSubmit={submit} onReset={reset}>
            <div className={demo.field}>
              <label htmlFor={inputId} className={demo.label}>
                Check-in
              </label>
              <input
                ref={inputRef}
                id={inputId}
                name="checkin"
                type="text"
                placeholder="dd.MM.yyyy"
                className={demo.input}
              />
            </div>
            <div className={styles.group}>
              <button type="submit" className={demo.button}>
                Submit
              </button>
              <button type="reset" className={demo.buttonSecondary}>
                Reset
              </button>
            </div>
            <div aria-live="polite">
              {entries !== null && entries.length === 0 && <p className={demo.hint}>The form sent no fields.</p>}
              {entries !== null && entries.length > 0 && (
                <div className={styles.entries}>
                  {entries.map((entry) => (
                    <div key={entry.key} className={styles.entry}>
                      <span className={styles.entryKey}>{entry.key}</span>
                      <output>{entry.value === "" ? "(empty)" : entry.value}</output>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </Figure>
        <Callout>
          The visible input gets <code>input</code> and <code>change</code> events when a value is committed, and a
          form reset restores the initial value. In <code>range</code> mode an incomplete range gives an empty
          string.
        </Callout>
      </Section>

      <Section title="Two fields for a range">
        <p>
          With <code>ui.endInput</code>, each field with a <code>name</code> gets its own hidden ISO input.
        </p>
        <CodeBlock code={RANGE_CODE} language="html" />
      </Section>
    </div>
  );
}
