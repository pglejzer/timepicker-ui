import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const MONTH: DatepickerOptions = { calendar: { precision: "month" } };

const MONTH_FORMAT: DatepickerOptions = {
  calendar: { precision: "month" },
  ui: { format: "MM/yyyy" },
};

const MONTH_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { precision: "month" },
}).create();`;

const MONTH_FORMAT_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { precision: "month" },
  ui: { format: "MM/yyyy" },
}).create();`;

export default function MonthPickerExamplePage() {
  return (
    <div>
      <PageHeader
        title="Month Picker"
        description={
          <>
            Pick a month instead of a day. This page documents <code>@pglejzer/datepicker-ui</code>, the
            companion of timepicker-ui.
          </>
        }
      />

      <Section title="Month precision">
        <p>
          Set <code>calendar.precision</code> to <code>&quot;month&quot;</code>. The picker shows a list of months,
          and a pick selects the whole month. The value is the first day of the month, and{" "}
          <code>DateValue.value</code> is <code>YYYY-MM</code>.
        </p>
        <DatepickerExample
          label="Month precision"
          inputLabel="Month"
          inputPlaceholder="Select month"
          options={MONTH}
          code={MONTH_CODE}
        />
      </Section>

      <Section title="Month format">
        <p>
          With month precision, <code>ui.format</code> may leave out the day. <code>&quot;MM/yyyy&quot;</code> and{" "}
          <code>&quot;yyyy-MM&quot;</code> both work, and typing in that format is parsed back.
        </p>
        <DatepickerExample
          label="Month format"
          inputLabel="Month"
          inputPlaceholder="MM/yyyy"
          options={MONTH_FORMAT}
          code={MONTH_FORMAT_CODE}
        />
        <Callout>
          <code>precision</code> is only used in <code>single</code> mode. Other modes report an{" "}
          <code>invalid-option</code> error and use <code>&quot;day&quot;</code>.
        </Callout>
      </Section>
    </div>
  );
}
