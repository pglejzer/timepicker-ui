import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { withCode } from "../api-helpers";

type EventRow = { event: string; callback: string; payload: string; fires: string };

const EVENTS: EventRow[] = [
  {
    event: "open",
    callback: "onOpen",
    payload: '{ mode: "docked" | "modal" | "inline" }',
    fires: "The picker opens, or an inline picker is mounted by `create()`.",
  },
  {
    event: "close",
    callback: "onClose",
    payload: "{}",
    fires: "The picker starts closing.",
  },
  {
    event: "cancel",
    callback: "onCancel",
    payload: '{ reason: "button" | "escape" | "outside" | "toggle" }',
    fires:
      "The picker is dismissed without committing. `reason` says how: the Cancel or close button, Escape, a click outside, or `\"toggle\"` when `ui.toggleButton` is clicked on an open picker.",
  },
  {
    event: "confirm",
    callback: "onConfirm",
    payload: "{ value: PickerValue | null, autoCommit: boolean }",
    fires:
      "A value is committed or cleared. `autoCommit` is `true` for `closeOnSelect`, `commitOnChange` and typed input.",
  },
  {
    event: "update",
    callback: "onUpdate",
    payload: "{ options: DatepickerOptions }",
    fires: "`setOptions()` applied a patch.",
  },
  {
    event: "error",
    callback: "onError",
    payload: "{ code, message, input?, option?, reason? }",
    fires:
      "A typed date is invalid or unavailable, `calendar.validate` returned a message, or an option is rejected.",
  },
  {
    event: "select:day",
    callback: "onSelectDay",
    payload: "{ value: DateValue, selected: boolean }",
    fires: "A day is picked. `selected` is `false` when a click in multiple mode removes it.",
  },
  {
    event: "select:month",
    callback: "onSelectMonth",
    payload: "{ year: number, month: number }",
    fires: "A month is chosen in the month menu. `month` is 1-12.",
  },
  {
    event: "select:year",
    callback: "onSelectYear",
    payload: "{ year: number }",
    fires: "A year is chosen in the year menu or the year grid.",
  },
  {
    event: "navigate",
    callback: "onNavigate",
    payload: "{ year, month, direction: -1 | 0 | 1, source, from, to }",
    fires: "The days shown change, and once when the picker opens or an inline picker is mounted.",
  },
  {
    event: "range:start",
    callback: "onRangeStart",
    payload: "{ value: DateValue }",
    fires: "The first day of a range is picked.",
  },
  {
    event: "range:end",
    callback: "onRangeEnd",
    payload: "{ start: DateValue, end: DateValue }",
    fires: "A range is completed.",
  },
  {
    event: "switch:view",
    callback: "onSwitchView",
    payload: '{ view: "calendar" | "input" }',
    fires: "The picker switches between the calendar and the text fields, for example by the switch button or `setView()`.",
  },
  {
    event: "clear",
    callback: "onClear",
    payload: "{ previousValue: PickerValue | null }",
    fires:
      "`clear()` or the Clear button empties the value or the draft. `previousValue` is the value before clearing, or the draft when only the draft was cleared.",
  },
];

const ERROR_CODES = [
  {
    code: "invalid-date",
    meaning:
      "Typed text is not a date, `setValue()` got a value that does not fit `calendar.mode`, or `goTo()` got a value that is not a date. `input` holds the text.",
  },
  {
    code: "unavailable-date",
    meaning: "A typed date is disabled or out of range. `input` holds the text and `reason` says why.",
  },
  {
    code: "invalid-value",
    meaning: "`calendar.validate` returned a message.",
  },
  {
    code: "invalid-option",
    meaning: "An option value was rejected and replaced by its default. `option` holds the path, such as `ui.theme`.",
  },
];

const REASONS = [
  { reason: "min", meaning: "The date is before `calendar.minDate`." },
  { reason: "max", meaning: "The date is after `calendar.maxDate`." },
  { reason: "disabled", meaning: "The date is excluded by `disabledDates`, `enabledDates` or `isDateDisabled`." },
  { reason: "weekday", meaning: "The weekday is in `calendar.disabledWeekdays`." },
  { reason: "range-length", meaning: "The range breaks `calendar.range.minLength` or `maxLength`." },
  { reason: "multiple-max", meaning: "The selection would exceed `calendar.multiple.max`." },
];

const NAVIGATE_SOURCES = [
  { source: "drag", meaning: "The user dragged or swiped between months." },
  { source: "wheel", meaning: "The user paged with the mouse wheel." },
  { source: "button", meaning: "The user pressed a previous or next button." },
  { source: "keyboard", meaning: "The user navigated with the keyboard." },
  { source: "menu", meaning: "The user chose a month or year in a menu." },
  { source: "open", meaning: "The picker opened, or an inline picker was mounted." },
  {
    source: "api",
    meaning:
      "`setValue()`, `setOptions()`, `goTo()`, or a value the picker sets itself, such as a range preset or a typed date.",
  },
  { source: "resize", meaning: "A window resize changed the months shown." },
  { source: "scroll", meaning: "The month list of a range picker rendered more months." },
];

