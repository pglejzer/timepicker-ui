import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const TWO: DatepickerOptions = { calendar: { months: 2 } };

const THREE: DatepickerOptions = { calendar: { months: 3, pageBy: "month" } };

const RANGE: DatepickerOptions = { calendar: { mode: "range", months: 2 } };

const TWO_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { months: 2 },
}).create();`;

const THREE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { months: 3, pageBy: "month" },
}).create();`;

const RANGE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { mode: "range", months: 2 },
}).create();`;

export default function SeveralMonthsExamplePage() {
  return (
    <div>
      <PageHeader
        title="Several Months"
        description={
          <>
            Show more than one month side by side. This page documents <code>@pglejzer/datepicker-ui</code>, the
            companion of timepicker-ui.
          </>
        }
      />

      <Section title="Two months">
        <p>
          <code>calendar.months</code> sets how many months are shown. The docked and inline pickers show as many
          as fit the width, up to that number. The width is read when the picker opens. Use the Inline switch for a
          wider view.
        </p>
        <DatepickerExample label="Two months" options={TWO} code={TWO_CODE} />
      </Section>

      <Section title="Three months, paged by month">
        <p>
          <code>calendar.pageBy</code> sets how far the arrows move. The default <code>&quot;view&quot;</code> moves
          by as many months as are shown, and <code>&quot;month&quot;</code> moves one month at a time.
        </p>
        <DatepickerExample label="Three months" options={THREE} code={THREE_CODE} />
      </Section>

      <Section title="Range with two months">
        <p>Several months suit a range, because both ends are often in different months.</p>
        <DatepickerExample label="Range" inputLabel="Dates" options={RANGE} code={RANGE_CODE} />
        <Callout>
          A modal picker always shows one month, and a range picker in a modal keeps its vertical month list.
        </Callout>
      </Section>
    </div>
  );
}
