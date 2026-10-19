import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { DATEPICKER_THEMES } from "@/lib/datepicker";

const THEME_DEMO: DatepickerOptions = { ui: { theme: "basic" } };

const THEME_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/main.css";
import "@pglejzer/datepicker-ui/theme-m2.css";

new DatepickerUI("#date", { ui: { theme: "m2" } }).create();`;

const ALL_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", { ui: { theme: "crane" } }).create();`;

const SCHEME_CODE = `new DatepickerUI("#date", {
  ui: { theme: "basic", colorScheme: "dark" },
}).create();`;

const CUSTOM_JS = `new DatepickerUI("#date", { ui: { cssClass: "brand" } }).create();`;

const CUSTOM_CSS = `.brand {
  --dp-ui-sys-color-primary: #006a6a;
  --dp-ui-sys-color-on-primary: #ffffff;
  --dp-ui-sys-color-secondary-container: #cce8e7;
  --dp-ui-container-shape-docked: 8px;
}`;

const FILES = [
  { file: "@pglejzer/datepicker-ui/index.css", contains: "The core and every theme" },
  { file: "@pglejzer/datepicker-ui/main.css", contains: "The core only, which is enough for basic" },
  { file: "@pglejzer/datepicker-ui/theme-m3-green.css", contains: "One theme, to load next to main.css" },
];

const OTHER_FILES = DATEPICKER_THEMES.filter((name) => name !== "basic" && name !== "m3-green").map(
  (name) => `theme-${name}.css`,
);

const RELATED = [
  { href: "/datepicker/examples/themes/all-themes", title: "All themes example" },
  { href: "/datepicker/examples/themes/dark-mode", title: "Dark mode example" },
  { href: "/datepicker/examples/themes/custom-theme", title: "Custom theme example" },
  { href: "/datepicker/api/css-variables", title: "CSS variables" },
  { href: "/datepicker/api/css-classes", title: "CSS classes" },
];

export default function DatepickerThemesPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Themes"
        description="@pglejzer/datepicker-ui, the companion of timepicker-ui, ships ten themes. Set ui.theme and import index.css or a single theme file."
      />

      <Section title="Ten themes">
        <p>
          The themes are{" "}
          {DATEPICKER_THEMES.map((name, index) => (
            <span key={name}>
              {index > 0 && (index === DATEPICKER_THEMES.length - 1 ? " and " : ", ")}
              <code>{name}</code>
            </span>
          ))}
          . <code>basic</code> is the default and follows Material Design 3 in light and dark. Use the select in
          the demo to switch the theme.
        </p>
        <DatepickerExample label="Themes" themeControl options={THEME_DEMO} code={ALL_CODE} />
      </Section>

      <Section title="One version and two schemes">
        <p>
          <code>basic</code> and <code>blueprint</code> follow <code>ui.colorScheme</code>. The other themes have one
          version and keep their own scheme, so <code>ui.colorScheme</code> has no effect on them.
        </p>
        <Callout tone="note" title="Glassmorphic">
          <code>glassmorphic</code> blurs what is behind the picker, so it needs a coloured background there.
        </Callout>
        <p>
          The themes are named like the ones in timepicker-ui, but datepicker-ui has no <code>dark</code> or{" "}
          <code>blueprint-dark</code>. For a dark picker, use <code>basic</code> or <code>blueprint</code> with a
          dark color scheme.
        </p>
      </Section>

      <Section title="CSS files">
        <ApiTable
          rowKey="file"
          columns={[
            { key: "file", label: "Import", mono: true },
            { key: "contains", label: "Contains" },
          ]}
          rows={FILES.map((row) => ({ file: row.file, contains: row.contains }))}
        />
        <p>
          The other theme files follow the same pattern:{" "}
          {OTHER_FILES.map((file, index) => (
            <span key={file}>
              {index > 0 && (index === OTHER_FILES.length - 1 ? " and " : ", ")}
              <code>{file}</code>
            </span>
          ))}
          . To load a single theme, import <code>main.css</code> first:
        </p>
        <CodeBlock code={THEME_CODE} language="typescript" />
      </Section>

      <Section title="Color scheme">
        <p>
          <code>ui.colorScheme</code> is <code>&quot;light&quot;</code>, <code>&quot;dark&quot;</code> or{" "}
          <code>&quot;auto&quot;</code> (the default). With <code>&quot;auto&quot;</code> the scheme is detected when the
          picker opens, in this order:
        </p>
        <ol>
          <li>
            The first mostly opaque <code>background-color</code> found on the input or one of its ancestors
            decides, and dark means low luminance.
          </li>
          <li>
            Without one, the page <code>color-scheme</code> decides. <code>dark</code> is dark,{" "}
            <code>light dark</code> follows the OS setting and anything else is light.
          </li>
        </ol>
        <p>
          An inline picker re-detects when the page changes its class, style, <code>data-theme</code> or{" "}
          <code>data-color-scheme</code>, or when the OS setting changes. This site passes the scheme explicitly,
          so the demos follow the site dark mode toggle.
        </p>
        <CodeBlock code={SCHEME_CODE} language="typescript" />
      </Section>

      <Section title="Custom theme">
        <p>
          A theme sets CSS variables. Add your own selector with <code>ui.cssClass</code>:
        </p>
        <CodeBlock code={CUSTOM_JS} language="typescript" />
        <CodeBlock code={CUSTOM_CSS} language="css" />
        <p>
          The class is added to the surface root, which is the <code>&lt;dialog&gt;</code> for a modal and the{" "}
          <code>.dp-ui__container</code> element otherwise. The full list of variables is on the{" "}
          <Link href="/datepicker/api/css-variables">CSS Variables</Link> page.
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
