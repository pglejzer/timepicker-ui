import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const LIMITS: DatepickerOptions = {
  calendar: { mode: "range", range: { minLength: 3, maxLength: 14 } },
};

const LIMITS_FUTURE: DatepickerOptions = {
  calendar: { mode: "range", minDate: "today", range: { minLength: 3, maxLength: 14 } },
};

const LIMITS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#dates", {
  calendar: {
    mode: "range",
    range: { minLength: 3, maxLength: 14 },
  },
}).create();`;

const FUTURE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#dates", {
  calendar: {
    mode: "range",
    minDate: "today",
    range: { minLength: 3, maxLength: 14 },
  },
}).create();`;

export default function DatepickerRangeLimitsExamplePage() {
  return (
    <div>
      <PageHeader
        title="Range Length Limits"
        description="Bound how many days a date range may span with @pglejzer/datepicker-ui."
      />

      <Section title="Minimum and maximum length">
        <p>
          <code>calendar.range.minLength</code> and <code>maxLength</code> bound a range in days, with both ends
          counted. Here a range must cover 3 to 14 days. A typed range that breaks the limits shows{" "}
          <code>labels.invalidRange</code>.
        </p>
        <DatepickerExample label="3 to 14 days" options={LIMITS} code={LIMITS_CODE} />
      </Section>

      <Section title="Future dates only">
        <p>
          The limits combine with the other calendar rules. Adding <code>minDate: &quot;today&quot;</code> keeps
          past days out of the range as well.
        </p>
        <DatepickerExample label="3 to 14 days from today" options={LIMITS_FUTURE} code={FUTURE_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/selection-modes">Selection Modes</Link> ·{" "}
        <Link href="/datepicker/docs/disabled-dates">Disabled Dates</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
