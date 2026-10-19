"use client";

import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const dayFromToday = (offset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};

const WEEKDAYS: DatepickerOptions = { calendar: { disabledWeekdays: [0, 6] } };

const LIST: DatepickerOptions = {
  calendar: { disabledDates: [dayFromToday(1), dayFromToday(2), dayFromToday(5)] },
};

const RULE: DatepickerOptions = {
  calendar: { isDateDisabled: (date) => date.getDate() === 1 || date.getDate() === 15 },
};

const ENABLED: DatepickerOptions = {
  calendar: { enabledDates: [dayFromToday(2), dayFromToday(4), dayFromToday(6)] },
};

const WEEKDAYS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { disabledWeekdays: [0, 6] },
}).create();`;

const LIST_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const dayFromToday = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};

new DatepickerUI("#date", {
  calendar: {
    disabledDates: [dayFromToday(1), dayFromToday(2), dayFromToday(5)],
  },
}).create();`;

const RULE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: {
    isDateDisabled: (date) => date.getDate() === 1 || date.getDate() === 15,
  },
}).create();`;

const ENABLED_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const dayFromToday = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date;
};

new DatepickerUI("#date", {
  calendar: {
    enabledDates: [dayFromToday(2), dayFromToday(4), dayFromToday(6)],
  },
}).create();`;

export default function DatepickerDisabledDatesExamplePage() {
  return (
    <div>
      <PageHeader
        title="Disabled Dates"
        description="Make weekdays, listed dates or any day you choose unselectable with @pglejzer/datepicker-ui."
      />

      <Section title="Weekdays">
        <p>
          <code>calendar.disabledWeekdays</code> takes weekday numbers, where <code>0</code> is Sunday and{" "}
          <code>6</code> is Saturday. This demo disables weekends.
        </p>
        <DatepickerExample label="Weekends" options={WEEKDAYS} code={WEEKDAYS_CODE} />
      </Section>

      <Section title="A list of dates">
        <p>
          <code>calendar.disabledDates</code> is a list of <code>Date</code> objects or ISO strings. The demo
          disables three days counted from today.
        </p>
        <DatepickerExample label="Disabled list" options={LIST} code={LIST_CODE} />
      </Section>

      <Section title="A custom rule">
        <p>
          <code>calendar.isDateDisabled</code> receives a <code>Date</code> and returns <code>true</code> for a day
          that cannot be selected. It adds to <code>minDate</code>, <code>maxDate</code>,{" "}
          <code>disabledDates</code> and <code>enabledDates</code>. This rule closes the 1st and the 15th of every
          month.
        </p>
        <DatepickerExample label="isDateDisabled" options={RULE} code={RULE_CODE} />
      </Section>

      <Section title="Only listed dates">
        <p>
          When <code>calendar.enabledDates</code> is set, only those days can be selected. Every other day is
          disabled.
        </p>
        <DatepickerExample label="enabledDates" options={ENABLED} code={ENABLED_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/disabled-dates">Disabled Dates</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
