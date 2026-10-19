import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const FUTURE_WEEKDAYS: DatepickerOptions = {
  calendar: { minDate: "today", disabledWeekdays: [0, 6] },
};

const FUTURE_WEEKDAYS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { minDate: "today", disabledWeekdays: [0, 6] },
}).create();`;

const LIMITS_CODE = `new DatepickerUI("#date", {
  calendar: { minDate: "2026-01-01", maxDate: "today" },
}).create();`;

const LISTS_CODE = `new DatepickerUI("#date", {
  calendar: {
    disabledDates: ["2026-12-25", new Date(2026, 11, 26)],
  },
}).create();

new DatepickerUI("#launch", {
  calendar: {
    enabledDates: ["2026-11-02", "2026-11-09", "2026-11-16"],
  },
}).create();`;

const FUNCTION_CODE = `new DatepickerUI("#date", {
  calendar: {
    isDateDisabled: (date) => date.getDate() === 13,
  },
}).create();`;

const ERROR_CODE = `picker.on("error", ({ code, reason, input }) => {
  if (code === "unavailable-date") {
    console.log(reason, input);
  }
});`;

const OPTIONS = [
  { option: "minDate", type: "Date | string | \"today\"", text: "Earliest selectable day. Strings are ISO YYYY-MM-DD." },
  { option: "maxDate", type: "Date | string | \"today\"", text: "Latest selectable day." },
  { option: "disabledDates", type: "(Date | string)[]", text: "Days that cannot be selected." },
  { option: "enabledDates", type: "(Date | string)[]", text: "When set, only these days can be selected." },
  { option: "disabledWeekdays", type: "number[]", text: "Weekdays that cannot be selected. 0 is Sunday and 6 is Saturday." },
  { option: "isDateDisabled", type: "(date: Date) => boolean", text: "Return true for a day that cannot be selected." },
];

const REASONS = [
  { reason: "min", text: "The date is before minDate." },
  { reason: "max", text: "The date is after maxDate." },
  { reason: "disabled", text: "The date is in disabledDates, outside enabledDates or refused by isDateDisabled." },
  { reason: "weekday", text: "The weekday is in disabledWeekdays." },
  { reason: "range-length", text: "A range is shorter than range.minLength or longer than range.maxLength." },
  { reason: "multiple-max", text: "A multiple selection is over multiple.max." },
];

const RELATED = [
  { href: "/datepicker/examples/constraints/min-max", title: "Min and max date example" },
  { href: "/datepicker/examples/constraints/disabled-dates", title: "Disabled dates example" },
  { href: "/datepicker/examples/selection/range-limits", title: "Range limits example" },
  { href: "/datepicker/docs/typed-input", title: "Typed input and validation" },
  { href: "/datepicker/api/events", title: "Events and error codes" },
];

export default function DisabledDatesPage() {
  return (
    <div>
      <PageHeader
        title="Disabled Dates and Date Limits"
        description="Decide which days @pglejzer/datepicker-ui, the companion of timepicker-ui, lets the user select. Six calendar options cover limits, lists, weekdays and a function."
      />

      <Section title="Options">
        <ApiTable
          rowKey="option"
          caption="calendar options that decide which days can be selected"
          columns={[
            { key: "option", label: "Option", mono: true },
            { key: "type", label: "Type", mono: true },
            { key: "text", label: "Description" },
          ]}
          rows={OPTIONS.map((row) => ({
            option: row.option,
            type: row.type,
            text: row.text,
          }))}
        />
      </Section>

      <Section title="Future dates and weekdays">
        <p>
          This demo disables every day before today and every Saturday and Sunday.
        </p>
        <DatepickerExample label="Future weekdays only" options={FUTURE_WEEKDAYS} code={FUTURE_WEEKDAYS_CODE} />
      </Section>

      <Section title="minDate and maxDate">
        <p>
          Both accept a <code>Date</code>, an ISO string or <code>&quot;today&quot;</code>.
        </p>
        <CodeBlock code={LIMITS_CODE} language="typescript" />
      </Section>

      <Section title="Lists of dates">
        <p>
          <code>disabledDates</code> blocks single days. <code>enabledDates</code> works the other way round: when
          it is set, only those days can be selected.
        </p>
        <CodeBlock code={LISTS_CODE} language="typescript" />
      </Section>

      <Section title="A function">
        <p>
          <code>isDateDisabled</code> runs for each day. An error thrown inside is rethrown asynchronously and the
          day counts as enabled.
        </p>
        <CodeBlock code={FUNCTION_CODE} language="typescript" />
        <Callout tone="note" title="Functions and server components">
          Functions cannot be passed from a server component to a client component. In Next.js, create the picker
          inside a client component, as shown in the <Link href="/datepicker/docs/frameworks">Frameworks</Link>{" "}
          guide.
        </Callout>
      </Section>

      <Section title="Error reasons">
        <p>
          When typed text is a date the picker refuses, it emits <code>error</code> with the code{" "}
          <code>unavailable-date</code>. <code>input</code> holds the text and <code>reason</code> says why. The
          type of <code>reason</code> is <code>UnavailableReason</code>.
        </p>
        <ApiTable
          rowKey="reason"
          columns={[
            { key: "reason", label: "Reason", mono: true },
            { key: "text", label: "Meaning" },
          ]}
          rows={REASONS.map((row) => ({ reason: <code>&quot;{row.reason}&quot;</code>, text: row.text }))}
        />
        <CodeBlock code={ERROR_CODE} language="typescript" />
      </Section>

      <Section title="Related">
        <ul>
          {RELATED.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
