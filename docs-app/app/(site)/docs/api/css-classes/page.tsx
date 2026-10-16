import type { ReactNode } from "react";
import Link from "next/link";
import { Anatomy, type AnatomyNote } from "@/components/anatomy";
import { ApiTable } from "@/components/api-table";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { cssReference, type CssClass } from "@/lib/css-reference";
import { buildMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const metadata = buildMetadata({
  title: "CSS Classes",
  description:
    "The tp-ui- classes timepicker-ui renders, the state classes it adds and how to write selectors that win over the built-in styles.",
  path: "/docs/api/css-classes",
});

const PARTS: AnatomyNote[] = [
  { selector: ".tp-ui-select-time", side: "left", code: "tp-ui-select-time", text: "Heading above the time fields." },
  { selector: ".tp-ui-hour", side: "left", code: "tp-ui-hour", text: "Hour field." },
  { selector: ".tp-ui-minutes", side: "right", code: "tp-ui-minutes", text: "Minute field." },
  {
    selector: ".tp-ui-wrapper-type-time",
    side: "right",
    code: "tp-ui-wrapper-type-time",
    text: "Group around the AM and PM buttons.",
  },
  {
    selector: ".tp-ui-tips-wrapper > :nth-child(10)",
    side: "left",
    code: "tp-ui-clock-face",
    text: "Dial with the hour or minute numbers.",
  },
  { selector: ".tp-ui-clock-hand", side: "right", code: "tp-ui-clock-hand", text: "Hand that points at the selected number." },
  {
    selector: ".tp-ui-wrapper",
    side: "right",
    code: "tp-ui-wrapper",
    text: "Panel that holds every part. Start your selectors here.",
  },
  { selector: ".tp-ui-footer", side: "left", code: "tp-ui-footer", text: "Footer with the view switch and the buttons." },
  { selector: ".tp-ui-cancel-btn", side: "left", code: "tp-ui-cancel-btn", text: "Cancel button." },
  { selector: ".tp-ui-ok-btn", side: "right", code: "tp-ui-ok-btn", text: "OK button." },
];

const ELEMENT: Record<string, string> = {
  "tp-ui":
    "Root around your input: the element you passed, or a `div` the picker wraps around a bare `<input>`. Your `ui.cssClass` is added here too.",
  "tp-ui--inline": "On `.tp-ui-modal` when `ui.inline.enabled` is on.",
  "tp-ui-am": "AM button (`labels.am`).",
  "tp-ui-body": "Holds the dial.",
  "tp-ui-cancel-btn": "Cancel button (`labels.cancel`).",
  "tp-ui-circle-hand": "Circle at the tip of the hand.",
  "tp-ui-circle-hand-24h": "On `.tp-ui-circle-hand` while the hand points at the inner ring of the 24-hour dial.",
  "tp-ui-clear-btn": "Clear button (`ui.clearButton`).",
  "tp-ui-clock-face": "The round dial. It is also a slider (`role=\"slider\"`) for the active time field.",
  "tp-ui-clock-hand": "The hand.",
  "tp-ui-compact-wheel-mode": "On `.tp-ui-modal` when `ui.mode` is `compact-wheel` and the wheel plugin is registered.",
  "tp-ui-dot": "Dot in the center of the dial.",
  "tp-ui-dots": "Colon between two time fields.",
  "tp-ui-footer": "Footer with the view switch and the buttons.",
  "tp-ui-has-seconds": "On `.tp-ui-modal` when `clock.showSeconds` is on.",
  "tp-ui-header": "Row with the time fields and the AM/PM group.",
  "tp-ui-hour": "Hour field, an `<input>` with `role=\"spinbutton\"`.",
  "tp-ui-hour-text": "Caption under the hour field (`labels.mobileHour`), shown in the keyboard view.",
  "tp-ui-hour-time-12": "Holds one hour number on the outer ring.",
  "tp-ui-hour-time-24": "Holds one hour number on the inner ring (`00` and `13` to `23`).",
  "tp-ui-input": "Added to your input by `create()`. `destroy()` removes it.",
  "tp-ui-input-ripple-wrapper": "Wraps one time field, rounds its corners and draws its ripple.",
  "tp-ui-input-wrapper": "Holds one time field and its caption.",
  "tp-ui-invalid-format": "Added to your input when its value is not a valid time.",
  "tp-ui-invalid-text": "Error message inserted after your input (`labels.invalidTimeFormat`).",
  "tp-ui-keyboard-icon": "Button that switches between the clock view and the keyboard view.",
  "tp-ui-keyboard-icon-wrapper": "Holds the view switch button (`ui.enableSwitchIcon`).",
  "tp-ui-minute-text": "Caption under the minute field (`labels.mobileMinute`), shown in the keyboard view.",
  "tp-ui-minutes": "Minute field, an `<input>` with `role=\"spinbutton\"`.",
  "tp-ui-minutes-time": "Holds one number on the minute or second dial.",
  "tp-ui-mobile-clock-wrapper": "Holds the dial, or the wheel in the wheel modes.",
  "tp-ui-modal":
    "Outer element. As a modal it is the full-screen backdrop. It carries `data-theme` and the mode classes.",
  "tp-ui-ok-btn": "OK button (`labels.ok`).",
  "tp-ui-open-element":
    "On each element that opens the picker: the elements with `data-open` inside the root, or your input when there are none.",
  "tp-ui-pm": "PM button (`labels.pm`).",
  "tp-ui-pointer":
    "On `.tp-ui-modal` after a pointer press inside it, until the next key press. Focus rings are hidden while it is set.",
  "tp-ui-popover":
    "On `.tp-ui-modal` when `compact-wheel` opens as a popover next to the input (`wheel.placement` is set).",
  "tp-ui-popover-anchored":
    "Added with `tp-ui-popover` when the browser supports CSS anchor positioning and the Popover API. CSS then places the popover.",
  "tp-ui-popover-constrained":
    "Added with `tp-ui-popover` when the script places the popover and it does not fit above or below the input. Its height is then limited.",
  "tp-ui-range-header": "Range plugin: the From and To tabs (`role=\"tablist\"`).",
  "tp-ui-range-mode": "On `.tp-ui-modal` when `range.enabled` is on and the range plugin is registered.",
  "tp-ui-range-tab": "One range tab, From or To.",
  "tp-ui-range-tab-label": "Label of a range tab (`range.fromLabel`, `range.toLabel`).",
  "tp-ui-range-tab-value": "Time shown in a range tab.",
  "tp-ui-second-text": "Caption under the seconds field (`labels.second`), shown in the keyboard view.",
  "tp-ui-seconds": "Seconds field (`clock.showSeconds`), an `<input>` with `role=\"spinbutton\"`.",
  "tp-ui-select-time": "Heading above the time fields: `labels.time`, or `labels.mobileTime` in the keyboard view.",
  "tp-ui-timezone": "Timezone plugin: row with the label and the dropdown.",
  "tp-ui-timezone-arrow": "Arrow icon of the timezone dropdown.",
  "tp-ui-timezone-dropdown": "Timezone dropdown (`role=\"combobox\"`).",
  "tp-ui-timezone-label": "Label of the timezone dropdown (`timezone.label`).",
  "tp-ui-timezone-menu": "List of timezones (`role=\"listbox\"`).",
  "tp-ui-timezone-option": "One timezone in the list.",
  "tp-ui-timezone-selected": "Selected timezone, shown in the dropdown.",
  "tp-ui-tips-animation": "On `.tp-ui-clock-hand` while the hand animates to a new value.",
  "tp-ui-tips-disabled": "On a dial number, and the element that holds it, when `clock.disabledTime` excludes it.",
  "tp-ui-tips-wrapper": "Holds the numbers of the outer ring.",
  "tp-ui-tips-wrapper-24h": "Holds the numbers of the inner ring when `clock.type` is `24h`.",
  "tp-ui-tips-wrapper-24h-disabled": "Has a rule in `main.css`, but the picker never adds it.",
  "tp-ui-tz-mode": "On `.tp-ui-modal` when `timezone.enabled` is on and the timezone plugin is registered.",
  "tp-ui-value-tips": "One number on the dial.",
  "tp-ui-value-tips-24h": "One number on the inner ring.",
  "tp-ui-view-switching":
    "On `.tp-ui-modal` while the clock and keyboard views swap on a landscape screen up to 480px tall, when animation is on.",
  "tp-ui-wheel-ampm": "AM/PM column of `compact-wheel` with the 12-hour clock.",
  "tp-ui-wheel-column": "One scrolling column (`role=\"listbox\"`).",
  "tp-ui-wheel-column-wrapper": "Wraps one column.",
  "tp-ui-wheel-container": "Wheel plugin: holds the columns.",
  "tp-ui-wheel-highlight": "Band that marks the selected row.",
  "tp-ui-wheel-item": "One value in a column.",
  "tp-ui-wheel-mode": "On `.tp-ui-modal` when `ui.mode` is `wheel` and the wheel plugin is registered.",
  "tp-ui-wheel-padding": "Empty rows at the start and end of a column, so the first and last values can reach the middle.",
  "tp-ui-wheel-separator": "Colon between two columns.",
  "tp-ui-wrapper": "Panel that holds every part. Your `ui.cssClass` is added here when the picker opens.",
  "tp-ui-wrapper-btn": "Holds the Clear, Cancel and OK buttons.",
  "tp-ui-wrapper-time": "Holds the time fields and the colons.",
  "tp-ui-wrapper-time-24h": "Added to `.tp-ui-wrapper-time` when `clock.type` is `24h`.",
  "tp-ui-wrapper-type-time": "AM/PM group, shown with the 12-hour clock.",
};

const ADDED_WHEN: Record<string, string> = {
  active:
    "The part is selected: the time field being edited, the chosen AM or PM button, the chosen number on the dial and the current range tab.",
  "at-end": "On `.tp-ui-wheel-column-wrapper` when the last value of the column is selected.",
  "at-start":
    "On `.tp-ui-wheel-column-wrapper` when the first value of the column is selected, and when the column is first rendered.",
  disabled:
    "The control cannot be used now. Set on your input and the other `.tp-ui-open-element` elements while the picker is open (not inline), on Clear while there is nothing to clear, on OK while the time is excluded by `clock.disabledTime` or was just cleared, on OK in range mode until From and To make a valid range, and on the To tab until From has a time. Clear, OK and the To tab also get `aria-disabled=\"true\"`.",
  expanded:
    "The clock view is shown. Set on the elements of the modal when the picker opens, unless `ui.mobile` opens the keyboard view, and again when the user switches back to the clock.",
  "is-center":
    "On the `.tp-ui-wheel-item` in the middle of its column, which is the selected value. It also gets `aria-selected=\"true\"`.",
  "is-disabled":
    "On a `.tp-ui-wheel-item` that `clock.disabledTime` excludes, together with `aria-disabled=\"true\"`. With `wheel.hideDisabled` these items are removed instead.",
  "is-dragging": "On a `.tp-ui-wheel-column` while it is dragged with a pointer.",
  mobile:
    "The keyboard view is shown. With `ui.mobile` the picker opens in this view and most of its elements carry the class. The view switch in the footer adds or removes it on `.tp-ui-wrapper`, the header and the time fields.",
  none: "On `.tp-ui-tips-wrapper-24h` while minutes or seconds are on the dial. It hides the inner ring of the 24-hour clock.",
  removed: "On `.tp-ui-modal` when `ui.backdrop` is `false`. It makes the backdrop transparent. Not used in inline mode.",
  "scale-in":
    "On `.tp-ui-clock-face` once the dial is shown: right after the picker opens, and after a switch back to the clock view. It fades and scales the dial in.",
  show: "On `.tp-ui-modal` while the picker is open. Removing it runs the close transition.",
};

const SPECIFICITY_EXAMPLE = `/* new TimepickerUI(input, { ui: { cssClass: 'my-picker' } }) */
.tp-ui-wrapper.my-picker .tp-ui-hour.active,
.tp-ui-wrapper.my-picker .tp-ui-minutes.active {
  background-color: #111111;
  color: #ffffff;
}

.tp-ui-wrapper.my-picker .tp-ui-am.active,
.tp-ui-wrapper.my-picker .tp-ui-pm.active {
  background-color: #111111;
  color: #ffffff;
}`;

function withCode(text: string): ReactNode[] {
  return text.split("`").map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part));
}

