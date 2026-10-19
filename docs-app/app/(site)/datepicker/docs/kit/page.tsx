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

const SURFACES = [
  { name: "PopoverHost", signature: "new PopoverHost(options)", text: "Docked surface: a popover placed next to an anchor element." },
  { name: "DialogHost", signature: "new DialogHost(options)", text: "Modal surface: a native dialog with a backdrop." },
  { name: "InlineHost", signature: "new InlineHost({ container, label })", text: "Inline surface inside a container element." },
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
    signature: "formatHint(pattern: FormatPattern): string",
    text: "Returns a hint for the pattern, such as a placeholder.",
  },
];

const TYPES = [
  { name: "SurfaceHost", text: "Common shape of the three hosts." },
  { name: "SurfaceMode", text: "\"docked\", \"modal\" or \"inline\"." },
  { name: "Scheme", text: "\"light\" or \"dark\"." },
  { name: "FormatPattern", text: "A resolved date pattern." },
  { name: "FormatOption", text: "The value of ui.format." },
  { name: "DatePart", text: "One part of a pattern: day, month or year." },
  { name: "PlainDate", text: "{ year, month, day }." },
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
          <code>close()</code> and <code>destroy()</code> methods.
        </p>
      </Section>

      <Section title="Surface choice">
        <ApiTable rowKey="name" columns={COLUMNS} rows={CHOICE} />
      </Section>

      <Section title="Color scheme">
        <ApiTable rowKey="name" columns={COLUMNS} rows={SCHEME} />
      </Section>

      <Section title="Date text">
        <p>
          A <code>date</code> is <code>{"{ year, month, day }"}</code>.
        </p>
        <ApiTable rowKey="name" columns={COLUMNS} rows={TEXT} />
        <CodeBlock code={USAGE_CODE} language="typescript" />
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
