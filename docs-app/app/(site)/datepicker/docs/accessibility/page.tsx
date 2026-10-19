import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const KEYS = [
  { where: "Day grid", keys: "Arrow keys move by day and week. Left and Right swap in right-to-left layouts." },
  { where: "Day grid", keys: "Home and End go to the first and last day of the month." },
  { where: "Day grid", keys: "Page Up and Page Down change the month. With Shift they change the year." },
  {
    where: "Day grid",
    keys: "Enter and Space select the focused day. In a single modal picker, Enter on the selected day confirms.",
  },
  { where: "Day grid", keys: "Shift+M and Shift+Y open the month and year menu in the docked picker." },
  { where: "Day grid", keys: "Escape closes an open menu. Otherwise it dismisses the picker." },
  {
    where: "Month and year menu",
    keys: "Up and Down move, Home and End jump to the first and last item, Enter and Space pick.",
  },
  { where: "Year grid", keys: "Arrow keys move through the three columns, Home and End jump, Enter and Space pick." },
  { where: "Input", keys: "Alt+Down Arrow opens the picker. Enter commits the typed text." },
  { where: "Toggle element", keys: "Enter and Space open the picker when ui.toggleButton is not a <button>." },
];

const FOCUS_CODE = `new DatepickerUI("#date", {
  behavior: { returnFocus: false },
}).create();`;

const MOTION_CODE = `new DatepickerUI("#date", {
  ui: { animation: false },
}).create();`;

const RELATED = [
  { href: "/datepicker/docs/localization", title: "Translate the screen-reader labels" },
  { href: "/datepicker/docs/typed-input", title: "Typed input and aria-invalid" },
  { href: "/datepicker/docs/display-modes", title: "Display modes" },
];

export default function DatepickerAccessibilityPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Accessibility"
        description="@pglejzer/datepicker-ui, the companion of timepicker-ui, follows the WAI-ARIA date picker pattern and works with the keyboard and screen readers."
      />

      <Section title="Roles and states">
        <p>
          The day grid follows the WAI-ARIA date picker pattern: <code>role=&quot;grid&quot;</code> with weekday column
          headers, a roving <code>tabindex</code>, <code>aria-selected</code>, <code>aria-current=&quot;date&quot;</code>{" "}
          and <code>aria-disabled</code>.
        </p>
        <ul>
          <li>
            The docked picker is a <code>role=&quot;dialog&quot;</code> with <code>aria-modal=&quot;false&quot;</code>.
          </li>
          <li>
            The modal is a native <code>&lt;dialog&gt;</code>.
          </li>
          <li>
            The inline picker is a <code>role=&quot;group&quot;</code>.
          </li>
          <li>Each surface has an <code>aria-label</code>.</li>
          <li>
            The month and year menus are <code>role=&quot;listbox&quot;</code> lists of{" "}
            <code>role=&quot;option&quot;</code> items.
          </li>
        </ul>
        <p>
          A polite live region announces month changes and selection changes: a day pick in single and multiple
          mode, and each pick in a range. The toggle button gets <code>aria-expanded</code> and an accessible name
          that includes the current value. The input gets <code>aria-invalid</code> when the typed text is
          rejected.
        </p>
      </Section>

      <Section title="Keyboard">
        <ApiTable
          rowKey="keys"
          columns={[
            { key: "where", label: "Where" },
            { key: "keys", label: "Keys" },
          ]}
          rows={KEYS.map((row) => ({ where: row.where, keys: row.keys }))}
        />
        <p>
          The header buttons for months and years and the footer buttons expose their shortcuts through{" "}
          <code>aria-keyshortcuts</code> and a <code>title</code>.
        </p>
      </Section>

      <Section title="Focus">
        <p>
          When the picker closes, focus returns to the input unless <code>behavior.returnFocus</code> is{" "}
          <code>false</code>.
        </p>
        <CodeBlock code={FOCUS_CODE} language="typescript" />
      </Section>

      <Section title="Reduced motion">
        <p>
          Motion is off when <code>ui.animation</code> is <code>false</code>. With{" "}
          <code>prefers-reduced-motion: reduce</code> nothing slides, flips or resizes: month changes, view switches
          and opening and closing use short fades instead.
        </p>
        <CodeBlock code={MOTION_CODE} language="typescript" />
      </Section>

      <Section title="Labels for assistive technology">
        <p>
          All texts, the screen-reader ones included, can be translated through the <code>labels</code> group. See{" "}
          <Link href="/datepicker/docs/localization">Localization</Link>.
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
