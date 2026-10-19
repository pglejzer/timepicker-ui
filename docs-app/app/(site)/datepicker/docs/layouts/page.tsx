"use client";

import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const DAY = 24 * 60 * 60 * 1000;

const MONTHS: DatepickerOptions = { calendar: { months: 2, pageBy: "view" } };

const PRESETS: DatepickerOptions = {
  calendar: {
    mode: "range",
    range: {
      presets: [
        {
          label: "Last 7 days",
          value: () => ({ start: new Date(Date.now() - 6 * DAY), end: new Date() }),
        },
        {
          label: "Q4 2026",
          value: { start: "2026-10-01", end: "2026-12-31" },
        },
      ],
    },
  },
};

const END_INPUT: DatepickerOptions = { calendar: { mode: "range" } };

const PRICES: DatepickerOptions = {
  calendar: {
    renderDate: (date) => (date.getDate() % 3 === 0 ? `$${80 + date.getDate() * 2}` : null),
  },
};

const FIXED: DatepickerOptions = { ui: { fixedWeeks: true, outsideDays: { selectable: false } } };

const MONTHS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { months: 2, pageBy: "view" },
}).create();`;

const PRESETS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const day = 24 * 60 * 60 * 1000;

new DatepickerUI("#range", {
  calendar: {
    mode: "range",
    range: {
      presets: [
        {
          label: "Last 7 days",
          value: () => ({
            start: new Date(Date.now() - 6 * day),
            end: new Date(),
          }),
        },
        {
          label: "Q4 2026",
          value: { start: "2026-10-01", end: "2026-12-31" },
        },
      ],
    },
  },
}).create();`;

const END_HTML = `<input id="start" name="checkin" />
<input id="end" name="checkout" />`;

const END_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#start", {
  calendar: { mode: "range" },
  ui: { endInput: "#end" },
}).create();`;

const END_CSS = `.dp-ui__input--active {
  outline: 2px solid #6750a4;
}`;

const FIXED_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { fixedWeeks: true, outsideDays: { selectable: false } },
}).create();`;

