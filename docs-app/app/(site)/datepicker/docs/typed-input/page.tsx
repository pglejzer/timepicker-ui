"use client";

import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const FORMAT: DatepickerOptions = { ui: { format: "dd.MM.yyyy", mask: true } };

const VALIDATE: DatepickerOptions = {
  calendar: {
    validate: (value) => {
      if (!value || !("date" in value)) return null;
      return value.date.getDay() % 6 === 0 ? "Weekdays only" : null;
    },
  },
};

const FORMAT_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { format: "dd.MM.yyyy", mask: true },
}).create();`;

const VALIDATE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: {
    validate: (value) => {
      if (!value || !("date" in value)) return null;
      return value.date.getDay() % 6 === 0 ? "Weekdays only" : null;
    },
  },
}).create();`;

const LIMIT_CODE = `new DatepickerUI("#date", {
  calendar: { minDate: "2026-01-01", maxDate: "2026-12-31" },
  labels: {
    beforeMinDate: "Pick a date on or after {date}",
    afterMaxDate: "Pick a date on or before {date}",
  },
}).create();`;

const PARTS = [
  { part: "d, dd", meaning: "Day, without or with a leading zero." },
  { part: "M, MM", meaning: "Month, without or with a leading zero." },
  { part: "yy, yyyy", meaning: "Year with two or four digits." },
];

const MESSAGES = [
  { situation: "Text that is not a date", label: "labels.invalidDate" },
  { situation: "A typed date that is disabled", label: "labels.unavailableDate" },
  { situation: "A typed date before minDate", label: "labels.beforeMinDate" },
  { situation: "A typed date after maxDate", label: "labels.afterMaxDate" },
  { situation: "A range the limits refuse", label: "labels.invalidRange" },
];

const RELATED = [
  { href: "/datepicker/examples/features/typed-input", title: "Typed input and mask example" },
  { href: "/datepicker/examples/constraints/validation", title: "Validation example" },
  { href: "/datepicker/docs/disabled-dates", title: "Disabled dates and limits" },
  { href: "/datepicker/docs/localization", title: "Localization" },
  { href: "/datepicker/api/events", title: "Events and error codes" },
];

export default function TypedInputPage() {
  return (
    <div>
      <PageHeader
        title="Typed Date Input, Format and Mask"
        description="Users can type into the input of @pglejzer/datepicker-ui, the companion of timepicker-ui. ui.format sets the text pattern, ui.mask formats digits while typing."
      />

      <Section title="Typed input">
        <p>
          The user can type into the input. Text is parsed on blur and on Enter. A valid date updates the value and
          reformats the text. An empty input clears the value. Anything else sets <code>aria-invalid</code> and a
          custom validity message on the input, adds the class <code>dp-ui--error</code> to the host and emits{" "}
          <code>error</code>. The message comes from a label:
        </p>
        <ApiTable
          rowKey="situation"
          columns={[
            { key: "situation", label: "Situation" },
            { key: "label", label: "Message", mono: true },
          ]}
          rows={MESSAGES.map((row) => ({ situation: row.situation, label: row.label }))}
        />
      </Section>

      <Section title="Format">
        <p>
          <code>ui.format</code> is <code>&quot;auto&quot;</code> or a pattern of three parts with one separator.
        </p>
        <ApiTable
          rowKey="part"
          caption="Pattern parts, each used once and in any order"
          columns={[
            { key: "part", label: "Part", mono: true },
            { key: "meaning", label: "Meaning" },
          ]}
          rows={PARTS.map((row) => ({ part: row.part, meaning: row.meaning }))}
        />
        <p>
          The separator is one of <code>/</code>, <code>.</code>, <code>-</code> or a space, used between all parts.
          With <code>&quot;auto&quot;</code>, the order and separator come from <code>Intl</code> for{" "}
          <code>calendar.locale</code>, with two-digit day and month and a four-digit year. Any other string emits{" "}
          <code>invalid-option</code> and <code>&quot;auto&quot;</code> is used.
        </p>
      </Section>

      <Section title="Mask">
        <p>
          <code>ui.mask</code> formats digits as the user types, in single mode and in the two range fields, at day
          precision only. Typing <code>14032025</code> gives <code>14.03.2025</code> with the pattern below. A
          separator typed after one digit pads the group with a zero.
        </p>
        <DatepickerExample label="Format and mask" options={FORMAT} code={FORMAT_CODE} />
      </Section>

      <Section title="Parsing">
        <ul>
          <li>
            Separators <code>/</code>, <code>.</code>, <code>-</code> and spaces are accepted when typing.
          </li>
          <li>
            A compact eight-digit form such as <code>14032025</code> and non-Latin digits are accepted.
          </li>
          <li>
            A two-digit year means 20xx up to 20 years ahead of the current year, and 19xx after that.
          </li>
          <li>
            In range mode the input holds two dates separated by an en dash, for example{" "}
            <code>14.03.2025 – 20.03.2025</code>. A hyphen with spaces around it is also accepted when typing.
          </li>
          <li>In multiple mode dates are separated by commas.</li>
        </ul>
      </Section>

      <Section title="Validation">
        <p>
          <code>calendar.validate</code> checks the committed value with your own rule. It receives the value as{" "}
          <code>getValue()</code> returns it, or <code>null</code> when the field is empty. Return a message to mark
          the field invalid, or <code>undefined</code> or <code>null</code> when it is fine.
        </p>
        <DatepickerExample label="Weekdays only" options={VALIDATE} code={VALIDATE_CODE} />
        <p>
          It never blocks a pick or a commit. A message sets <code>aria-invalid</code> and a custom validity message
          on the input, adds <code>dp-ui--error</code> to the host and emits <code>error</code> with the code{" "}
          <code>invalid-value</code>. It runs after <code>setValue()</code>, typed input and a commit. A throw is
          rethrown asynchronously and counts as valid.
        </p>
        <Callout tone="tip" title="Typed dates outside the limits">
          Typed dates before <code>minDate</code> or after <code>maxDate</code> use the messages{" "}
          <code>labels.beforeMinDate</code> and <code>labels.afterMaxDate</code>, with <code>{"{date}"}</code>{" "}
          replaced by the limit in the display format.
        </Callout>
        <CodeBlock code={LIMIT_CODE} language="typescript" />
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
