import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const MODAL: DatepickerOptions = { ui: { displayMode: "modal" } };

const MODAL_INPUT: DatepickerOptions = {
  ui: { displayMode: "modal", initialView: "input" },
};

const MODAL_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "modal" },
}).create();`;

const INPUT_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "modal", initialView: "input" },
}).create();`;

export default function DatepickerModalExamplePage() {
  return (
    <div>
      <PageHeader
        title="Modal Dialog"
        description="Show the calendar in a modal dialog with @pglejzer/datepicker-ui."
      />

      <Section title="Modal">
        <p>
          <code>ui.displayMode: &quot;modal&quot;</code> opens a dialog with a headline, the calendar and the
          Cancel and OK buttons. Nothing is written to the input until the user confirms. The modal always shows
          one month.
        </p>
        <DatepickerExample label="Modal" options={MODAL} code={MODAL_CODE} />
      </Section>

      <Section title="Start on the text input view">
        <p>
          <code>ui.initialView: &quot;input&quot;</code> opens the modal on the text field instead of the grid.
          A button switches between the two views, and <code>ui.viewSwitch</code> controls it.
        </p>
        <DatepickerExample label="Input view" options={MODAL_INPUT} code={INPUT_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/display-modes">Display Modes</Link> ·{" "}
        <Link href="/datepicker/docs/typed-input">Typed Input</Link>
      </p>
    </div>
  );
}
