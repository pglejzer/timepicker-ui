import Link from "next/link";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LabelTable, OptionTable } from "../api-helpers";
import {
  BEHAVIOR_OPTIONS,
  CALENDAR_OPTIONS,
  CALLBACK_OPTIONS,
  LABEL_OPTIONS,
  SHAPE_ROWS,
  UI_OPTIONS,
} from "./options-data";

const OVERVIEW_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  calendar: { mode: "range", minDate: "today" },
  ui: { theme: "m3-green", displayMode: "docked" },
  labels: { confirm: "Done" },
  behavior: { closeOnSelect: true, id: "trip-dates" },
  callbacks: {
    onConfirm: ({ value }) => console.log(value),
  },
}).create();`;

const FALLBACK_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";

const picker = new DatepickerUI("#date", {
  ui: { theme: "neon" },
});

picker.on("error", ({ code, option, message }) => {
  if (code === "invalid-option") {
    console.warn(option, message);
  }
});

picker.create();`;

const LABELS_CODE = `new DatepickerUI("#date", {
  calendar: { mode: "multiple" },
  labels: {
    multipleSelected: { one: "{count} date", other: "{count} dates" },
  },
}).create();`;

const PRESETS_CODE = `const day = 24 * 60 * 60 * 1000;

new DatepickerUI("#range", {
  calendar: {
    mode: "range",
    range: {
      presets: [
        {
          label: "Last 7 days",
          value: () => ({
            start: new Date(Date.now() - 6 * day),
            end: new Date(),
          }),
        },
        { label: "Q4 2026", value: { start: "2026-10-01", end: "2026-12-31" } },
      ],
    },
  },
}).create();`;

const DECORATE_CODE = `new DatepickerUI("#date", {
  calendar: {
    decorateDate: (date) =>
      date.getDate() === 1
        ? { className: "first-of-month", badge: true, label: "First of the month" }
        : undefined,
  },
}).create();`;

export default function DatepickerOptionsPage() {
  return (
    <div>
      <PageHeader
        title="Options API Reference"
        description={
          <>
            Every option of <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui, grouped by area.
          </>
        }
      />

      <Callout title="Option groups" tone="tip">
        Pass options in five groups: <code>calendar</code>, <code>ui</code>, <code>labels</code>,{" "}
        <code>behavior</code> and <code>callbacks</code>. Every option is optional. For what each group does in
        practice, see the <Link href="/datepicker/docs/display-modes">guides</Link>.
      </Callout>

      <CodeBlock code={OVERVIEW_CODE} language="typescript" />

      <Section title="Invalid options">
        <p>
          A value of the wrong type or an unknown choice falls back to the default. The picker also emits an{" "}
          <code>error</code> event with code <code>invalid-option</code> and the option path in{" "}
          <code>option</code>, for example <code>ui.theme</code>.
        </p>
        <CodeBlock code={FALLBACK_CODE} language="typescript" />
      </Section>

      <Section title="Calendar options">
        <p>Which days exist, what the user selects and how the weeks are laid out:</p>
        <OptionTable rows={CALENDAR_OPTIONS} />
        <p>
          <code>isDateDisabled</code> and <code>decorateDate</code> may throw. The error is rethrown
          asynchronously and the day counts as enabled and undecorated. <code>renderDate</code> and{" "}
          <code>validate</code> follow the same rule: the day gets no content, and the value counts as valid.
        </p>
      </Section>

      <Section title="UI options">
        <p>Presentation and display behaviour:</p>
        <OptionTable rows={UI_OPTIONS} />
        <p>
          The input view exists for single pickers in a modal and for every range picker. Multiple pickers have
          no input view. The theme names are <code>basic</code>, <code>m3-green</code>, <code>crane</code>,{" "}
          <code>crane-straight</code>, <code>m2</code>, <code>glassmorphic</code>, <code>pastel</code>,{" "}
          <code>ai</code>, <code>cyberpunk</code> and <code>blueprint</code>.
        </p>
      </Section>

      <Section title="Labels options">
        <p>
          Every visible and assistive text is a label. Month and weekday names come from <code>Intl</code>, not
          from labels.
        </p>
        <LabelTable rows={LABEL_OPTIONS} />
        <p>
          <code>multipleSelected</code> is a <code>PluralLabel</code>: a string, or an object keyed by{" "}
          <code>Intl.PluralRules</code> categories. <code>{"{count}"}</code> is replaced by the number of dates.
        </p>
        <CodeBlock code={LABELS_CODE} language="typescript" />
      </Section>

      <Section title="Behavior options">
        <p>Interaction rules:</p>
        <OptionTable rows={BEHAVIOR_OPTIONS} />
      </Section>

      <Section title="Callbacks options">
        <p>
          Each callback receives the payload of its event. The payload types and when each event fires are on the{" "}
          <Link href="/datepicker/api/events">Events</Link> page.
        </p>
        <OptionTable rows={CALLBACK_OPTIONS} />
      </Section>

      <Section title="Shapes used by the options">
        <p>
          <code>DateDecoration</code> is what <code>calendar.decorateDate</code> returns. <code>RangePreset</code>{" "}
          and <code>RangePresetValue</code> describe <code>calendar.range.presets</code>.
        </p>
        <OptionTable rows={SHAPE_ROWS} />
        <CodeBlock code={DECORATE_CODE} language="typescript" />
        <CodeBlock code={PRESETS_CODE} language="typescript" />
        <p>
          A preset click completes the range as if the user had picked both ends. It emits <code>range:end</code>,
          not <code>select:day</code>, and follows <code>behavior.closeOnSelect</code> and{" "}
          <code>behavior.commitOnChange</code>. A preset is disabled when its value is invalid or the length limits
          refuse the range.
        </p>
      </Section>
    </div>
  );
}
