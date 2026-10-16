import Link from "next/link";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { CssVariableLegend, CssVariableTable } from "@/components/css-variable-table";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { cssReference } from "@/lib/css-reference";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "CSS Variables",
  description:
    "Every --tp- CSS variable in timepicker-ui with its default value and the classes that read it, generated from the published stylesheet.",
  path: "/docs/api/css-variables",
});

const CSS_EXAMPLE = `/* Every picker */
.tp-ui-wrapper {
  --tp-primary: #0b57d0;
}

/* One picker, created with ui: { cssClass: 'my-picker' } */
.tp-ui-wrapper.my-picker {
  --tp-primary: #b3261e;
  --tp-border-radius: 8px;
}`;

const JS_EXAMPLE = `import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';

const picker = new TimepickerUI('#time', {
  ui: { cssClass: 'my-picker' },
});
picker.create();`;

const variablesByName = new Map(cssReference.variables.map((variable) => [variable.name, variable]));

function notRead(...names: string[]): boolean {
  return names.every((name) => {
    const variable = variablesByName.get(name);
    return !variable || (!variable.read && !variable.setByScript);
  });
}

export default function CssVariablesPage() {
  const unread = {
    zIndex: notRead("--tp-z-modal", "--tp-z-backdrop"),
    backdrop: notRead("--tp-backdrop", "--tp-opacity-backdrop"),
    hover: notRead("--tp-hover-bg"),
    radius: notRead("--tp-radius"),
  };
  const anyUnread = Object.values(unread).some(Boolean);

  return (
    <div>
      <PageHeader
        title="CSS Variables"
        description={
          <>
            All {cssReference.variables.length} <code>--tp-*</code> variables in{" "}
            <code>timepicker-ui</code> {cssReference.version}, with their default values and the
            classes that read them.
          </>
        }
      />

      <p>
        The tables are generated from the CSS and JavaScript in the published package, so they
        match what you install. Set a variable on <code>.tp-ui-wrapper</code> to change every
        picker, or on <code>.tp-ui-wrapper.my-picker</code> with{" "}
        <code>{"ui: { cssClass: 'my-picker' }"}</code> to change one.{" "}
        <a href="#setting-variables">Setting Variables</a> has the full example, and{" "}
        <a href="#reading-the-table">Reading the Table</a> explains the entries in each column.
      </p>

      <CssVariableTable />

      <Section title="Setting Variables">
        <p>
          Most defaults are declared on <code>:root</code>. The built-in themes other than{" "}
          <code>basic</code> set their own values on the modal through its{" "}
          <code>data-theme</code> attribute, which overrides <code>:root</code>. A value you set
          on <code>.tp-ui-wrapper</code> applies inside the panel with any theme.
        </p>
        <CodeBlock code={CSS_EXAMPLE} language="css" />
        <CodeBlock code={JS_EXAMPLE} language="typescript" />
        <p>
          A variable reaches only the element you set it on and the elements inside it.{" "}
          <code>.tp-ui-wrapper</code> sits inside <code>.tp-ui-modal</code>. When{" "}
          <strong>Used by</strong> lists <code>.tp-ui-modal</code>, a rule may read the variable
          on the modal itself, where a value on the wrapper does not reach. Set those variables
          on <code>.tp-ui-modal</code> or <code>:root</code>.
        </p>
        <p>
          <Link href="/docs/api/css-classes">CSS Classes</Link> shows which element each class
          belongs to. <Link href="/docs/advanced/styling">Custom Styling</Link> has complete
          themes and covers the focus ring and the ripple.
        </p>
      </Section>

      <Section title="Reading the Table">
        <p>
          <strong>Default</strong> is the value in <code>main.css</code>, which the{" "}
          <code>basic</code> theme uses. Hex, <code>rgb()</code> and <code>hsl()</code> values
          have a color swatch. <strong>Used by</strong> lists the classes named in the rules that
          read the variable. Other entries in these two columns:
        </p>
        <CssVariableLegend />

        {anyUnread && (
          <Callout tone="warning" title="Variables that change nothing">
            <p>
              In {cssReference.version}, no rule reads these variables, so setting them has no
              effect:
            </p>
            <ul>
              {unread.zIndex && (
                <li>
                  <code>--tp-z-modal</code> and <code>--tp-z-backdrop</code>. The stylesheet sets{" "}
                  <code>z-index: 5000</code> on <code>.tp-ui-modal</code> and <code>5001</code> on{" "}
                  <code>.tp-ui-wrapper</code>. To change the stacking order, set{" "}
                  <code>z-index</code> on <code>.tp-ui-modal</code> as shown in{" "}
                  <Link href="/docs/guides/troubleshooting#the-modal-shows-behind-a-header-or-inside-a-clipped-container">
                    Troubleshooting
                  </Link>
                  .
                </li>
              )}
              {unread.backdrop && (
                <li>
                  <code>--tp-backdrop</code> and <code>--tp-opacity-backdrop</code>. The backdrop
                  color is set on <code>.tp-ui-modal</code> itself. Set its{" "}
                  <code>background-color</code> to change it.
                </li>
              )}
              {unread.hover && (
                <li>
                  <code>--tp-hover-bg</code>. The hover background of the time fields and the
                  timezone list comes from <code>--tp-surface-hover</code>.
                </li>
              )}
              {unread.radius && (
                <li>
                  <code>--tp-radius</code>, which some theme files set. The panel corners come
                  from <code>--tp-border-radius</code>.
                </li>
              )}
            </ul>
          </Callout>
        )}
      </Section>
    </div>
  );
}
