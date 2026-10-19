import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";

const DARK: DatepickerOptions = { ui: { colorScheme: "dark" } };

const LIGHT: DatepickerOptions = { ui: { colorScheme: "light" } };

const AUTO: DatepickerOptions = { ui: { colorScheme: "auto" } };

function code(scheme: string): string {
  return `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { colorScheme: "${scheme}" },
}).create();`;
}

export default function DarkModeExamplePage() {
  return (
    <div>
      <PageHeader
        title="Dark Mode"
        description={
          <>
            Force a light or dark picker, or let it follow the page. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="Dark">
        <p>
          <code>ui.colorScheme: &quot;dark&quot;</code> forces the dark version of the theme, whatever the page looks
          like. Use the Inline switch to see the calendar in place.
        </p>
        <DatepickerExample label="dark" options={DARK} code={code("dark")} />
      </Section>

      <Section title="Light">
        <p>
          <code>&quot;light&quot;</code> forces the light version, even on a dark page.
        </p>
        <DatepickerExample label="light" options={LIGHT} code={code("light")} />
      </Section>

      <Section title="Auto">
        <p>
          <code>&quot;auto&quot;</code> is the default. The scheme is detected when the picker opens. The first mostly
          opaque <code>background-color</code> on the input or one of its ancestors decides, and a low luminance
          means dark. Without one, the page <code>color-scheme</code> decides: <code>dark</code> is dark,{" "}
          <code>light dark</code> follows the operating system, and anything else is light. An inline picker
          detects again when the page changes.
        </p>
        <DatepickerExample label="auto" options={AUTO} code={code("auto")} />
        <Callout>
          Only <code>basic</code> and <code>blueprint</code> have a light and a dark version. The other themes keep
          their own scheme and ignore <code>colorScheme</code>. The demos on this site pick the scheme from the site
          theme when a demo does not set one.
        </Callout>
      </Section>
    </div>
  );
}
