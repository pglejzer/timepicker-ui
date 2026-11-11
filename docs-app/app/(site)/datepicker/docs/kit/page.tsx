import Link from "next/link";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const IMPORT_CODE = `import {
  PopoverHost,
  resolveSurfaceMode,
  parseDate,
} from "@pglejzer/datepicker-ui/kit";`;

const USAGE_CODE = `import { resolvePattern, parseDate, formatDate } from "@pglejzer/datepicker-ui/kit";

const pattern = resolvePattern("dd.MM.yyyy", "de-DE");

const date = parseDate("14.03.2025", pattern);
// { year: 2025, month: 3, day: 14 }

if (date) formatDate(date, pattern);
// "14.03.2025"`;

const UMD_CODE = `<script src="https://unpkg.com/@pglejzer/datepicker-ui/dist/umd/kit.js"></script>
<script>
  const { resolvePattern, parseDate } = DatepickerUIKit;
</script>`;

const LABEL_CODE = `import { InlineHost } from "@pglejzer/datepicker-ui/kit";

// <h2 id="trip-title">Trip dates</h2>
const host = new InlineHost({
  container: document.querySelector<HTMLElement>("#calendar")!,
  label: "Choose dates",
  labelledBy: "trip-title",
});

// No labelledBy: the label becomes aria-label again
host.setLabel("Choose a return date");`;

const SURFACES = [
  { name: "PopoverHost", signature: "new PopoverHost(options)", text: "Docked surface: a popover placed next to an anchor element." },
  { name: "DialogHost", signature: "new DialogHost(options)", text: "Modal surface: a native dialog with a backdrop." },
  {
    name: "InlineHost",
    signature: "new InlineHost({ container, label, labelledBy? })",
    text: "Inline surface inside a container element.",
  },
  { name: "waitForExit", signature: "waitForExit(element: HTMLElement): Promise<void>", text: "Waits for an exit animation to finish." },
];

const CHOICE = [
  {
    name: "resolveSurfaceMode",
    signature:
      "resolveSurfaceMode(option: \"auto\" | \"docked\" | \"modal\", inlineEnabled: boolean, viewportWidth: number, viewportHeight: number): SurfaceMode",
    text: "Returns \"docked\", \"modal\" or \"inline\". \"auto\" means modal below 600 px wide or 480 px tall.",
  },
  {
    name: "isFullscreenRange",
    signature:
      "isFullscreenRange(mode: CalendarMode, surface: SurfaceMode, viewportWidth: number, fullscreenBelow: number): boolean",
    text: "Says whether a range picker goes full screen.",
  },
  {
    name: "fitsViewport",
    signature: "fitsViewport(root: HTMLElement, anchor: HTMLElement): boolean",
    text: "Says whether a docked surface fits the window height: its own height, the anchor's height and an 8 px margin above and below. Call it while the surface is shown. The picker uses it to open a dialog instead with \"auto\".",
  },
];

const SCHEME = [
  {
    name: "detectColorScheme",
    signature: "detectColorScheme(from: HTMLElement): Scheme",
    text: "Returns \"light\" or \"dark\" for an element.",
  },
  {
    name: "watchColorScheme",
    signature: "watchColorScheme(onChange: () => void): () => void",
    text: "Reports changes and returns a function that stops watching.",
  },
  {
    name: "applyTheme",
    signature: "applyTheme(root: HTMLElement, theme: SurfaceTheme): void",
    text: "Writes data-theme, data-color-scheme, the extra classes and the right-to-left class onto a surface root. Classes from the previous call are removed, so it is safe to call again.",
  },
];

const PARTS = [
  {
    name: "Pager",
    signature: "new Pager<K>(viewport: HTMLElement, options: PagerOptions<K>)",
    text: "The month paging of the picker, with its drag and wheel gestures. show(key) shows a page, slide(key, direction) animates to it, finish() ends a running slide and destroy() removes it. onCommit reports a finished gesture, and you call slide() to show the new page.",
  },
  {
    name: "createTextButton",
    signature: "createTextButton(modifier: string, label: string): HTMLButtonElement",
    text: "Builds a text button with the classes dp-ui__text-button and dp-ui__text-button--<modifier>.",
  },
];

