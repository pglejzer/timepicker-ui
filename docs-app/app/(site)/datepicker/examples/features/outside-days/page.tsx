import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const SELECTABLE: DatepickerOptions = { ui: { outsideDays: true } };

const INERT: DatepickerOptions = { ui: { outsideDays: { selectable: false }, fixedWeeks: true } };

const SELECTABLE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { outsideDays: true },
}).create();`;

const INERT_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { outsideDays: { selectable: false }, fixedWeeks: true },
}).create();`;

export default function OutsideDaysExamplePage() {
  return (
    <div>
      <PageHeader
        title="Outside Days"
        description={
          <>
            Fill the first and last rows with days of the neighbouring months. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Selectable outside days">
        <p>
          <code>ui.outsideDays: true</code> shows the days of the previous and next month in the first and last
          rows. They can be selected like any other day.
        </p>
        <DatepickerExample label="Selectable" options={SELECTABLE} code={SELECTABLE_CODE} />
      </Section>

      <Section title="Dimmed days and fixed weeks">
        <p>
          With <code>{"{ selectable: false }"}</code> the outside days are dimmed and inert.{" "}
          <code>ui.fixedWeeks</code> always renders six rows, so the calendar keeps its height from month to month.
        </p>
        <DatepickerExample label="Inert and fixed" options={INERT} code={INERT_CODE} />
      </Section>
    </div>
  );
}
