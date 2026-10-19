import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const MONTH: DatepickerOptions = { calendar: { precision: "month" } };
const YEAR: DatepickerOptions = { calendar: { precision: "year" } };
const START_VIEW: DatepickerOptions = { ui: { startView: "year" } };

const MONTH_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#month", {
  calendar: { precision: "month" },
}).create();`;

const YEAR_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#year", {
  calendar: { precision: "year" },
}).create();`;

const START_VIEW_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#birthday", {
  ui: { startView: "year" },
}).create();`;

const RELATED = [
  { href: "/datepicker/examples/features/month-picker", title: "Month picker example" },
  { href: "/datepicker/examples/features/year-picker", title: "Year picker example" },
  { href: "/datepicker/examples/features/start-view", title: "Start view example" },
  { href: "/datepicker/docs/typed-input", title: "Typed input and format" },
];

export default function PrecisionPage() {
  return (
    <div>
      <PageHeader
        title="Month and Year Pickers"
        description="calendar.precision makes @pglejzer/datepicker-ui, the companion of timepicker-ui, select a whole month or year instead of a day."
      />

      <Section title="Month precision">
        <p>
          <code>calendar.precision</code> is <code>&quot;day&quot;</code> (the default), <code>&quot;month&quot;</code>{" "}
          or <code>&quot;year&quot;</code>. The picker then selects a whole month or year. It works in single mode
          only. Another mode emits <code>invalid-option</code> and uses <code>&quot;day&quot;</code>.
        </p>
        <DatepickerExample label="Month" options={MONTH} code={MONTH_CODE} />
        <p>
          A docked month picker opens on the month grid and a modal one adds a year button above it. A month can be
          picked when any of its days is available.
        </p>
      </Section>

      <Section title="Year precision">
        <DatepickerExample label="Year" options={YEAR} code={YEAR_CODE} />
        <p>
          A year picker opens on the year grid. A year can be picked when it is inside <code>minDate</code>,{" "}
          <code>maxDate</code> and <code>ui.yearRange</code>.
        </p>
      </Section>

      <Section title="Value format">
        <p>
          The value is the first day of the period, and <code>DateValue.value</code> is <code>YYYY-MM</code> for
          months and <code>YYYY</code> for years. The input text drops the finer parts of the format, so{" "}
          <code>MM/dd/yyyy</code> shows <code>10/2026</code>, and typing <code>10/2026</code> works.{" "}
          <code>setValue()</code> accepts a <code>Date</code>, <code>&quot;2026-10&quot;</code> or{" "}
          <code>&quot;2026-10-17&quot;</code>.
        </p>
        <p>
          With <code>precision: &quot;month&quot;</code> the <code>ui.format</code> pattern may leave out the day (
          <code>&quot;MM/yyyy&quot;</code>, <code>&quot;yyyy-MM&quot;</code>), and with <code>&quot;year&quot;</code> it
          may be the year alone (<code>&quot;yyyy&quot;</code>). A full pattern works too: the parts finer than the
          precision are dropped, so <code>&quot;dd.MM.yyyy&quot;</code> shows <code>10.2026</code> for a month.
        </p>
        <p>
          At these precisions <code>select:day</code> carries the picked period in <code>value.value</code>. There is
          no input view, and <code>ui.mask</code> and <code>ui.startView</code> do not apply.
        </p>
      </Section>

      <Section title="Start view">
        <p>
          <code>ui.startView</code> (<code>&quot;day&quot;</code>, <code>&quot;month&quot;</code> or{" "}
          <code>&quot;year&quot;</code>) decides which panel opens first. A docked picker opens the month or year
          menu, and a modal picker opens the month grid or year grid. It suits a birthday field.
        </p>
        <DatepickerExample label="Start view" options={START_VIEW} code={START_VIEW_CODE} />
        <Callout title="When startView is ignored">
          <code>ui.initialView: &quot;input&quot;</code> wins over <code>startView</code>. It is also ignored in
          range mode and when <code>calendar.precision</code> is not <code>&quot;day&quot;</code>.
        </Callout>
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
