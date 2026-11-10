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

const DOCKED_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "docked" },
}).create();`;

const MODAL_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "modal" },
}).create();`;

const INLINE_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
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

const TOGGLE_FIELD_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

${TOGGLE_JS}`;

const INLINE_LAYOUT_CODE = `new DatepickerUI("#date", {
  ui: {
    layout: "modal",
    inline: {
      enabled: true,
      container: "#calendar",
      headline: false,
      navigation: "caption",
    },
  },
  behavior: { commitOnChange: true },
}).create();`;

const DOCKED_DIALOG: DatepickerOptions = { ui: { displayMode: "modal", layout: "docked" } };

const DOCKED_DIALOG_CODE = `import { DatepickerUI } from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { displayMode: "modal", layout: "docked" },
}).create();`;

const LAYOUTS = [
  {
    value: "auto",
    docked: "Docked.",
    modal: "Modal. A range picker below ui.fullscreen opens full screen.",
    inline: "Docked.",
  },
  {
    value: "docked",
    docked: "Docked.",
    modal: "Docked, with the month and year menus in the dialog.",
    inline: "Docked.",
  },
  {
    value: "modal",
    docked: "Modal.",
    modal: "Modal. A range picker below ui.fullscreen opens full screen.",
    inline: "Modal.",
  },
  {
    value: "fullscreen",
    docked: "Modal.",
    modal: "A range picker opens full screen at every width. Other modes are modal.",
    inline: "A range picker gets the full-screen layout sized to the container. Other modes are modal.",
  },
];

const MODES = [
  {
    value: "auto",
    surface:
      "Modal dialog when the viewport is below 600 px wide or 480 px tall, docked otherwise. A docked picker that fits neither below nor above the field, at its current position on the page, opens as a dialog instead.",
  },
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

      <Section title="Layouts">
        <p>
          <code>ui.layout</code> sets the look of the calendar on any surface. The default is{" "}
          <code>&quot;auto&quot;</code>, which gives each surface its own look. The table shows the look per
          surface.
        </p>
        <ApiTable
          rowKey="value"
          columns={[
            { key: "value", label: "ui.layout", mono: true },
            { key: "docked", label: "Docked" },
            { key: "modal", label: "Modal" },
            { key: "inline", label: "Inline" },
          ]}
          rows={LAYOUTS.map((layout) => ({
            value: <code>&quot;{layout.value}&quot;</code>,
            docked: layout.docked,
            modal: layout.modal,
            inline: layout.inline,
          }))}
        />
        <p>
          The docked look has the month and year menus and is the only one that shows several months or a presets
          column. The modal look has the headline, a month row with arrows on every page, and month and year grids
          instead of menus. An inline calendar with the modal look follows <code>ui.fixedWeeks</code>. A single
          picker with the modal look has the input view at day precision.
        </p>
        <p>
          To open a dialog with the docked month and year menus, set <code>layout</code> next to{" "}
          <code>displayMode</code>:
        </p>
        <DatepickerExample label="Dialog with the docked look" options={DOCKED_DIALOG} code={DOCKED_DIALOG_CODE} />
        <p>Three more options change what an inline calendar shows and announces:</p>
        <ul>
          <li>
            <code>ui.inline.headline: false</code> leaves out the headline, for a page that shows its own: the modal
            title, the selected value and the view switch, or the range header. The full-screen top bar keeps its
            close and save buttons.
          </li>
          <li>
            <code>ui.inline.navigation: &quot;caption&quot;</code> shows the month and year as text next to the
            arrows, with no month or year menus. It works at day precision only. The calendar then opens on the day
            grid, and Shift+M and Shift+Y do nothing.
          </li>
          <li>
            <code>ui.inline.announceSelection: false</code> stops selection announcements, for a page that
            announces them itself. Month changes and errors are still announced.
          </li>
        </ul>
        <CodeBlock code={INLINE_LAYOUT_CODE} language="typescript" />
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
          Clicking it while a docked picker is open closes the picker without committing and emits{" "}
          <code>cancel</code> with <code>reason: &quot;toggle&quot;</code>.
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
