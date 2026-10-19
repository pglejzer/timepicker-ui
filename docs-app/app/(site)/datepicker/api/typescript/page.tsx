import { Fragment } from "react";
import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { withCode } from "../api-helpers";

type TypeEntry = { name: string; description: string; code: string };

const INSTALL_CODE = `import DatepickerUI, {
  DEFAULT_DATEPICKER_OPTIONS,
  EventEmitter,
  type DatepickerOptions,
  type PickerValue,
} from "@pglejzer/datepicker-ui";`;

const EXPORT_ROWS = [
  {
    entry: "@pglejzer/datepicker-ui",
    exports:
      "`DatepickerUI` (default and named), `DEFAULT_DATEPICKER_OPTIONS`, `EventEmitter` and every type listed below.",
  },
  {
    entry: "@pglejzer/datepicker-ui/kit",
    exports:
      "Named exports only: `PopoverHost`, `DialogHost`, `InlineHost`, `waitForExit`, `resolveSurfaceMode`, `isFullscreenRange`, `detectColorScheme`, `watchColorScheme`, `resolvePattern`, `formatDate`, `parseDate`, `maskDateText`, `formatHint` and the types `SurfaceHost`, `SurfaceMode`, `Scheme`, `FormatPattern`, `FormatOption`, `DatePart` and `PlainDate`.",
  },
];

const TYPE_LIST = [
  { group: "Options", names: "DatepickerOptions, CalendarOptions, UIOptions, LabelsOptions, BehaviorOptions, CallbacksOptions" },
  { group: "Option helpers", names: "ThemeName, PluralLabel, DateDecoration, RangePreset, RangePresetValue" },
  { group: "Option unions", names: "CalendarMode, Precision, PageBy, RangeEnd" },
  { group: "Values", names: "DateValue, RangeValue, PickerValue, PickerValueInput, PlainDate" },
  {
    group: "Events",
    names:
      "DatepickerEventMap, OpenEventData, CloseEventData, CancelEventData, ConfirmEventData, UpdateEventData, ErrorEventData, SelectDayEventData, SelectMonthEventData, SelectYearEventData, NavigateEventData, RangeStartEventData, RangeEndEventData, UnavailableReason",
  },
];

const INTERFACES: TypeEntry[] = [
  {
    name: "DatepickerOptions",
    description:
      "The grouped options object. Each group has its own exported interface. See the Options page for every field.",
    code: `interface DatepickerOptions {
  calendar?: CalendarOptions;    // mode, precision, months, limits, disabled days, locale
  ui?: UIOptions;                // theme, displayMode, inline, format, footer, buttons, ...
  labels?: LabelsOptions;        // every visible and assistive text
  behavior?: BehaviorOptions;    // closeOnSelect, commitOnChange, returnFocus, id, ...
  callbacks?: CallbacksOptions;  // onConfirm, onCancel, onOpen, ...
}`,
  },
  {
    name: "DateValue, RangeValue and PickerValue",
    description:
      "What getValue() returns and what confirm carries. The shape depends on calendar.mode. value is YYYY-MM-DD, YYYY-MM for month precision and YYYY for year precision.",
    code: `interface DateValue {
  readonly value: string;      // "2025-03-14"
  readonly date: Date;         // local midnight
  readonly formatted: string;  // as the input shows it
}

interface RangeValue {
  readonly start: DateValue;
  readonly end: DateValue;
}

type PickerValue = DateValue | RangeValue | readonly DateValue[];`,
  },
  {
    name: "PickerValueInput",
    description: "What setValue() accepts. The shape has to match calendar.mode.",
    code: `type PickerValueInput =
  | Date
  | string
  | { readonly start: Date | string; readonly end: Date | string }
  | readonly (Date | string)[];`,
  },
  {
    name: "Event payloads",
    description:
      "Each event has a payload type, all exported from the package root.",
    code: `interface OpenEventData {
  mode: "docked" | "modal" | "inline";
}

type CloseEventData = Record<string, never>;

interface CancelEventData {
  reason: "button" | "escape" | "outside";
}

interface ConfirmEventData {
  value: PickerValue | null;
  autoCommit: boolean;
}

interface UpdateEventData {
  options: DatepickerOptions;
}

interface SelectDayEventData {
  value: DateValue;
  selected: boolean;
}

interface RangeStartEventData {
  value: DateValue;
}

interface RangeEndEventData {
  start: DateValue;
  end: DateValue;
}

interface SelectMonthEventData {
  year: number;
  month: number;       // 1-12
}

interface SelectYearEventData {
  year: number;
}

interface NavigateEventData {
  year: number;
  month: number;       // first month shown, 1-12
  direction: -1 | 0 | 1;
  source: "drag" | "wheel" | "button" | "keyboard" | "menu";
}

interface ErrorEventData {
  code: "invalid-date" | "unavailable-date" | "invalid-option" | "invalid-value";
  message: string;
  input?: string;
  option?: string;
  reason?: UnavailableReason;
}`,
  },
  {
    name: "DatepickerEventMap",
    description:
      "Maps every event name to its payload type. on(), once() and off() are typed against this map, so a handler gets the right payload without an annotation.",
    code: `interface DatepickerEventMap {
  open: OpenEventData;
  close: CloseEventData;
  cancel: CancelEventData;
  confirm: ConfirmEventData;
  update: UpdateEventData;
  error: ErrorEventData;
  "select:day": SelectDayEventData;
  "select:month": SelectMonthEventData;
  "select:year": SelectYearEventData;
  "range:start": RangeStartEventData;
  "range:end": RangeEndEventData;
  navigate: NavigateEventData;
}`,
  },
];

