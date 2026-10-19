import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const GERMAN: DatepickerOptions = { calendar: { locale: "de-DE" } };

const JAPANESE: DatepickerOptions = { calendar: { locale: "ja-JP" } };

const ARABIC: DatepickerOptions = { calendar: { locale: "ar-EG" } };

const MONDAY: DatepickerOptions = { calendar: { weekStart: "monday" } };

function code(calendar: string): string {
  return `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { ${calendar} },
}).create();`;
}

export default function LocalizationExamplePage() {
  return (
    <div>
      <PageHeader
        title="Localization"
        description={
          <>
            Month and weekday names, the input format and the first day of the week follow a locale. This page
            documents <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="German">
        <p>
          <code>calendar.locale</code> is a BCP 47 tag. Without it the picker uses <code>&lt;html lang&gt;</code>,
          then <code>navigator.language</code>, then <code>en-US</code>. Month and weekday names come from{" "}
          <code>Intl</code>.
        </p>
        <DatepickerExample label="de-DE" options={GERMAN} code={code('locale: "de-DE"')} />
      </Section>

      <Section title="Japanese">
        <DatepickerExample label="ja-JP" options={JAPANESE} code={code('locale: "ja-JP"')} />
      </Section>

      <Section title="Arabic, right to left">
        <p>
          <code>calendar.locale</code> sets the language, digits and names. The calendar is mirrored when the input
          has <code>dir=&quot;rtl&quot;</code>, or inherits it from the page.
        </p>
        <DatepickerExample
          label="ar-EG"
          options={ARABIC}
          code={`<input id="date" dir="rtl" />\n\n${code('locale: "ar-EG"')}`}
          dir="rtl"
        />
      </Section>

      <Section title="First day of the week">
        <p>
          <code>calendar.weekStart</code> is <code>&quot;auto&quot;</code> by default and follows the locale. Set a
          weekday name to override it.
        </p>
        <DatepickerExample label="Monday first" options={MONDAY} code={code('weekStart: "monday"')} />
        <Callout>
          The buttons and messages are not translated by the locale. Set them in <code>labels</code>.
        </Callout>
      </Section>
    </div>
  );
}
