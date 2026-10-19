import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";

const INLINE: DatepickerOptions = {
  ui: { inline: { enabled: true } },
  behavior: { commitOnChange: true },
};

const INLINE_FOOTER: DatepickerOptions = {
  ui: { inline: { enabled: true }, footer: true },
};

const HTML_CODE = `<input id="date" />
<div id="calendar"></div>`;

const INLINE_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { inline: { enabled: true, container: "#calendar" } },
  behavior: { commitOnChange: true },
}).create();`;

const FOOTER_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { inline: { enabled: true, container: "#calendar" }, footer: true },
}).create();`;

export default function DatepickerInlineExamplePage() {
  return (
    <div>
      <PageHeader
        title="Inline Calendar"
        description="Render the calendar permanently inside a page container with @pglejzer/datepicker-ui."
      />

      <Section title="Inline">
        <p>
          <code>ui.inline.enabled</code> renders the calendar into <code>ui.inline.container</code>, a selector or
          an element, instead of opening it. The input still holds the value. An inline picker has no footer by
          default, so it commits only through <code>behavior.commitOnChange</code> or{" "}
          <code>behavior.closeOnSelect</code>.
        </p>
        <CodeBlock code={HTML_CODE} language="html" />
        <DatepickerExample label="Inline" options={INLINE} code={INLINE_CODE} />
      </Section>

      <Section title="With a footer">
        <p>
          <code>ui.footer: true</code> shows the footer in inline mode. The user then confirms with the OK button
          and the picker commits nothing before that, so <code>commitOnChange</code> is not needed.
        </p>
        <DatepickerExample label="Inline footer" options={INLINE_FOOTER} code={FOOTER_CODE} />
      </Section>

      <p>
        Docs: <Link href="/datepicker/docs/display-modes">Display Modes</Link> ·{" "}
        <Link href="/datepicker/docs/layouts">Layouts</Link>
      </p>
    </div>
  );
}
