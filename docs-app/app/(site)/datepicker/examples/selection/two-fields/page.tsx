import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const TWO_FIELDS: DatepickerOptions = { calendar: { mode: "range" } };

const HTML_CODE = `<label for="trip-start">Check-in</label>
<input id="trip-start" />

<label for="trip-end">Check-out</label>
<input id="trip-end" />`;

const CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#trip-start", {
  calendar: { mode: "range" },
  ui: { endInput: "#trip-end" },
}).create();`;

const CSS_CODE = `.dp-ui__input--active {
  border-color: #6d28d9;
  box-shadow: inset 0 0 0 1px #6d28d9;
}`;

export default function DatepickerTwoFieldsExamplePage() {
  return (
    <div>
      <PageHeader
        title="Range With Two Fields"
        description="Split a date range into a check-in and a check-out input with @pglejzer/datepicker-ui."
      />

      <Section title="Start and end inputs">
        <p>
          Attach the picker to the first input and point <code>ui.endInput</code> at the second, a selector or an
          element. The main input holds the start and the second holds the end. It is read when{" "}
          <code>create()</code> runs and only applies in <code>&quot;range&quot;</code> mode.
        </p>
        <CodeBlock code={HTML_CODE} language="html" />
        <DatepickerExample label="Two fields" endInput options={TWO_FIELDS} code={CODE} />
        <p>
          Clicking a field opens the picker on that end. Typing commits only a complete pair, or two empty
          fields.
        </p>
      </Section>

      <Section title="Style the active field">
        <p>
          The library adds <code>dp-ui__input--active</code> to the input the next pick fills, and leaves its
          styling to the page. Add a rule such as this one:
        </p>
        <CodeBlock code={CSS_CODE} language="css" />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/selection-modes">Selection Modes</Link> ·{" "}
        <Link href="/datepicker/docs/layouts">Layouts</Link> ·{" "}
        <Link href="/datepicker/api/css-classes">CSS Classes</Link>
      </p>
    </div>
  );
}
