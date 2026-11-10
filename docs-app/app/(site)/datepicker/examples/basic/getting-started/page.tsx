"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { DatepickerOptions, PickerValue } from "@pglejzer/datepicker-ui";
import demo from "@/components/demo-controls.module.css";
import { DatepickerExample } from "@/components/datepicker-example";
import { Figure } from "@/components/figure";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { useDatepicker } from "@/lib/use-datepicker";

const DEFAULT_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date").create();`;

const DEFAULT_VALUE: DatepickerOptions = { calendar: { defaultValue: "today" } };

const DEFAULT_VALUE_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { defaultValue: "today" },
}).create();`;

const CONFIRM_CODE =`import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const output = document.querySelector("#confirmed");

new DatepickerUI("#date", {
  callbacks: {
    onConfirm: ({ value }) => {
      output.textContent = value && "value" in value ? value.value : "";
    },
  },
}).create();`;

function isoOf(value: PickerValue | null): string {
  return value !== null && "value" in value ? value.value : "";
}

function ConfirmDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirmed, setConfirmed] = useState("");
  const options = useMemo<DatepickerOptions>(
    () => ({
      callbacks: {
        onConfirm: ({ value }) => setConfirmed(isoOf(value)),
      },
    }),
    [],
  );

  useDatepicker({ inputRef, options });

  return (
    <Figure label="onConfirm" code={CONFIRM_CODE}>
      <div className={demo.form}>
        <div className={demo.field}>
          <label htmlFor="dp-getting-started-confirm" className={demo.label}>
            Date
          </label>
          <input
            ref={inputRef}
            id="dp-getting-started-confirm"
            type="text"
            placeholder="Select date"
            className={demo.input}
          />
        </div>
        <output className={demo.output}>
          {confirmed ? `Confirmed value: ${confirmed}` : "Nothing confirmed yet"}
        </output>
      </div>
    </Figure>
  );
}

export default function DatepickerGettingStartedExamplePage() {
  return (
    <div>
      <PageHeader
        title="Getting Started"
        description="Small date picker examples built with @pglejzer/datepicker-ui, the companion of timepicker-ui."
      />

      <Section title="Default picker">
        <p>
          Pass a selector and call <code>create()</code>. A bare <code>&lt;input&gt;</code> is wrapped in a{" "}
          <code>div.dp-ui</code> host. With no options the picker selects a single date and opens as a docked
          popover, or as a modal on small windows.
        </p>
        <DatepickerExample label="Default" code={DEFAULT_CODE} />
      </Section>

      <Section title="Start with a value">
        <p>
          <code>calendar.defaultValue</code> sets the starting value of an empty input, in the same shape as{" "}
          <code>setValue()</code>. Any date can be <code>&quot;today&quot;</code>, which the browser resolves when{" "}
          <code>create()</code> runs. Text already in the input wins, and a form reset restores the value.
        </p>
        <DatepickerExample label="Default value" options={DEFAULT_VALUE} code={DEFAULT_VALUE_CODE} />
      </Section>

      <Section title="Read the confirmed value">
        <p>
          <code>callbacks.onConfirm</code> receives <code>{"{ value, autoCommit }"}</code>. In single mode{" "}
          <code>value.value</code> is the ISO date <code>YYYY-MM-DD</code>, whatever format the input shows.{" "}
          <code>value</code> is <code>null</code> when the field was cleared.
        </p>
        <ConfirmDemo />
      </Section>

      <p>
        Docs: <Link href="/datepicker/quick-start">Quick Start</Link> ·{" "}
        <Link href="/datepicker/api/events">Events</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
