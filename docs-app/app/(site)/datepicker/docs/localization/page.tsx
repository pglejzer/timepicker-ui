import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const GERMAN: DatepickerOptions = { calendar: { locale: "de-DE" }, labels: { title: "Datum wählen", confirm: "OK", cancel: "Abbrechen" } };
const ARABIC: DatepickerOptions = { calendar: { locale: "ar-EG" } };

const GERMAN_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { locale: "de-DE" },
  labels: { title: "Datum wählen", confirm: "OK", cancel: "Abbrechen" },
}).create();`;

const ARABIC_CODE = `<input id="date" dir="rtl" />

import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { locale: "ar-EG" },
}).create();`;

const WEEK_CODE = `new DatepickerUI("#date", {
  calendar: { locale: "en-US", weekStart: "monday" },
}).create();`;

const PLURAL_CODE = `new DatepickerUI("#date", {
  calendar: { mode: "multiple" },
  labels: {
    multipleSelected: { one: "{count} date", other: "{count} dates" },
  },
}).create();`;

const LABELS = [
  { label: "title", text: "Modal header supporting text" },
  { label: "noDate", text: "Modal headline while nothing is selected" },
  { label: "confirm, cancel", text: "Confirm and cancel buttons" },
  { label: "today, clear", text: "Today and Clear buttons" },
  { label: "previousMonth, nextMonth", text: "Month navigation buttons" },
  { label: "chooseMonth, chooseYear", text: "Month and year menu buttons" },
  { label: "invalidDate, unavailableDate", text: "Messages for typed text" },
  { label: "rangeStart, rangeEnd", text: "Headline placeholders in range mode" },
  { label: "multipleSelected", text: "Headline in multiple mode, a PluralLabel" },
];

const CHAIN = [
  "calendar.locale, when set to a valid BCP 47 tag",
  "the lang attribute of <html>",
  "navigator.language",
  "en-US",
];

const RELATED = [
  { href: "/datepicker/examples/features/localization", title: "Localization example" },
  { href: "/datepicker/docs/typed-input", title: "Typed input and format" },
  { href: "/datepicker/api/options", title: "Options reference with every label" },
  { href: "/datepicker/docs/accessibility", title: "Accessibility" },
];

export default function LocalizationPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Localization and RTL"
        description="@pglejzer/datepicker-ui, the companion of timepicker-ui, takes month and weekday names from Intl and every other text from the labels group."
      />

      <Section title="Locale">
        <p>
          <code>calendar.locale</code> is a BCP 47 tag. Month and weekday names, the first day of the week, the
          auto date format and the digits all come from <code>Intl</code> for that locale. The locale is resolved in
          this order:
        </p>
        <ol>
          {CHAIN.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p>
          An invalid tag emits <code>invalid-option</code>. Any <code>Intl</code> locale works.
        </p>
        <DatepickerExample label="de-DE" options={GERMAN} code={GERMAN_CODE} />
      </Section>

      <Section title="Digits and right-to-left">
        <p>
          Digits are shown in the numerals of the locale, and <code>calendar.locale</code> sets the language and
          the names. The layout is mirrored only when the input has a right-to-left direction, for example{" "}
          <code>dir=&quot;rtl&quot;</code> on the input or on <code>&lt;html&gt;</code>. The container then gets the
          class <code>dp-ui__container--rtl</code>, and in the day grid the Left and Right arrow keys swap.
        </p>
        <DatepickerExample label="ar-EG" options={ARABIC} code={ARABIC_CODE} dir="rtl" />
      </Section>

      <Section title="Week start">
        <p>
          <code>calendar.weekStart</code> is <code>&quot;auto&quot;</code>, <code>&quot;sunday&quot;</code>,{" "}
          <code>&quot;monday&quot;</code> or <code>&quot;saturday&quot;</code>. <code>&quot;auto&quot;</code> follows the
          locale.
        </p>
        <CodeBlock code={WEEK_CODE} language="typescript" />
      </Section>

      <Section title="Labels">
        <p>
          Every visible and assistive text is a label, the screen-reader ones included. Month and weekday names are
          not labels. The table summarizes the main ones. The full table with every key
          and default is on the <Link href="/datepicker/api/options">Options</Link> page.
        </p>
        <ApiTable
          rowKey="label"
          columns={[
            { key: "label", label: "labels.*", mono: true },
            { key: "text", label: "Used for" },
          ]}
          rows={LABELS.map((row) => ({ label: row.label, text: row.text }))}
        />
      </Section>

      <Section title="Plural labels">
        <p>
          <code>multipleSelected</code> is a <code>PluralLabel</code>: a string, or an object keyed by{" "}
          <code>Intl.PluralRules</code> categories. <code>{"{count}"}</code> is replaced by the number of dates.
        </p>
        <CodeBlock code={PLURAL_CODE} language="typescript" />
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
