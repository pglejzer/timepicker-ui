import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const HTML_CODE = `<input id="date" />
<button id="open-date" type="button" aria-label="Choose date">...</button>`;

const TOGGLE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { toggleButton: "#open-date" },
}).create();`;

export default function ToggleButtonExamplePage() {
  return (
    <div>
      <PageHeader
        title="Toggle Button"
        description={
          <>
            Open the picker from a calendar icon next to the field. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Calendar icon button">
        <p>
          <code>ui.toggleButton</code> takes a selector or an element. A click on it opens the picker, in addition
          to the input. The picker sets <code>aria-expanded</code> on the button, and its accessible name comes from
          your markup, so give it an <code>aria-label</code>.
        </p>
        <CodeBlock code={HTML_CODE} language="html" />
        <DatepickerExample label="Toggle button" toggleButton code={TOGGLE_CODE} />
      </Section>
    </div>
  );
}
