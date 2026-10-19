import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const THEME: DatepickerOptions = { ui: { theme: "m3-green" } };

const THEME_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { theme: "m3-green" },
}).create();`;

const SINGLE_FILE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/main.css";
import "@pglejzer/datepicker-ui/theme-m3-green.css";

new DatepickerUI("#date", {
  ui: { theme: "m3-green" },
}).create();`;

export default function AllThemesExamplePage() {
  return (
    <div>
      <PageHeader
        title="All Themes"
        description={
          <>
            Switch between the ten built-in themes. This page documents <code>@pglejzer/datepicker-ui</code>, the
            companion of timepicker-ui.
          </>
        }
      />

      <Section title="Theme switcher">
        <p>
          <code>ui.theme</code> is one of <code>basic</code>, <code>m3-green</code>, <code>crane</code>,{" "}
          <code>crane-straight</code>, <code>m2</code>, <code>glassmorphic</code>, <code>pastel</code>,{" "}
          <code>ai</code>, <code>cyberpunk</code> and <code>blueprint</code>. Use the select in the demo to change
          the theme, and the Inline switch to see the calendar without opening it.
        </p>
        <DatepickerExample label="Themes" themeControl options={THEME} code={THEME_CODE} />
        <Callout>
          <code>basic</code> and <code>blueprint</code> follow <code>ui.colorScheme</code>. The other themes have one
          scheme. <code>glassmorphic</code> blurs what is behind the picker, so it needs a coloured background.
        </Callout>
      </Section>

      <Section title="Load only one theme">
        <p>
          <code>index.css</code> contains the core and every theme. To ship less CSS, import <code>main.css</code>{" "}
          and the file of the theme you use. <code>main.css</code> alone is enough for <code>basic</code>.
        </p>
        <CodeBlock code={SINGLE_FILE_CODE} language="typescript" />
      </Section>
    </div>
  );
}