const UNIONS: TypeEntry[] = [
  {
    name: "ThemeName",
    description: "The built-in theme names.",
    code: `type ThemeName =
  | "basic"
  | "m3-green"
  | "crane"
  | "crane-straight"
  | "m2"
  | "glassmorphic"
  | "pastel"
  | "ai"
  | "cyberpunk"
  | "blueprint";`,
  },
  {
    name: "CalendarMode, Precision, PageBy and RangeEnd",
    description: "The unions behind calendar.mode, calendar.precision, calendar.pageBy and setActiveEnd().",
    code: `type CalendarMode = "single" | "range" | "multiple";
type Precision = "day" | "month" | "year";
type PageBy = "month" | "view";
type RangeEnd = "start" | "end";`,
  },
  {
    name: "UnavailableReason",
    description: "Why a typed date cannot be selected, in the order the rules are checked.",
    code: `type UnavailableReason =
  | "min"
  | "max"
  | "disabled"
  | "weekday"
  | "range-length"
  | "multiple-max";`,
  },
  {
    name: "PluralLabel",
    description: "A label that is a string, or a map from Intl.PluralRules categories to strings. {count} is replaced by the number.",
    code: `type PluralLabel =
  string | Readonly<Partial<Record<Intl.LDMLPluralRule, string>>>;`,
  },
  {
    name: "DateDecoration, RangePreset and RangePresetValue",
    description: "Shapes returned by or passed to calendar.decorateDate and calendar.range.presets.",
    code: `interface DateDecoration {
  className?: string;
  badge?: boolean;
  label?: string;
}

interface RangePresetValue {
  start: Date | string;
  end: Date | string;
}

interface RangePreset {
  label: string;
  value: RangePresetValue | (() => RangePresetValue);
}`,
  },
];

const OPTIONS_CODE = `import DatepickerUI, { type DatepickerOptions } from "@pglejzer/datepicker-ui";

const options: DatepickerOptions = {
  calendar: {
    mode: "range",
    minDate: "today",
    isDateDisabled: (date) => date.getDay() === 0,
  },
  ui: { theme: "m3-green" },
  callbacks: {
    onConfirm: ({ value }) => {
      console.log(value);
    },
  },
};

const input = document.querySelector<HTMLInputElement>("#date");

if (input) {
  new DatepickerUI(input, options).create();
}`;

const HANDLERS_CODE = `import DatepickerUI, {
  type ConfirmEventData,
  type DatepickerEventMap,
} from "@pglejzer/datepicker-ui";

const picker = new DatepickerUI("#date");

picker.on("select:day", ({ value, selected }) => {
  console.log(value.value, selected);
});

const onConfirm = (data: ConfirmEventData) => {
  console.log(data.value, data.autoCommit);
};

picker.on("confirm", onConfirm);
picker.off("confirm", onConfirm);

function listen<K extends keyof DatepickerEventMap>(
  event: K,
  handler: (data: DatepickerEventMap[K]) => void,
) {
  return picker.on(event, handler);
}

const stop = listen("navigate", ({ year, month, source }) => {
  console.log(year, month, source);
});

stop();`;

const NARROW_CODE = `import {
  type DateValue,
  type PickerValue,
  type RangeValue,
} from "@pglejzer/datepicker-ui";

function isRange(value: PickerValue): value is RangeValue {
  return "start" in value;
}

function isSingle(value: PickerValue): value is DateValue {
  return "value" in value;
}

function describe(value: PickerValue | null): string {
  if (value === null) return "Nothing selected";
  if (isRange(value)) return value.start.value + " to " + value.end.value;
  if (isSingle(value)) return value.value;
  return value.map((entry) => entry.value).join(", ");
}`;

const MODE_CODE = `import DatepickerUI, {
  type DateValue,
  type RangeValue,
} from "@pglejzer/datepicker-ui";

const picker = new DatepickerUI("#date", { calendar: { mode: "range" } });
picker.create();

const range = picker.getValue() as RangeValue | null;

if (range) {
  console.log(range.start.value, range.end.value);
}

const single = new DatepickerUI("#birthday");
single.create();

const day = single.getValue() as DateValue | null;`;

