import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const RANGE: DatepickerOptions = { calendar: { mode: "range" } };

const RANGE_MODAL: DatepickerOptions = {
  calendar: { mode: "range" },
  ui: { displayMode: "modal" },
};

const RANGE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#dates", {
  calendar: { mode: "range" },
}).create();`;

const MODAL_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#dates", {
  calendar: { mode: "range" },
  ui: { displayMode: "modal" },
}).create();`;

export default function DatepickerRangeExamplePage() {
  return (
    <div>
      <PageHeader
        title="Date Range"
        description="Pick a start and an end date in one field with @pglejzer/datepicker-ui."
      />

      <Section title="Range">
        <p>
          Set <code>calendar.mode</code> to <code>&quot;range&quot;</code>. The first click sets the start and the
          second sets the end. The input shows both dates, and the confirmed value is a{" "}
          <code>{"{ start, end }"}</code> pair of date values.
        </p>
        <DatepickerExample label="Range" options={RANGE} code={RANGE_CODE} />
      </Section>

      <Section title="Range in a modal">
        <p>
          A range picker in a modal opens full screen below 600 px wide, with Save and Close buttons.{" "}
          <code>ui.fullscreen</code> changes that width: a number is the width in pixels, and <code>false</code>{" "}
          never goes full screen. Resize the window below 600 px and open this demo to see it.
        </p>
        <DatepickerExample label="Range modal" options={RANGE_MODAL} code={MODAL_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/selection-modes">Selection Modes</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
