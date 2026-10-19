"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DatepickerOptions, PickerValue } from "@pglejzer/datepicker-ui";
import demo from "@/components/demo-controls.module.css";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const WEEKDAYS_ONLY = "Pick a weekday";

function weekdayError(value: PickerValue | null): string {
  if (value === null || !("date" in value)) return "";
  const day = value.date.getDay();
  return day === 0 || day === 6 ? WEEKDAYS_ONLY : "";
}

const CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const message = document.querySelector("#date-message");

new DatepickerUI("#date", {
  calendar: {
    validate: (value) => {
      if (value === null || !("date" in value)) return null;
      const day = value.date.getDay();
      return day === 0 || day === 6 ? "Pick a weekday" : null;
    },
  },
  callbacks: {
    onError: ({ message: text }) => {
      message.textContent = text;
    },
    onConfirm: ({ value }) => {
      message.textContent = value && "date" in value && [0, 6].includes(value.date.getDay())
        ? "Pick a weekday"
        : "";
    },
  },
}).create();`;

export default function DatepickerValidationExamplePage() {
  const [error, setError] = useState("");
  const options = useMemo<DatepickerOptions>(
    () => ({
      calendar: {
        validate: (value) => weekdayError(value) || null,
      },
      callbacks: {
        onError: ({ message }) => setError(message),
        onConfirm: ({ value }) => setError(weekdayError(value)),
      },
    }),
    [],
  );

  return (
    <div>
      <PageHeader
        title="Validation"
        description="Mark a date invalid with your own message using calendar.validate in @pglejzer/datepicker-ui."
      />

      <Section title="Weekdays only">
        <p>
          <code>calendar.validate</code> runs on the presented value (<code>null</code> when empty) after{" "}
          <code>setValue()</code>, typed input and every commit. Return a message to mark the input invalid, or{" "}
          <code>null</code>, <code>undefined</code> or an empty string when the value is fine. It never blocks a
          pick or a commit.
        </p>
        <p>
          A message sets <code>aria-invalid</code> on the input and emits an <code>error</code> event with the code{" "}
          <code>invalid-value</code>. The demo shows it under the field, wired to the input with{" "}
          <code>aria-describedby</code>. Pick a Saturday or a Sunday and confirm to see it.
        </p>
        <DatepickerExample
          label="Weekdays only"
          options={options}
          code={CODE}
          message={
            error ? (
              <span role="alert" className={demo.error}>
                {error}
              </span>
            ) : undefined
          }
        />
      </Section>

      <Section title="Typed dates">
        <p>
          Typed text that is not a date, or a date outside <code>minDate</code> and <code>maxDate</code>, emits{" "}
          <code>error</code> with the code <code>invalid-date</code> or <code>unavailable-date</code>. The default
          messages are <code>labels.invalidDate</code> and <code>labels.unavailableDate</code>. The same{" "}
          <code>onError</code> callback receives them, so the message above covers those cases too.
        </p>
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/typed-input">Typed Input</Link> ·{" "}
        <Link href="/datepicker/api/events">Events</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
