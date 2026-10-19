"use client";

import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const DECORATED: DatepickerOptions = {
  calendar: {
    decorateDate: (date) => {
      if (date.getDate() === 1) return { badge: true, label: "Billing day" };
      if (date.getDate() === 15) return { badge: true, label: "Payday" };
      return undefined;
    },
  },
};

const DECORATED_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: {
    decorateDate: (date) => {
      if (date.getDate() === 1) return { badge: true, label: "Billing day" };
      if (date.getDate() === 15) return { badge: true, label: "Payday" };
      return undefined;
    },
  },
}).create();`;

export default function DecorateDatesExamplePage() {
  return (
    <div>
      <PageHeader
        title="Decorated Dates"
        description={
          <>
            Mark days with a badge, a class or an accessible label. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Badges with labels">
        <p>
          <code>calendar.decorateDate</code> receives each day as a <code>Date</code> and returns a{" "}
          <code>DateDecoration</code> or <code>undefined</code>. <code>badge: true</code> draws a small dot,{" "}
          <code>label</code> is appended to the accessible name of the day, and <code>className</code> adds a class
          to the day cell. Here the 1st and the 15th of every month get a badge.
        </p>
        <DatepickerExample label="Badges" options={DECORATED} code={DECORATED_CODE} />
      </Section>
    </div>
  );
}
