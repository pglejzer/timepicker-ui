import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const FROM_TODAY: DatepickerOptions = { calendar: { minDate: "today" } };

const WINDOW: DatepickerOptions = {
  calendar: { minDate: "2030-06-05", maxDate: "2030-06-25" },
};

const TODAY_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { minDate: "today" },
}).create();`;

const WINDOW_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { minDate: "2030-06-05", maxDate: "2030-06-25" },
}).create();`;

export default function DatepickerMinMaxExamplePage() {
  return (
    <div>
      <PageHeader
        title="Min and Max Date"
        description="Limit the selectable days to a window with @pglejzer/datepicker-ui."
      />

      <Section title="From today">
        <p>
          <code>calendar.minDate</code> and <code>maxDate</code> accept a <code>Date</code>, an ISO{" "}
          <code>YYYY-MM-DD</code> string or <code>&quot;today&quot;</code>. With{" "}
          <code>minDate: &quot;today&quot;</code> past days are disabled.
        </p>
        <DatepickerExample label="minDate today" options={FROM_TODAY} code={TODAY_CODE} />
      </Section>

      <Section title="A fixed window">
        <p>
          Two ISO strings give a fixed window. The calendar opens on the nearest month inside the limits, and a
          typed date outside them shows <code>labels.beforeMinDate</code> or <code>labels.afterMaxDate</code>.
        </p>
        <DatepickerExample label="Fixed window" options={WINDOW} code={WINDOW_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/disabled-dates">Disabled Dates</Link> ·{" "}
        <Link href="/datepicker/docs/typed-input">Typed Input</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
