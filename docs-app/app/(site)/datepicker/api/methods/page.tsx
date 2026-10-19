import { Fragment } from "react";
import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { withCode } from "../api-helpers";

type MethodEntry = { name: string; description: string; code: string };

const SETUP_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

const picker = new DatepickerUI("#date");
picker.create();`;

const METHODS: MethodEntry[] = [
  {
    name: "create()",
    description:
      "Binds the input and triggers. Mounts the picker when `ui.inline.enabled` is set. Calling it again does nothing. The constructor throws when it finds no input, so call `create()` after the input exists.",
    code: `const picker = new DatepickerUI("#date");
picker.create();`,
  },
  {
    name: "open()",
    description: "Opens the picker. Does nothing for an inline picker.",
    code: `picker.open();`,
  },
  {
    name: "close()",
    description: "Closes the picker.",
    code: `picker.close();`,
  },
  {
    name: "destroy(options?)",
    description:
      "Removes everything the picker added and restores the input. Clears the input text unless `keepInputValue` is `true`.",
    code: `picker.destroy();

picker.destroy({ keepInputValue: true });`,
  },
  {
    name: "getValue()",
    description:
      "Returns the committed value, or `null` when nothing is committed or a range has no end yet. The shape depends on `calendar.mode`. `value` is ISO `YYYY-MM-DD` (`YYYY-MM` for month precision, `YYYY` for year precision), `date` is a `Date` at local midnight and `formatted` is the text as the input shows it.",
    code: `// calendar.mode: "single"
picker.getValue();
// { value: "2025-03-14", date: Date, formatted: "14/03/2025" }

// calendar.mode: "range"
picker.getValue();
// { start: DateValue, end: DateValue }

// calendar.mode: "multiple", sorted
picker.getValue();
// DateValue[]`,
  },
  {
    name: "setValue(value)",
    description:
      "Sets the committed value and the input text. Pass `null` to clear. It does not emit `confirm`. A value that does not fit `calendar.mode` emits an `error` event with code `invalid-date`.",
    code: `// single: a Date or an ISO string
picker.setValue("2025-03-14");
picker.setValue(new Date(2025, 2, 14));

// range: { start, end }
picker.setValue({ start: "2025-03-14", end: "2025-03-20" });

// multiple: an array
picker.setValue(["2025-03-14", "2025-03-16"]);

// month precision accepts "2026-10" too
picker.setValue(null);`,
  },
  {
    name: "setOptions(options)",
    description:
      "Merges a partial options object into the current options and applies it. Emits `update`. Changing `calendar.mode` empties the selection.",
    code: `picker.setOptions({ ui: { theme: "crane" } });

picker.setOptions({ calendar: { mode: "range" } });`,
  },
  {
    name: "setActiveEnd(end)",
    description:
      "Range mode only. Sets which end the next pick fills, `\"start\"` or `\"end\"`. It is ignored in other modes and after `destroy()`, emits no event and does not open the picker.",
    code: `picker.open();
picker.setActiveEnd("end");`,
  },
  {
    name: "getElement()",
    description: "Returns the `.dp-ui` host element.",
    code: `const host = picker.getElement();`,
  },
  {
    name: "on(event, handler)",
    description: "Subscribes to an event and returns a function that unsubscribes.",
    code: `const off = picker.on("confirm", ({ value }) => {
  console.log(value);
});

off();`,
  },
  {
    name: "once(event, handler)",
    description: "Subscribes for one call and returns an unsubscribe function.",
    code: `picker.once("open", ({ mode }) => {
  console.log(mode);
});`,
  },
  {
    name: "off(event, handler?)",
    description: "Unsubscribes one handler, or all handlers of the event when you pass none.",
    code: `picker.off("confirm", handler);

picker.off("confirm");`,
  },
];

const STATIC_METHODS: MethodEntry[] = [
  {
    name: "DatepickerUI.getById(id)",
    description: "Returns the instance created with `behavior.id`, or `undefined`.",
    code: `new DatepickerUI("#date", { behavior: { id: "trip-dates" } }).create();

const picker = DatepickerUI.getById("trip-dates");`,
  },
  {
    name: "DatepickerUI.getAllInstances()",
    description: "Returns every live instance.",
    code: `const pickers = DatepickerUI.getAllInstances();`,
  },
  {
    name: "DatepickerUI.destroyAll()",
    description: "Destroys every live instance.",
    code: `DatepickerUI.destroyAll();`,
  },
];

const GETTERS = [
  { id: "instanceId", name: <code>instanceId</code>, type: <code>string</code>, description: "The id of the instance." },
  {
    id: "options",
    name: <code>options</code>,
    type: <code>DatepickerOptions</code>,
    description: withCode("The options as passed, with `setOptions()` patches merged."),
  },
  {
    id: "isInitialized",
    name: <code>isInitialized</code>,
    type: <code>boolean</code>,
    description: withCode("`true` after `create()`."),
  },
  {
    id: "isDestroyed",
    name: <code>isDestroyed</code>,
    type: <code>boolean</code>,
    description: withCode("`true` after `destroy()`."),
  },
];

const ACTIVE_END_CODE = `const picker = new DatepickerUI("#date", {
  calendar: { mode: "range" },
});
picker.create();

picker.open();
picker.setActiveEnd("end");`;

function MethodList({ items }: { items: MethodEntry[] }) {
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

export default function DatepickerMethodsPage() {
  return (
    <div>
      <PageHeader
        title="Methods API Reference"
        description={
          <>
            Every method, getter and static method of <code>DatepickerUI</code> from{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <p>
        The examples on this page use a picker created like this. The first argument of the constructor is a
        selector, an <code>&lt;input&gt;</code> or an element that contains an <code>&lt;input&gt;</code>. The
        options argument is optional.
      </p>
      <CodeBlock code={SETUP_CODE} language="typescript" />

      <Section title="Instance methods">
        <MethodList items={METHODS} />
      </Section>

      <Section title="Active end in range mode">
        <p>
          From the first <code>setActiveEnd()</code> call on, a pick follows the active end, like it does with{" "}
          <code>ui.endInput</code>. When <code>&quot;end&quot;</code> is active and the range has a start, a date
          on or after the start sets the end. Any other pick makes that date a new start. After each pick the
          active end moves to the next end.
        </p>
        <p>
          <code>open()</code> starts every docked or modal session at <code>&quot;start&quot;</code>, so call{" "}
          <code>setActiveEnd()</code> after <code>open()</code>.
        </p>
        <CodeBlock code={ACTIVE_END_CODE} language="typescript" />
      </Section>

      <Section title="Getters">
        <ApiTable
          columns={[
            { key: "name", label: "Getter" },
            { key: "type", label: "Type", mono: true },
            { key: "description", label: "Description" },
          ]}
          rows={GETTERS}
          rowKey="id"
        />
      </Section>

      <Section title="Static methods">
        <MethodList items={STATIC_METHODS} />
      </Section>

      <Section title="Related">
        <p>
          <Link href="/datepicker/api/events">Events</Link> lists what <code>on()</code> can subscribe to, and{" "}
          <Link href="/datepicker/api/typescript">TypeScript</Link> has the types of the values these methods take
          and return.
        </p>
      </Section>
    </div>
  );
}
