import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const BUTTONS: DatepickerOptions = { ui: { todayButton: true, clearButton: true } };

const KEEP_TEXT: DatepickerOptions = {
  ui: { todayButton: true, clearButton: { clearInput: false } },
};

const BUTTONS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { todayButton: true, clearButton: true },
}).create();`;

const KEEP_TEXT_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { todayButton: true, clearButton: { clearInput: false } },
}).create();`;

export default function FooterButtonsExamplePage() {
  return (
    <div>
      <PageHeader
        title="Today and Clear Buttons"
        description={
          <>
            Add Today and Clear to the footer of the picker. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Today and Clear">
        <p>
          <code>ui.todayButton</code> and <code>ui.clearButton</code> are off by default. Their texts are{" "}
          <code>labels.today</code> and <code>labels.clear</code>. Clear empties the value and the input.
        </p>
        <DatepickerExample label="Both buttons" options={BUTTONS} code={BUTTONS_CODE} />
      </Section>

      <Section title="Keep the typed text">
        <p>
          Pass <code>{"{ clearInput: false }"}</code> to <code>ui.clearButton</code> to clear the value but leave
          the text in the input.
        </p>
        <DatepickerExample label="Keep input text" options={KEEP_TEXT} code={KEEP_TEXT_CODE} />
      </Section>
    </div>
  );
}
