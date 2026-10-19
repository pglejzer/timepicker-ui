"use client";

import { useMemo, useState } from "react";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

function price(date: Date): string | null {
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  return weekend ? null : `$${80 + ((date.getDate() * 7) % 90)}`;
}

const RANGE: DatepickerOptions = { calendar: { mode: "range", renderDate: price } };

const SINGLE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const price = (date) =>
  date.getDay() === 0 || date.getDay() === 6
    ? null
    : \`$\${80 + ((date.getDate() * 7) % 90)}\`;

const result = document.querySelector("#price");

new DatepickerUI("#date", {
  calendar: { renderDate: price },
  callbacks: {
    onConfirm: ({ value }) => {
      if (value && "date" in value) {
        result.textContent = \`\${value.formatted} · \${price(value.date) ?? "no price"}\`;
      }
    },
  },
}).create();`;

const RANGE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const price = (date) =>
  date.getDay() === 0 || date.getDay() === 6
    ? null
    : \`$\${80 + ((date.getDate() * 7) % 90)}\`;

new DatepickerUI("#date", {
  calendar: { mode: "range", renderDate: price },
}).create();`;

export default function PerDayContentExamplePage() {
  const [picked, setPicked] = useState("");
  const single = useMemo<DatepickerOptions>(
    () => ({
      calendar: { renderDate: price },
      callbacks: {
        onConfirm: ({ value }) => {
          if (value && "date" in value) {
            setPicked(`${value.formatted} · ${price(value.date) ?? "no price"}`);
          }
        },
      },
    }),
    [],
  );

  return (
    <div>
      <PageHeader
        title="Per-day Content"
        description={
          <>
            Show a price or any text under the day number. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Prices on weekdays">
        <p>
          <code>calendar.renderDate</code> returns a string, a DOM node, or <code>null</code> for no content. A
          string is always text, never HTML. The text is added to the accessible name of the day. Here every
          weekday shows a price.
        </p>
        <p>
          <code>renderDate</code> only draws the cell, so call the same function in <code>onConfirm</code> to
          read the price of the picked date.
        </p>
        <DatepickerExample
          label="Single"
          options={single}
          code={SINGLE_CODE}
          message={picked || undefined}
        />
      </Section>

      <Section title="In a range picker">
        <p>
          The same function works in <code>range</code> mode.
        </p>
        <DatepickerExample label="Range" inputLabel="Dates" options={RANGE} code={RANGE_CODE} />
        <Callout>
          Cells with content are taller, so the calendar grows. Keep the text short, such as a price or a count.
        </Callout>
      </Section>
    </div>
  );
}