const REACT_CODE = `import { useEffect, useRef } from "react";
import DatepickerUI, { type DatepickerOptions } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

type DateFieldProps = {
  options?: DatepickerOptions;
  onDate: (iso: string | null) => void;
};

export function DateField({ options, onDate }: DateFieldProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const picker = new DatepickerUI(ref.current, options);
    picker.create();
    picker.on("confirm", ({ value }) => {
      onDate(value && "value" in value ? value.value : null);
    });
    return () => picker.destroy();
  }, [options, onDate]);

  return <input ref={ref} />;
}`;

const KIT_CODE = `import {
  parseDate,
  resolvePattern,
  type FormatPattern,
  type PlainDate,
} from "@pglejzer/datepicker-ui/kit";

const pattern: FormatPattern = resolvePattern("dd.MM.yyyy", "en-GB");
const date: PlainDate | null = parseDate("14.03.2025", pattern);`;

function TypeList({ items }: { items: TypeEntry[] }) {
  return (
    <>
      {items.map((item) => (
        <Fragment key={item.name}>
          <h3>
            <code>{item.name}</code>
          </h3>
          <p>{withCode(item.description)}</p>
          <CodeBlock code={item.code} language="typescript" />
        </Fragment>
      ))}
    </>
  );
}

export default function DatepickerTypeScriptPage() {
  return (
    <div>
      <PageHeader
        title="TypeScript"
        description={
          <>
            Types for options, values and events in <code>@pglejzer/datepicker-ui</code>, the companion of
            timepicker-ui.
          </>
        }
      />

      <Section title="Installation">
        <p>
          The type definitions ship in the package, so there is nothing else to install. <code>DatepickerUI</code>{" "}
          is the default export and also a named export.
        </p>
        <CodeBlock code={INSTALL_CODE} language="typescript" />
        <ApiTable
          columns={[
            { key: "entry", label: "Entry" },
            { key: "exports", label: "Exports" },
          ]}
          rows={EXPORT_ROWS.map((row) => ({
            id: row.entry,
            entry: <code>{row.entry}</code>,
            exports: withCode(row.exports),
          }))}
          rowKey="id"
        />
      </Section>

      <Section title="Exported types">
        <p>
          Every type below is exported from <code>@pglejzer/datepicker-ui</code> and works with{" "}
          <code>import type</code>.
        </p>
        <ApiTable
          columns={[
            { key: "group", label: "Group" },
            { key: "names", label: "Types", mono: true },
          ]}
          rows={TYPE_LIST.map((row) => ({
            id: row.group,
            group: row.group,
            names: row.names,
          }))}
          rowKey="id"
        />
      </Section>

      <Section title="Main interfaces">
        <TypeList items={INTERFACES} />
      </Section>

      <Section title="Unions and small shapes">
        <TypeList items={UNIONS} />
      </Section>

      <Section title="Typed options">
        <p>
          Annotate an options object with <code>DatepickerOptions</code> to get completion for every group, and
          typed arguments in the function options such as <code>isDateDisabled</code> and the callbacks.
        </p>
        <CodeBlock code={OPTIONS_CODE} language="typescript" />
      </Section>

      <Section title="Typed handlers">
        <p>
          <code>on()</code>, <code>once()</code> and <code>off()</code> are typed against{" "}
          <code>DatepickerEventMap</code>. The handler payload is inferred from the event name.
        </p>
        <CodeBlock code={HANDLERS_CODE} language="typescript" />
      </Section>

      <Section title="Narrowing PickerValue">
        <p>
          <code>getValue()</code> returns <code>PickerValue | null</code>. Which member you get depends on{" "}
          <code>calendar.mode</code>: <code>DateValue</code> for <code>&quot;single&quot;</code>,{" "}
          <code>RangeValue</code> for <code>&quot;range&quot;</code> and <code>DateValue[]</code> for{" "}
          <code>&quot;multiple&quot;</code>. The <code>confirm</code> payload has the same type. When you only
          know the mode at runtime, narrow with the <code>in</code> operator:
        </p>
        <CodeBlock code={NARROW_CODE} language="typescript" />
        <p>When the mode is fixed in your code, assert the member that mode returns:</p>
        <CodeBlock code={MODE_CODE} language="typescript" />
      </Section>

      <Section title="React with TypeScript">
        <p>
          Create the picker in an effect and destroy it on cleanup. Keep <code>options</code> stable, for example
          at module scope, because a new object recreates the picker.
        </p>
        <CodeBlock code={REACT_CODE} language="tsx" />
      </Section>

      <Section title="Kit types">
        <p>
          The <code>kit</code> entry has its own types for companion packages. <code>PlainDate</code> is also
          exported from the package root.
        </p>
        <CodeBlock code={KIT_CODE} language="typescript" />
      </Section>

      <Callout title="Related">
        Every option is described on the <Link href="/datepicker/api/options">Options</Link> page, and every event
        on the <Link href="/datepicker/api/events">Events</Link> page.
      </Callout>
    </div>
  );
}
