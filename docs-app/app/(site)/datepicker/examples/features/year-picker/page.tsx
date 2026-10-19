import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const YEAR: DatepickerOptions = { calendar: { precision: "year" } };

const YEAR_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { precision: "year" },
}).create();`;

export default function YearPickerExamplePage() {
  return (
    <div>
      <PageHeader
        title="Year Picker"
        description={
          <>
            Pick a year instead of a day. This page documents <code>@pglejzer/datepicker-ui</code>, the companion
            of timepicker-ui.
          </>
        }
      />

      <Section title="Year precision">
        <p>
          Set <code>calendar.precision</code> to <code>&quot;year&quot;</code>. The picker shows a grid of years and a
          pick selects the whole year. <code>DateValue.value</code> is <code>YYYY</code>.
        </p>
        <DatepickerExample
          label="Year precision"
          inputLabel="Year"
          inputPlaceholder="Select year"
          options={YEAR}
          code={YEAR_CODE}
        />
        <Callout>
          The years on offer come from <code>ui.yearRange</code> (100 years back and 20 ahead by default) and from{" "}
          <code>minDate</code> and <code>maxDate</code>.
        </Callout>
      </Section>
    </div>
  );
}
