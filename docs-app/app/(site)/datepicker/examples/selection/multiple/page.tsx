import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const MULTIPLE: DatepickerOptions = { calendar: { mode: "multiple" } };

const MULTIPLE_MAX: DatepickerOptions = {
  calendar: { mode: "multiple", multiple: { max: 3 } },
  labels: {
    multipleSelected: {
      one: "{count} date selected",
      other: "{count} dates selected",
    },
  },
};

const MULTIPLE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#dates", {
  calendar: { mode: "multiple" },
}).create();`;

const MAX_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#dates", {
  calendar: { mode: "multiple", multiple: { max: 3 } },
  labels: {
    multipleSelected: {
      one: "{count} date selected",
      other: "{count} dates selected",
    },
  },
}).create();`;

export default function DatepickerMultipleExamplePage() {
  return (
    <div>
      <PageHeader
        title="Multiple Dates"
        description="Select any number of separate days with @pglejzer/datepicker-ui."
      />

      <Section title="Multiple">
        <p>
          Set <code>calendar.mode</code> to <code>&quot;multiple&quot;</code>. Each click toggles a day. The
          confirmed value is an array of date values sorted by date.
        </p>
        <DatepickerExample label="Multiple" options={MULTIPLE} code={MULTIPLE_CODE} />
      </Section>

      <Section title="Limit the count and the headline">
        <p>
          <code>calendar.multiple.max</code> caps how many days can be selected.{" "}
          <code>labels.multipleSelected</code> is the modal headline. It takes a string or an object keyed by{" "}
          <code>Intl.PluralRules</code> categories, and <code>{"{count}"}</code> is replaced by the number of
          selected days. The demo opens as a modal on small windows, where the headline is visible.
        </p>
        <DatepickerExample label="Max 3 dates" options={MULTIPLE_MAX} code={MAX_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/selection-modes">Selection Modes</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
