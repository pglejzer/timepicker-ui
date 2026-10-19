import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const DOCKED: DatepickerOptions = { ui: { displayMode: "docked" } };
const MODAL: DatepickerOptions = { ui: { displayMode: "modal" } };
const INLINE: DatepickerOptions = { ui: { inline: { enabled: true } }, behavior: { commitOnChange: true } };

const DOCKED_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "docked" },
}).create();`;

const MODAL_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "modal" },
}).create();`;

const INLINE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { inline: { enabled: true, container: "#calendar" } },
  behavior: { commitOnChange: true },
}).create();`;

const INLINE_HTML = `<input id="date" />
<div id="calendar"></div>`;

const FULLSCREEN_CODE = `new DatepickerUI("#range", {
  calendar: { mode: "range" },
  ui: { displayMode: "modal", fullscreen: 768 },
}).create();`;

const APPEND_CODE = `new DatepickerUI("#date", {
  ui: { displayMode: "modal", appendTo: "#modal-root" },
}).create();`;

const TOGGLE_CODE = `<input id="date" />
<button id="open" type="button">Choose date</button>`;

const TOGGLE_JS = `new DatepickerUI("#date", {
  ui: { toggleButton: "#open" },
}).create();`;

const TOGGLE_FIELD_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

${TOGGLE_JS}`;

const MODES = [
  { value: "auto", surface: "Modal dialog when the viewport is below 600 px wide or 480 px tall, docked otherwise." },
  { value: "docked", surface: "Popover next to the input." },
  { value: "modal", surface: "Dialog with a backdrop." },
];

const RELATED = [
  { href: "/datepicker/examples/basic/docked", title: "Docked popover example" },
  { href: "/datepicker/examples/basic/modal", title: "Modal dialog example" },
  { href: "/datepicker/examples/basic/inline", title: "Inline calendar example" },
  { href: "/datepicker/examples/features/toggle-button", title: "Toggle button example" },
  { href: "/datepicker/api/options", title: "Options reference" },
];

export default function DisplayModesPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Display Modes"
        description="@pglejzer/datepicker-ui, the companion of timepicker-ui, opens as a docked popover, a modal dialog or an inline calendar. ui.displayMode picks the surface."
      />

      <Section title="Display modes">
        <p>
          <code>ui.displayMode</code> picks the surface. The default is <code>&quot;auto&quot;</code>.
        </p>
        <ApiTable
          rowKey="value"
          columns={[
            { key: "value", label: "Value", mono: true },
            { key: "surface", label: "Surface" },
          ]}
          rows={MODES.map((mode) => ({
            value: <code>&quot;{mode.value}&quot;</code>,
            surface: mode.surface,
          }))}
        />
      </Section>

      <Section title="Docked">
        <p>
          A docked picker is a popover placed next to the input. It uses CSS anchor positioning where the browser
          supports it, and a JavaScript fallback otherwise.
        </p>
        <DatepickerExample label="Docked" options={DOCKED} code={DOCKED_CODE} />
      </Section>

      <Section title="Modal">
        <p>A modal picker is a native <code>&lt;dialog&gt;</code> with a backdrop. It is the surface <code>&quot;auto&quot;</code> picks on small screens.</p>
        <DatepickerExample label="Modal" options={MODAL} code={MODAL_CODE} />
      </Section>

      <Section title="Inline">
        <p>
          For an inline picker, set <code>ui.inline.enabled</code> and give <code>ui.inline.container</code> a
          selector or an element. <code>create()</code> mounts it. It has no open triggers.
        </p>
        <CodeBlock code={INLINE_HTML} language="html" />
        <p>
          An inline picker hides the footer unless <code>ui.footer</code> is <code>true</code>. Without a footer
          there is no confirm button, so set <code>behavior.commitOnChange</code> to write each pick to the input.
          The same applies to <code>behavior.closeOnSelect</code>.
        </p>
        <DatepickerExample label="Inline" options={INLINE} code={INLINE_CODE} />
        <Callout tone="tip" title="Inline footer">
          Set <code>ui.footer: true</code> instead of <code>commitOnChange</code> to keep the confirm and cancel
          buttons under an inline calendar.
        </Callout>
      </Section>

      <Section title="Full screen range picker">
        <p>
          A range picker in a modal opens full screen below <code>ui.fullscreen</code>. <code>true</code> means
          below 600 px, a number means below that width in pixels and <code>false</code> means never. The width is
          read when the picker opens.
        </p>
        <CodeBlock code={FULLSCREEN_CODE} language="typescript" />
      </Section>

      <Section title="Where the modal is appended">
        <p>
          <code>ui.appendTo</code> takes a selector or an element for the modal dialog. By default the dialog is
          appended to the host.
        </p>
        <CodeBlock code={APPEND_CODE} language="typescript" />
      </Section>

      <Section title="Toggle button">
        <p>
          <code>ui.toggleButton</code> adds an extra element that opens the picker, such as a calendar icon button.
          When it is not a <code>&lt;button&gt;</code>, Enter and Space open the picker. The picker sets{" "}
          <code>aria-expanded</code> on it and gives it an accessible name from <code>labels.openCalendar</code>.
        </p>
        <CodeBlock code={TOGGLE_CODE} language="html" />
        <DatepickerExample
          label="Toggle button"
          toggleButton
          code={TOGGLE_FIELD_CODE}
          caption="Calendar icon button next to the field"
        />
      </Section>

      <Section title="Page scroll in a modal">
        <p>
          A modal picker locks page scroll while it is open. Set <code>ui.allowPageScroll</code> to <code>true</code>{" "}
          to keep the page scrollable.
        </p>
      </Section>

      <Section title="Related">
        <ul>
          {RELATED.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
