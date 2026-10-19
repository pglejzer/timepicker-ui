import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const WEEKS: DatepickerOptions = { ui: { weekNumbers: true } };

const WEEKS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { weekNumbers: true },
}).create();`;

const LABEL: DatepickerOptions = { ui: { weekNumbers: true }, labels: { weekNumber: "Wk" } };

const LABEL_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { weekNumbers: true },
  labels: { weekNumber: "Wk" },
}).create();`;

export default function WeekNumbersExamplePage() {
  return (
    <div>
      <PageHeader
        title="Week Numbers"
        description={
          <>
            Show ISO week numbers before each row. This page documents <code>@pglejzer/datepicker-ui</code>, the
            companion of timepicker-ui.
          </>
        }
      />

      <Section title="Week numbers">
        <p>
          Set <code>ui.weekNumbers</code> to <code>true</code> to add a week column before each row.
        </p>
        <DatepickerExample label="Week numbers" options={WEEKS} code={WEEKS_CODE} />
      </Section>

      <Section title="Column header text">
        <p>
          The header of the column is <code>labels.weekNumber</code>, which is <code>&quot;Week&quot;</code> by
          default.
        </p>
        <DatepickerExample label="Custom header" options={LABEL} code={LABEL_CODE} />
      </Section>
    </div>
  );
}