const NAMES = [
  {
    name: "resolveWeekStart",
    signature: "resolveWeekStart(locale: string, option: WeekStartOption): Weekday",
    text: "Returns the first day of the week, 0 for Sunday to 6 for Saturday. \"auto\" follows the locale.",
  },
  {
    name: "weekdayNames",
    signature: "weekdayNames(locale: string, width: \"long\" | \"short\" | \"narrow\"): readonly string[]",
    text: "The seven weekday names from Intl, starting with Sunday.",
  },
  {
    name: "formatMonthYear",
    signature: "formatMonthYear(view: YearMonth, locale: string): string",
    text: "The month and year as the picker writes them, such as March 2025.",
  },
  {
    name: "formatFullDate",
    signature: "formatFullDate(date: PlainDate, locale: string): string",
    text: "Weekday, day, month and year, as in the accessible name of a day.",
  },
];

const TEXT = [
  {
    name: "resolvePattern",
    signature: "resolvePattern(format: FormatOption, locale: string, precision?: Precision): FormatPattern",
    text: "Turns \"auto\" or a pattern string into a pattern for a locale.",
  },
  {
    name: "formatDate",
    signature: "formatDate(date: PlainDate, pattern: FormatPattern): string",
    text: "Formats a date as text.",
  },
  {
    name: "parseDate",
    signature: "parseDate(text: string, pattern: FormatPattern): PlainDate | null",
    text: "Parses typed text, or returns null.",
  },
  {
    name: "maskDateText",
    signature: "maskDateText(text: string, pattern: FormatPattern): string",
    text: "Formats typed digits to the pattern.",
  },
  {
    name: "formatHint",
    signature: "formatHint(pattern: FormatPattern, letters?: HintLetters): string",
    text: "Returns a hint for the pattern, such as a placeholder. letters sets the day, month and year letters, dd, mm and yyyy by default.",
  },
  {
    name: "leadingDateLength",
    signature: "leadingDateLength(text: string, pattern: FormatPattern): number",
    text: "Length of the date at the start of the text, or 0 when it holds no digit. A separator after the last group is not part of the date.",
  },
  {
    name: "normalizeDigits",
    signature: "normalizeDigits(text: string): string",
    text: "Maps Arabic-Indic and Persian digits to Latin digits, drops bidi marks and trims.",
  },
  {
    name: "RANGE_SEPARATOR",
    signature: "RANGE_SEPARATOR: \" – \"",
    text: "What the picker writes between the two dates of a range: a space, an en dash and a space.",
  },
  {
    name: "splitRangeText",
    signature: "splitRangeText(text: string): readonly [string, string] | null",
    text: "Splits range text the way the picker does: at an en or em dash, or at a hyphen with spaces around it. Returns null unless there are exactly two parts.",
  },
];

const TYPES = [
  { name: "SurfaceHost", text: "Common shape of the three hosts." },
  { name: "SurfaceMode", text: "\"docked\", \"modal\" or \"inline\"." },
  { name: "Scheme", text: "\"light\" or \"dark\"." },
  { name: "SurfaceTheme", text: "{ theme, colorScheme, className?, rtl? }, the settings applyTheme writes." },
  { name: "PagerOptions", text: "Options of Pager: right-to-left, swipe, animation and how to build and step pages." },
  { name: "FormatPattern", text: "A resolved date pattern." },
  { name: "FormatOption", text: "The value of ui.format." },
  { name: "HintLetters", text: "{ day, month, year }, the letters formatHint uses." },
  { name: "DatePart", text: "One part of a pattern: day, month or year." },
  { name: "WeekStartOption", text: "\"auto\", \"sunday\", \"monday\" or \"saturday\"." },
  { name: "Weekday", text: "0 to 6, Sunday to Saturday." },
  { name: "PlainDate", text: "{ year, month, day }." },
  { name: "YearMonth", text: "{ year, month }." },
  { name: "ThemeName", text: "A built-in theme name." },
];