const SUBSCRIBE_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";

const picker = new DatepickerUI("#date", { calendar: { mode: "range" } });

picker.on("range:start", ({ value }) => {
  console.log("Start", value.value);
});

picker.on("range:end", ({ start, end }) => {
  console.log("Range", start.value, end.value);
});

picker.on("confirm", ({ value, autoCommit }) => {
  console.log(value, autoCommit);
});

picker.create();`;

const CALLBACKS_CODE = `new DatepickerUI("#date", {
  callbacks: {
    onConfirm: ({ value }) => console.log(value),
    onError: ({ code, message }) => console.warn(code, message),
  },
}).create();`;

const ERROR_CODE = `picker.on("error", ({ code, input, option, reason }) => {
  if (code === "unavailable-date") {
    console.log(input, reason);
  }
  if (code === "invalid-option") {
    console.log(option);
  }
});`;

export default function DatepickerEventsPage() {
  return (
    <div>
      <PageHeader
        title="Events API Reference"
        description={
          <>
            Every event of <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui, with its payload
            and when it fires.
          </>
        }
      />

      <p>
        Subscribe with <code>picker.on(event, handler)</code> or with the matching <code>callbacks.on*</code>{" "}
        option. Both receive the same payload. <code>on()</code> returns a function that unsubscribes. See{" "}
        <Link href="/datepicker/api/methods">Methods</Link>.
      </p>

      <Section title="All events">
        <ApiTable
          columns={[
            { key: "event", label: "Event" },
            { key: "callback", label: "Callback", mono: true },
            { key: "payload", label: "Payload", mono: true },
            { key: "fires", label: "Fires" },
          ]}
          rows={EVENTS.map((row) => ({
            id: row.event,
            event: <code>{row.event}</code>,
            callback: <code>{`callbacks.${row.callback}`}</code>,
            payload: <code>{row.payload}</code>,
            fires: withCode(row.fires),
          }))}
          rowKey="id"
        />
        <CodeBlock code={SUBSCRIBE_CODE} language="typescript" />
        <p>The same handlers as options:</p>
        <CodeBlock code={CALLBACKS_CODE} language="typescript" />
      </Section>

      <Section title="Navigate sources">
        <p>
          <code>navigate</code> fires when the days shown change, and once when the picker opens or an inline
          picker is mounted. <code>source</code> tells these apart and is one of the values below.{" "}
          <code>year</code> and <code>month</code> are the first month shown. <code>from</code> and{" "}
          <code>to</code> are the first and last day shown, the same as <code>getVisibleRange()</code> returns.{" "}
          <code>direction</code> is <code>-1</code> or <code>1</code> when the first month moves back or forward,
          and <code>0</code> when it stays, as on opening.
        </p>
        <ApiTable
          columns={[
            { key: "source", label: "Source" },
            { key: "meaning", label: "Meaning" },
          ]}
          rows={NAVIGATE_SOURCES.map((row) => ({
            id: row.source,
            source: <code>{row.source}</code>,
            meaning: withCode(row.meaning),
          }))}
          rowKey="id"
        />
      </Section>

      <Section title="Month and year precision">
        <p>
          With <code>calendar.precision</code> set to <code>&quot;month&quot;</code> or{" "}
          <code>&quot;year&quot;</code>, <code>select:day</code> carries the picked period. <code>value.value</code>{" "}
          is <code>YYYY-MM</code> or <code>YYYY</code>. A preset click emits <code>range:end</code> without{" "}
          <code>select:day</code>.
        </p>
      </Section>

      <Section title="Error codes">
        <p>
          The <code>error</code> payload has a <code>code</code> and a human readable <code>message</code>. Which of{" "}
          <code>input</code>, <code>option</code> and <code>reason</code> are set depends on the code.
        </p>
        <ApiTable
          columns={[
            { key: "code", label: "Code" },
            { key: "meaning", label: "Meaning" },
          ]}
          rows={ERROR_CODES.map((row) => ({
            id: row.code,
            code: <code>{row.code}</code>,
            meaning: withCode(row.meaning),
          }))}
          rowKey="id"
        />
        <CodeBlock code={ERROR_CODE} language="typescript" />
      </Section>

      <Section title="Unavailable reasons">
        <p>
          <code>reason</code> is set with <code>unavailable-date</code>. Its type is{" "}
          <code>UnavailableReason</code>, and the values are listed in the order the rules are checked.
        </p>
        <ApiTable
          columns={[
            { key: "reason", label: "Reason" },
            { key: "meaning", label: "Meaning" },
          ]}
          rows={REASONS.map((row) => ({
            id: row.reason,
            reason: <code>{row.reason}</code>,
            meaning: withCode(row.meaning),
          }))}
          rowKey="id"
        />
        <Callout title="Validation messages" tone="tip">
          A message from <code>calendar.validate</code> also sets <code>aria-invalid</code> and a custom validity
          message on the input, and adds <code>dp-ui--error</code> to the host. The same happens for typed text that
          is not a date.
        </Callout>
      </Section>
    </div>
  );
}