function describeClass(entry: CssClass): ReactNode {
  const text = ELEMENT[entry.name];
  if (text) return withCode(text);
  return (
    <>
      Used in <code>{entry.example}</code>.
    </>
  );
}

export default function CssClassesPage() {
  const modifiers = cssReference.modifiers.filter((entry) => ADDED_WHEN[entry.name]);

  return (
    <div>
      <PageHeader
        title="CSS Classes"
        description={
          <>
            Each part of the picker has a <code>tp-ui-*</code> class you can target in your CSS.
          </>
        }
      />

      <p>
        Change colors, sizes and fonts with the <Link href="/docs/api/css-variables">CSS variables</Link> first,
        and target these classes for what the variables do not cover. The{" "}
        <Link href="/examples/advanced/custom-styling">custom styling examples</Link> use both.
      </p>

      <Anatomy
        notes={PARTS}
        options={{ clock: { type: "12h" }, ui: { inline: { enabled: true, showButtons: true } } }}
        caption="Parts of the clock picker and their classes."
      />

      <Section title="All classes">
        <p>
          The table lists every class that <code>main.css</code> of timepicker-ui {cssReference.version}{" "}
          has a rule for. Classes of the range, timezone and wheel plugins appear only when the plugin is
          registered and turned on in the options.
        </p>
        <div className={styles.reference}>
          <ApiTable
            columns={[
              { key: "name", label: "Class" },
              { key: "element", label: "Element" },
            ]}
            rows={cssReference.classes.map((entry) => ({
              id: entry.name,
              name: <code>{entry.name}</code>,
              element: describeClass(entry),
            }))}
            rowKey="id"
          />
        </div>
        <p>
          The picker also renders a few classes that have no rule in <code>main.css</code>. They are not in
          the table, but you can target them:
        </p>
        <ul>
          <li>
            <code>tp-ui-type-mode</code> on both AM/PM buttons, next to <code>tp-ui-am</code> and{" "}
            <code>tp-ui-pm</code>.
          </li>
          <li>
            <code>tp-ui-range-from</code> and <code>tp-ui-range-to</code> on the range tabs, and{" "}
            <code>tp-ui-range-from-time</code> and <code>tp-ui-range-to-time</code> on their times.
          </li>
          <li>
            <code>tp-ui-wheel-hours</code>, <code>tp-ui-wheel-minutes</code> and{" "}
            <code>tp-ui-wheel-seconds</code> on the wheel columns.
          </li>
          <li>
            <code>tp-ui-clock-hand-24h</code> on the hand, set together with{" "}
            <code>tp-ui-circle-hand-24h</code>.
          </li>
        </ul>
      </Section>

      <Section title="State classes">
        <p>
          These classes have no <code>tp-ui-</code> prefix. The picker adds them next to a{" "}
          <code>tp-ui-*</code> class when a state starts and removes them when it ends. Write them together
          with that class, as in <code>.tp-ui-hour.active</code>. A rule for a bare <code>.active</code> or{" "}
          <code>.disabled</code> elsewhere on your page also matches the picker.
        </p>
        <div className={styles.reference}>
          <ApiTable
            columns={[
              { key: "name", label: "Class" },
              { key: "when", label: "Added when" },
            ]}
            rows={modifiers.map((entry) => ({
              id: entry.name,
              name: <code>{entry.name}</code>,
              when: withCode(ADDED_WHEN[entry.name]),
            }))}
            rowKey="id"
          />
        </div>
        <p>
          Mode classes such as <code>tp-ui--inline</code>, <code>tp-ui-wheel-mode</code> and{" "}
          <code>tp-ui-has-seconds</code> sit on <code>.tp-ui-modal</code>. They are listed under{" "}
          <a href="#all-classes">All classes</a>.
        </p>
        <p>
          Controls with the <code>data-md3-ripple</code> attribute also get <code>is-pressed</code> while a
          pointer is down on them, and <code>is-rippling</code> while the{" "}
          <Link href="/docs/advanced/styling#material-design-3-ripple-effect">ripple</Link> runs (never with{" "}
          <code>prefers-reduced-motion</code>). Wheel items next to the selected one get{" "}
          <code>is-near</code>, which has no built-in rule.
        </p>
      </Section>

      <Section title="Specificity">
        <p>
          Built-in state rules use two or three classes. <code>.tp-ui-hour.active</code> sets the{" "}
          <code>background-color</code> and <code>color</code> of the selected field, and{" "}
          <code>.tp-ui-hour.mobile.active</code> does the same in the keyboard view. A{" "}
          <code>.tp-ui-hour.active</code> rule of your own has the same weight as the first one, so
          whichever loads last wins. It always loses to the second. Theme files only set{" "}
          <code>--tp-*</code> variables, so they add no rules you have to beat.
        </p>
        <p>
          Pass a class in <code>ui.cssClass</code> and start each selector with{" "}
          <code>.tp-ui-wrapper.&lt;your-class&gt;</code>. The picker adds the class to{" "}
          <code>.tp-ui-wrapper</code> when it opens. The prefix adds two classes, so{" "}
          <code>.tp-ui-wrapper.my-picker .tp-ui-hour.active</code> has four and wins over the built-in
          state rules. Load your stylesheet after <code>timepicker-ui/main.css</code>, so it also wins a
          tie, such as the hover rule of a selected field in the keyboard view.
        </p>
        <CodeBlock code={SPECIFICITY_EXAMPLE} language="css" />
        <p>
          The prefix wins without the state class too. A <code>background-color</code> on{" "}
          <code>.tp-ui-wrapper.my-picker .tp-ui-hour</code> also replaces the hover and selected colors.
          To recolor a part in every state, set its <Link href="/docs/api/css-variables">variables</Link>{" "}
          instead. A few layout rules use four classes or more, for example the field sizes when seconds are
          shown, which start with <code>.tp-ui-has-seconds .tp-ui-wrapper-time</code>. Change those
          through their variables too.
        </p>
        <p>
          In forced-colors mode the rules for the selected field, AM/PM button and dial number use system
          colors with <code>!important</code>, so they win over yours.
        </p>
      </Section>
    </div>
  );
}
