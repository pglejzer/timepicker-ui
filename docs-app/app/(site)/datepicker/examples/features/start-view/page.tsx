import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const DOCKED: DatepickerOptions = {
  calendar: { maxDate: "today" },
  ui: { startView: "year", displayMode: "docked" },
};

const MODAL: DatepickerOptions = {
  calendar: { maxDate: "today" },
  ui: { startView: "year", displayMode: "modal" },
};

const DOCKED_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#birthday", {
  calendar: { maxDate: "today" },
  ui: { startView: "year", displayMode: "docked" },
}).create();`;

const MODAL_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#birthday", {
  calendar: { maxDate: "today" },
  ui: { startView: "year", displayMode: "modal" },
}).create();`;

export default function StartViewExamplePage() {
  return (
    <div>
      <PageHeader
        title="Start View"
        description={
          <>
            Open the picker on the year list, which suits a birthday field. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Docked popover">
        <p>
          <code>ui.startView</code> is the first panel shown when the picker opens: <code>&quot;day&quot;</code>,{" "}
          <code>&quot;month&quot;</code> or <code>&quot;year&quot;</code>. Here the docked popover opens on the year
          list, and <code>maxDate</code> stops the list at the current year.
        </p>
        <DatepickerExample
          label="Docked"
          inputLabel="Birthday"
          inputPlaceholder="Select birthday"
          options={DOCKED}
          code={DOCKED_CODE}
        />
      </Section>

      <Section title="Modal dialog">
        <p>The modal shows the year grid instead of the list.</p>
        <DatepickerExample
          label="Modal"
          inputLabel="Birthday"
          inputPlaceholder="Select birthday"
          options={MODAL}
          code={MODAL_CODE}
        />
        <Callout>
          <code>startView</code> is ignored in <code>range</code> mode, when <code>calendar.precision</code> is not{" "}
          <code>&quot;day&quot;</code>, and when <code>ui.initialView</code> is <code>&quot;input&quot;</code>.
        </Callout>
      </Section>
    </div>
  );
}
