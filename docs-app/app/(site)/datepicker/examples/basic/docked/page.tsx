import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const DOCKED: DatepickerOptions = { ui: { displayMode: "docked" } };

const DOCKED_TODAY: DatepickerOptions = {
  ui: { displayMode: "docked", todayButton: true },
};

const DOCKED_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "docked" },
}).create();`;

const TODAY_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "docked", todayButton: true },
}).create();`;

export default function DatepickerDockedExamplePage() {
  return (
    <div>
      <PageHeader
        title="Docked Popover"
        description="Open the calendar as a popover anchored to the input with @pglejzer/datepicker-ui."
      />

      <Section title="Docked">
        <p>
          <code>ui.displayMode: &quot;docked&quot;</code> always opens the popover under the input, also on small
          windows. The default <code>&quot;auto&quot;</code> picks a modal below 600 px wide or 480 px tall.
        </p>
        <DatepickerExample label="Docked" options={DOCKED} code={DOCKED_CODE} />
      </Section>

      <Section title="With a Today button">
        <p>
          <code>ui.todayButton</code> adds a Today button to the footer. Its text comes from{" "}
          <code>labels.today</code>.
        </p>
        <DatepickerExample label="Today button" options={DOCKED_TODAY} code={TODAY_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/display-modes">Display Modes</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
