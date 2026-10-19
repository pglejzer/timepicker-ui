import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const MASK: DatepickerOptions = { ui: { format: "dd.MM.yyyy", mask: true } };

const INPUT_VIEW: DatepickerOptions = {
  ui: { displayMode: "modal", initialView: "input", viewSwitch: true },
};

const MASK_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { format: "dd.MM.yyyy", mask: true },
}).create();`;

const INPUT_VIEW_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "modal", initialView: "input", viewSwitch: true },
}).create();`;

export default function TypedInputExamplePage() {
  return (
    <div>
      <PageHeader
        title="Typed Input and Mask"
        description={
          <>
            Let users type a date and format it as they go. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Format and mask">
        <p>
          <code>ui.format</code> is a pattern built from <code>d dd M MM yy yyyy</code> and one separator:{" "}
          <code>/</code>, <code>.</code>, <code>-</code> or a space. <code>ui.mask</code> adds the separators while the user types digits, so
          typing <code>14032025</code> gives <code>14.03.2025</code>.
        </p>
        <DatepickerExample
          label="Mask"
          inputPlaceholder="dd.MM.yyyy"
          options={MASK}
          code={MASK_CODE}
        />
        <Callout>
          The mask works in <code>single</code> mode and in the two range fields at day precision. A typed date that
          is not a date or is not available shows a message from <code>labels.invalidDate</code> or{" "}
          <code>labels.unavailableDate</code>.
        </Callout>
      </Section>

      <Section title="Text input view in a modal">
        <p>
          The modal can show a text field instead of the calendar. <code>ui.initialView: &quot;input&quot;</code> opens
          it on the field, and <code>ui.viewSwitch</code> keeps the button that switches between the two views.
        </p>
        <DatepickerExample label="Input view" options={INPUT_VIEW} code={INPUT_VIEW_CODE} />
      </Section>
    </div>
  );
}