const RELATED = [
  { href: "/datepicker/docs/typed-input", title: "Typed input and format" },
  { href: "/datepicker/docs/display-modes", title: "Display modes" },
  { href: "/datepicker/docs/themes", title: "Themes and color scheme" },
  { href: "/datepicker/api/typescript", title: "TypeScript types" },
];

const COLUMNS = [
  { key: "name", label: "Export", mono: true },
  { key: "signature", label: "Signature", mono: true },
  { key: "text", label: "Purpose" },
];

export default function DatepickerKitPage() {
  return (
    <div>
      <PageHeader
        title="datepicker-ui Kit for Companion Packages"
        description="The kit entry of @pglejzer/datepicker-ui, the companion of timepicker-ui, exports the building blocks the picker uses, for packages built on top of it."
      />

      <Section title="What the kit is">
        <p>
          <code>@pglejzer/datepicker-ui/kit</code> exports the building blocks the picker itself uses, for packages
          built on top of datepicker-ui. It has named exports only.
        </p>
        <CodeBlock code={IMPORT_CODE} language="typescript" />
        <Callout title="Load the CSS">
          The hosts render <code>dp-ui__container</code> elements, so load <code>main.css</code> or{" "}
          <code>index.css</code> next to them.
        </Callout>
      </Section>

      <Section title="Surfaces">
        <ApiTable rowKey="name" columns={COLUMNS} rows={SURFACES} />
        <p>
          Each host has <code>root</code> and <code>body</code> elements and <code>open()</code>,{" "}
          <code>close()</code>, <code>destroy()</code> and <code>setLabel(label, labelledBy?)</code> methods.
        </p>
        <p>
          Every host constructor takes a <code>label</code> and an optional <code>labelledBy</code>: the id, or
          space-separated ids, of a visible title. A non-empty <code>labelledBy</code> sets{" "}
          <code>aria-labelledby</code> and removes <code>aria-label</code>. Otherwise the <code>label</code> becomes
          the <code>aria-label</code> and <code>aria-labelledby</code> is removed. <code>setLabel()</code> renames a
          shown surface by the same rule.
        </p>
        <CodeBlock code={LABEL_CODE} language="typescript" />
      </Section>

      <Section title="Surface choice">
        <ApiTable rowKey="name" columns={COLUMNS} rows={CHOICE} />
      </Section>

      <Section title="Theme and color scheme">
        <ApiTable rowKey="name" columns={COLUMNS} rows={SCHEME} />
      </Section>

      <Section title="Paging and buttons">
        <ApiTable rowKey="name" columns={COLUMNS} rows={PARTS} />
      </Section>

      <Section title="Date text">
        <p>
          A <code>date</code> is <code>{"{ year, month, day }"}</code>.
        </p>
        <ApiTable rowKey="name" columns={COLUMNS} rows={TEXT} />
        <CodeBlock code={USAGE_CODE} language="typescript" />
      </Section>

      <Section title="Week and name helpers">
        <p>The helpers the calendar uses for its week layout and its month and day names.</p>
        <ApiTable rowKey="name" columns={COLUMNS} rows={NAMES} />
      </Section>

      <Section title="Types">
        <ApiTable
          rowKey="name"
          columns={[
            { key: "name", label: "Type", mono: true },
            { key: "text", label: "Meaning" },
          ]}
          rows={TYPES}
        />
      </Section>

      <Section title="From a CDN">
        <p>
          <code>dist/umd/kit.js</code> exposes the exports as the global <code>DatepickerUIKit</code>.
        </p>
        <CodeBlock code={UMD_CODE} language="html" />
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
