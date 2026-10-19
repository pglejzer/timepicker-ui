import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const SINGLE: DatepickerOptions = { calendar: { mode: "single" } };
const RANGE: DatepickerOptions = { calendar: { mode: "range", range: { minLength: 2, maxLength: 14 } } };
const MULTIPLE: DatepickerOptions = { calendar: { mode: "multiple", multiple: { max: 5 } } };

const SINGLE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date", { calendar: { mode: "single" } });
picker.create();

picker.setValue("2025-03-14");
picker.getValue();
// { value: "2025-03-14", date: Date, formatted: "14/03/2025" }`;

const RANGE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#range", {
  calendar: { mode: "range", range: { minLength: 2, maxLength: 14 } },
});
picker.create();

picker.setValue({ start: "2025-03-14", end: "2025-03-20" });
picker.getValue();
// { start: DateValue, end: DateValue }`;

const MULTIPLE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#dates", {
  calendar: { mode: "multiple", multiple: { max: 5 } },
});
picker.create();

picker.setValue(["2025-03-14", "2025-03-16"]);
picker.getValue();
// DateValue[], sorted`;

const DATE_VALUE_CODE = `type DateValue = {
  value: string;     // ISO YYYY-MM-DD
  date: Date;        // local midnight
  formatted: string; // the text as the input shows it
};`;

const FORM_HTML = `<form>
  <input id="date" name="birthday" />
  <button type="submit">Send</button>
</form>`;

const MODES = [
  {
    mode: "single",
    get: "DateValue or null",
    set: "Date, ISO string \"2025-03-14\", null",
  },
  {
    mode: "range",
    get: "{ start: DateValue, end: DateValue } or null",
    set: "{ start, end } of dates, null",
  },
  {
    mode: "multiple",
    get: "DateValue[] (sorted) or null",
    set: "an array of dates, null",
  },
];

const HIDDEN = [
  { mode: "single", value: "2025-03-14" },
  { mode: "range", value: "2025-03-14/2025-03-20" },
  { mode: "multiple", value: "2025-03-14,2025-03-16" },
];

const RELATED = [
  { href: "/datepicker/examples/selection/range", title: "Date range example" },
  { href: "/datepicker/examples/selection/multiple", title: "Multiple dates example" },
  { href: "/datepicker/examples/selection/range-limits", title: "Range limits example" },
  { href: "/datepicker/api/methods", title: "Methods reference" },
  { href: "/datepicker/api/typescript", title: "TypeScript types" },
];

export default function SelectionModesPage() {
  return (
    <div>
      <PageHeader
        title="Single, Range and Multiple Date Selection"
        description="calendar.mode sets what @pglejzer/datepicker-ui, the companion of timepicker-ui, lets the user select. getValue() returns a different shape for each mode."
      />

      <Section title="Selection modes">
        <p>
          <code>calendar.mode</code> is <code>&quot;single&quot;</code> (the default), <code>&quot;range&quot;</code> or{" "}
          <code>&quot;multiple&quot;</code>.
        </p>
        <ApiTable
          rowKey="mode"
          columns={[
            { key: "mode", label: "Mode", mono: true },
            { key: "get", label: "getValue() returns" },
            { key: "set", label: "setValue() accepts" },
          ]}
          rows={MODES.map((row) => ({
            mode: <code>&quot;{row.mode}&quot;</code>,
            get: row.get,
            set: row.set,
          }))}
        />
        <p>
          <code>DateValue</code> has three fields. <code>getValue()</code> returns <code>null</code> when nothing is
          committed or a range has no end yet. <code>setValue()</code> emits an <code>error</code> event with the
          code <code>invalid-date</code> when the value does not fit the mode, and it does not emit{" "}
          <code>confirm</code>.
        </p>
        <CodeBlock code={DATE_VALUE_CODE} language="typescript" />
      </Section>

      <Section title="Single date">
        <DatepickerExample label="Single" options={SINGLE} code={SINGLE_CODE} />
      </Section>

      <Section title="Date range">
        <p>
          <code>calendar.range.minLength</code> and <code>calendar.range.maxLength</code> bound a range in days,
          both ends included. The demo accepts 2 to 14 days.
        </p>
        <DatepickerExample label="Range" options={RANGE} code={RANGE_CODE} />
      </Section>

      <Section title="Multiple dates">
        <p>
          <code>calendar.multiple.max</code> bounds the number of dates. Clicking a selected day removes it.{" "}
          <code>behavior.closeOnSelect</code> is not used in this mode.
        </p>
        <DatepickerExample label="Multiple" options={MULTIPLE} code={MULTIPLE_CODE} />
      </Section>

      <Section title="Limits">
        <ul>
          <li>
            <code>calendar.range.minLength</code> and <code>calendar.range.maxLength</code> for ranges.
          </li>
          <li>
            <code>calendar.multiple.max</code> for multiple dates.
          </li>
          <li>
            <code>calendar.minDate</code>, <code>maxDate</code>, <code>disabledDates</code>,{" "}
            <code>enabledDates</code>, <code>disabledWeekdays</code> and <code>isDateDisabled</code> decide which
            days can be selected. See <Link href="/datepicker/docs/disabled-dates">Disabled Dates</Link>.
          </li>
        </ul>
      </Section>

      <Section title="Forms">
        <p>
          When the input has a <code>name</code>, the picker moves the name to a hidden input placed after it, so a
          form submits ISO values instead of the displayed text. The hidden input is removed and the name restored
          on <code>destroy()</code>.
        </p>
        <CodeBlock code={FORM_HTML} language="html" />
        <ApiTable
          rowKey="mode"
          caption="Hidden input value by mode"
          columns={[
            { key: "mode", label: "Mode", mono: true },
            { key: "value", label: "Hidden value", mono: true },
          ]}
          rows={HIDDEN.map((row) => ({ mode: row.mode, value: row.value }))}
        />
        <p>
          An incomplete range gives an empty string. The visible input gets <code>input</code> and{" "}
          <code>change</code> events when a value is committed, and a form reset restores the initial value. With{" "}
          <code>ui.endInput</code>, each field with a <code>name</code> gets its own hidden ISO input.
        </p>
      </Section>

      <Section title="Initial value">
        <p>
          On <code>create()</code>, the picker reads the existing input text, either in the serialized form above
          or in the display format.
        </p>
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
