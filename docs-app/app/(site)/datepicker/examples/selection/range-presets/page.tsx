"use client";

import Link from "next/link";
import type { DatepickerOptions, RangePreset } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const PRESETS: readonly RangePreset[] = [
  { label: "Today", value: () => ({ start: new Date(), end: new Date() }) },
  { label: "Last 7 days", value: () => ({ start: daysAgo(6), end: new Date() }) },
  { label: "Last 30 days", value: () => ({ start: daysAgo(29), end: new Date() }) },
  {
    label: "This month",
    value: () => {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    },
  },
  {
    label: "Last month",
    value: () => {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    },
  },
];

const DOCKED: DatepickerOptions = {
  calendar: { mode: "range", range: { presets: PRESETS } },
  ui: { displayMode: "docked" },
};

const MODAL: DatepickerOptions = {
  calendar: { mode: "range", range: { presets: PRESETS } },
  ui: { displayMode: "modal" },
};

const PRESETS_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const presets = [
  { label: "Today", value: () => ({ start: new Date(), end: new Date() }) },
  { label: "Last 7 days", value: () => ({ start: daysAgo(6), end: new Date() }) },
  { label: "Last 30 days", value: () => ({ start: daysAgo(29), end: new Date() }) },
  {
    label: "This month",
    value: () => {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    },
  },
  {
    label: "Last month",
    value: () => {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        end: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    },
  },
];
`;

const DOCKED_CODE = `${PRESETS_CODE}
new DatepickerUI("#dates", {
  calendar: { mode: "range", range: { presets } },
  ui: { displayMode: "docked" },
}).create();`;

const MODAL_CODE = `${PRESETS_CODE}
new DatepickerUI("#dates", {
  calendar: { mode: "range", range: { presets } },
  ui: { displayMode: "modal" },
}).create();`;

export default function DatepickerRangePresetsExamplePage() {
  return (
    <div>
      <PageHeader
        title="Range Presets"
        description="Offer ready-made ranges such as Last 7 days next to the calendar with @pglejzer/datepicker-ui."
      />

      <Section title="Docked">
        <p>
          <code>calendar.range.presets</code> is a list of <code>{"{ label, value }"}</code>. <code>value</code> is a{" "}
          <code>{"{ start, end }"}</code> pair or a function that returns one. The picker calls the function each
          time it refreshes, so &quot;Today&quot; stays current. In a docked picker the presets are a column beside
          the calendar when there is room, and a row of chips otherwise.
        </p>
        <DatepickerExample label="Docked presets" options={DOCKED} code={DOCKED_CODE} />
      </Section>

      <Section title="Modal">
        <p>
          In a modal the presets are a row of chips. Clicking one picks the range and follows{" "}
          <code>behavior.closeOnSelect</code> and <code>behavior.commitOnChange</code>. The accessible name of the
          group is <code>labels.presets</code>.
        </p>
        <DatepickerExample label="Modal presets" options={MODAL} code={MODAL_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/selection-modes">Selection Modes</Link> ·{" "}
        <Link href="/datepicker/api/options">Options</Link>
      </p>
    </div>
  );
}