const PRICES_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: {
    renderDate: (date) =>
      date.getDate() % 3 === 0 ? \`$\${80 + date.getDate() * 2}\` : null,
  },
}).create();`;

const DECORATE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: {
    decorateDate: (date) =>
      date.getDay() === 5
        ? { className: "payday", badge: true, label: "Payday" }
        : undefined,
  },
}).create();`;

const DECORATION_FIELDS = [
  { field: "className", text: "Added to the day cell." },
  { field: "badge", text: "Shows a small dot." },
  { field: "label", text: "Appended to the accessible name of the day." },
];

const RELATED = [
  { href: "/datepicker/examples/features/several-months", title: "Several months example" },
  { href: "/datepicker/examples/selection/range-presets", title: "Range presets example" },
  { href: "/datepicker/examples/selection/two-fields", title: "Two range fields example" },
  { href: "/datepicker/examples/features/outside-days", title: "Outside days example" },
  { href: "/datepicker/examples/features/decorate-dates", title: "Decorated dates example" },
  { href: "/datepicker/examples/features/per-day-content", title: "Per-day content example" },
  { href: "/datepicker/api/options", title: "Options reference" },
];

export default function LayoutsPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Layouts and Fields"
        description="Several months, range presets, two fields for a range and per-day content. All of these are opt-in in @pglejzer/datepicker-ui, the companion of timepicker-ui."
      />

      <Section title="Several months">
        <p>
          <code>calendar.months</code> shows months side by side in a docked or inline picker. The picker shows as
          many months as fit the width, up to the number you set. The width is read when the picker opens and on{" "}
          <code>setOptions()</code>, not on resize. A modal picker always shows one month, and a range picker in a
          modal or full screen keeps its vertical month list.
        </p>
        <DatepickerExample label="Two months" options={MONTHS} code={MONTHS_CODE} />
        <p>
          <code>calendar.pageBy</code> sets how far the arrows and swipes move: <code>&quot;view&quot;</code> (the
          default) pages by the number of months shown, <code>&quot;month&quot;</code> by one. Outside days are not
          shown with several months. The <code>navigate</code> event reports the first month shown.
        </p>
      </Section>

      <Section title="Range presets">
        <p>
          <code>calendar.range.presets</code> adds shortcuts for ranges. A <code>value</code> is a{" "}
          <code>{"{ start, end }"}</code> object of dates or ISO strings, or a function returning one. The function
          runs each time the picker refreshes, so relative presets stay current.
        </p>
        <DatepickerExample label="Presets" options={PRESETS} code={PRESETS_CODE} />
        <p>
          Presets show as a column beside the calendar in a docked or inline picker when there is room, and as a
          row of chips under the header otherwise. A modal and a full-screen picker always use the chip row. They
          are hidden in the input view. <code>labels.presets</code> names the group.
        </p>
        <p>
          A click completes the range as if the user had picked both ends. It emits <code>range:end</code>, not{" "}
          <code>select:day</code>, and follows <code>behavior.closeOnSelect</code> and{" "}
          <code>behavior.commitOnChange</code>. A preset is disabled when its value is invalid or the limits refuse
          the range.
        </p>
      </Section>

      <Section title="Two fields for a range">
        <p>
          <code>ui.endInput</code> takes the selector or element of a second <code>&lt;input&gt;</code> on your
          page. The page owns both inputs, their labels, styling and <code>name</code>s. It is read on{" "}
          <code>create()</code> and only used in range mode. A value that is not an <code>&lt;input&gt;</code>{" "}
          emits <code>invalid-option</code> and the picker keeps one field.
        </p>
        <CodeBlock code={END_HTML} language="html" />
        <DatepickerExample label="Two fields" endInput options={END_INPUT} code={END_CODE} />
        <p>
          Each field shows its own date. Clicking or pressing Alt+Down Arrow in the End field opens the picker on
          the end, and the class <code>dp-ui__input--active</code> marks the field that the next pick fills.
          Picking the start makes End active. The picker does not style your inputs, so add your own rule for that
          class:
        </p>
        <CodeBlock code={END_CSS} language="css" />
        <p>
          Typing commits only a full pair, or two empty fields. A half-filled pair commits nothing and shows no
          error. A reversed pair emits <code>invalid-date</code> with <code>labels.invalidRange</code> on the End
          field. <code>ui.mask</code> works in both fields.
        </p>
      </Section>

      <Section title="Fixed weeks and outside days">
        <p>
          <code>ui.fixedWeeks</code> always renders six rows, so the picker keeps one height from month to month.{" "}
          <code>ui.outsideDays: true</code> shows neighbouring days and keeps them selectable.{" "}
          <code>{"{ selectable: false }"}</code> shows them dimmed and inert: they get{" "}
          <code>dp-ui__date--disabled</code> and <code>aria-disabled</code>, and clicks are ignored.
        </p>
        <DatepickerExample label="Fixed weeks" options={FIXED} code={FIXED_CODE} />
      </Section>

      <Section title="Per-day content">
        <p>
          <code>calendar.renderDate</code> returns content shown under the day number, such as a price. Return a
          string, a <code>Node</code>, or <code>null</code> for nothing. A string is always text and never HTML. The
          text is also appended to the accessible name of the day. An error thrown inside is rethrown
          asynchronously and the day gets no content.
        </p>
        <DatepickerExample label="Prices" options={PRICES} code={PRICES_CODE} />
        <p>
          Cells with content get the class <code>dp-ui__date--has-content</code>, and the rows grow to fit it.
        </p>
      </Section>

      <Section title="Decorating days">
        <p>
          <code>calendar.decorateDate</code> returns a <code>DateDecoration</code> for a day, or{" "}
          <code>undefined</code>. An error thrown inside is rethrown asynchronously and the day counts as
          undecorated.
        </p>
        <ApiTable
          rowKey="field"
          caption="DateDecoration"
          columns={[
            { key: "field", label: "Field", mono: true },
            { key: "text", label: "Effect" },
          ]}
          rows={DECORATION_FIELDS.map((row) => ({ field: row.field, text: row.text }))}
        />
        <CodeBlock code={DECORATE_CODE} language="typescript" />
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
