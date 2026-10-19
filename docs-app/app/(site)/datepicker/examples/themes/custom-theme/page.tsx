import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import styles from "./page.module.css";

const BRAND: DatepickerOptions = { ui: { cssClass: "brand", displayMode: "docked" } };

const CSS_CODE = `.brand {
  --dp-ui-sys-color-primary: #006a6a;
  --dp-ui-sys-color-on-primary: #ffffff;
  --dp-ui-sys-color-secondary-container: #cce8e7;
  --dp-ui-sys-color-on-secondary-container: #05201f;
  --dp-ui-container-shape-docked: 8px;
}`;

const BRAND_CODE = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/index.css";

new DatepickerUI("#date", {
  ui: { cssClass: "brand", displayMode: "docked" },
}).create();`;

export default function CustomThemeExamplePage() {
  return (
    <div>
      <PageHeader
        title="Custom Theme"
        description={
          <>
            Restyle the picker with a class and CSS variables. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Section title="A class and a few variables">
        <p>
          A theme is a set of CSS variables. <code>ui.cssClass</code> adds your class to the surface root, which is
          the <code>&lt;dialog&gt;</code> for a modal and the <code>.dp-ui__container</code> element otherwise. Set
          the variables on that class.
        </p>
        <CodeBlock code={CSS_CODE} language="css" filename="brand.css" />
        <div className={styles.scope}>
          <DatepickerExample label="brand" options={BRAND} code={BRAND_CODE} />
        </div>
        <Callout>
          The system tokens (<code>--dp-ui-sys-color-*</code>) feed the component tokens such as{" "}
          <code>--dp-ui-date-selected-container-color</code>. Override a system token to recolour everything that
          uses it, or a component token to change one part.
        </Callout>
      </Section>
    </div>
  );
}
