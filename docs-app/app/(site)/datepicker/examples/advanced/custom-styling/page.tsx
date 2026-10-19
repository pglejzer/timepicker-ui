import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import styles from "./page.module.css";

const BRAND: DatepickerOptions = { ui: { cssClass: "brand" } };
const SOFT: DatepickerOptions = { ui: { cssClass: "soft" } };
const DENSE: DatepickerOptions = { ui: { cssClass: "dense" } };
const CONTRAST: DatepickerOptions = { ui: { cssClass: "contrast" } };
const NIGHT: DatepickerOptions = { ui: { cssClass: "night", colorScheme: "dark" } };

const BRAND_CSS = `.brand {
  --dp-ui-sys-typescale-font: Georgia, "Times New Roman", serif;
  --dp-ui-sys-color-surface-container-high: light-dark(#fff8f4, #2d2018);
  --dp-ui-sys-color-primary: light-dark(#a04000, #ffb68a);
  --dp-ui-sys-color-on-primary: light-dark(#ffffff, #4f2300);
  --dp-ui-sys-color-secondary-container: light-dark(#ffdcc8, #703610);
  --dp-ui-sys-color-on-secondary-container: light-dark(#331200, #ffdcc8);
  --dp-ui-sys-color-on-primary-container: light-dark(#331200, #ffdcc8);
  --dp-ui-container-shape-docked: 4px;
}`;

const SOFT_CSS = `.soft {
  --dp-ui-sys-color-surface-container-high: light-dark(#f6f3ff, #26223a);
  --dp-ui-sys-color-primary: light-dark(#5b4bd6, #c4bcff);
  --dp-ui-sys-color-on-primary: light-dark(#ffffff, #261a8a);
  --dp-ui-sys-color-secondary-container: light-dark(#e3deff, #3d3770);
  --dp-ui-sys-color-on-secondary-container: light-dark(#1b1257, #e3deff);
  --dp-ui-container-shape-docked: 28px;
  --dp-ui-container-elevation: 0 12px 32px rgba(60, 40, 120, 0.18);
  --dp-ui-date-today-outline-width: 2px;
}

.soft .dp-ui__date-indicator {
  border-radius: 12px;
}`;

const DENSE_CSS = `.dense {
  --dp-ui-container-width: 304px;
  --dp-ui-container-shape-docked: 4px;
  --dp-ui-header-height-docked: 52px;
  --dp-ui-date-container-size: 40px;
  --dp-ui-date-state-layer-size: 32px;
  --dp-ui-icon-button-size: 32px;
  --dp-ui-icon-button-icon-size: 20px;
  --dp-ui-menu-button-height: 32px;
  --dp-ui-text-button-height: 32px;
  --dp-ui-sys-typescale-body-large-size: 14px;
  --dp-ui-sys-typescale-body-large-line-height: 20px;
  --dp-ui-sys-typescale-label-large-size: 13px;
}`;

const CONTRAST_CSS = `.contrast {
  --dp-ui-sys-color-surface-container-high: light-dark(#ffffff, #000000);
  --dp-ui-sys-color-surface-variant: light-dark(#e0e0e0, #333333);
  --dp-ui-sys-color-on-surface: light-dark(#000000, #ffffff);
  --dp-ui-sys-color-on-surface-variant: light-dark(#000000, #ffffff);
  --dp-ui-sys-color-primary: light-dark(#000000, #ffffff);
  --dp-ui-sys-color-on-primary: light-dark(#ffffff, #000000);
  --dp-ui-sys-color-secondary-container: #ffd400;
  --dp-ui-sys-color-on-secondary-container: #000000;
  --dp-ui-sys-color-outline: light-dark(#000000, #ffffff);
  --dp-ui-sys-color-outline-variant: light-dark(#000000, #ffffff);
  --dp-ui-sys-state-disabled-opacity: 0.5;
  --dp-ui-container-shape-docked: 4px;
  --dp-ui-container-elevation: none;
  --dp-ui-date-today-outline-width: 2px;
  --dp-ui-focus-ring-color: light-dark(#0b57d0, #8ab4ff);
  --dp-ui-focus-ring-width: 3px;
  border: 2px solid var(--dp-ui-sys-color-outline);
}`;

const NIGHT_CSS = `.night {
  --dp-ui-sys-color-surface-container-high: #0f1b2d;
  --dp-ui-sys-color-surface-variant: #1c2b42;
  --dp-ui-sys-color-on-surface: #e6edf7;
  --dp-ui-sys-color-on-surface-variant: #9fb0c8;
  --dp-ui-sys-color-primary: #5cc8ff;
  --dp-ui-sys-color-on-primary: #00344d;
  --dp-ui-sys-color-secondary-container: #17405c;
  --dp-ui-sys-color-on-secondary-container: #cfeeff;
  --dp-ui-sys-color-on-primary-container: #cfeeff;
  --dp-ui-sys-color-outline: #4a5f7a;
  --dp-ui-sys-color-outline-variant: #25364d;
  --dp-ui-container-shape-docked: 12px;
  --dp-ui-container-elevation: 0 0 0 1px #25364d, 0 12px 32px rgba(0, 0, 0, 0.5);
}`;

function code(cssClass: string, extra = ""): string {
  return `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/main.css";
import "./${cssClass}.css";

new DatepickerUI("#date", {
  ui: { cssClass: "${cssClass}"${extra} },
}).create();`;
}

export default function CustomStylingExamplePage() {
  return (
    <div>
      <PageHeader
        title="Custom Styling"
        description={
          <>
            Five restyled date pickers, each with its CSS and JavaScript. This page documents{" "}
            <code>@pglejzer/datepicker-ui</code>, the companion of timepicker-ui.
          </>
        }
      />

      <Callout title="How these demos are scoped">
        Each variant is one class passed through <code>ui.cssClass</code>. The code shows the plain selector you would
        write, such as <code>.brand</code>. On this page the same rules sit under a wrapper so they do not leak into
        other demos. The{" "}
        <Link href="/datepicker/docs/styling">Custom Styling guide</Link> explains the selectors and the modal case.
      </Callout>

      <div className={styles.scope}>
        <Section
          title="Brand colors and font"
          description={
            <>
              Five system color tokens and the font. The component tokens such as{" "}
              <code>--dp-ui-date-selected-container-color</code> follow them.
            </>
          }
        >
          <CodeBlock code={BRAND_CSS} language="css" filename="brand.css" />
          <DatepickerExample label="brand" options={BRAND} code={code("brand")} />
        </Section>

        <Section
          title="Soft and rounded"
          description={
            <>
              A 28px corner, a lavender surface and a long shadow. Day cells become rounded squares with a class
              rule, because their radius is not a token.
            </>
          }
        >
          <CodeBlock code={SOFT_CSS} language="css" filename="soft.css" />
          <DatepickerExample label="soft" options={SOFT} code={code("soft")} />
        </Section>

        <Section
          title="Dense"
          description={
            <>
              Smaller cells, buttons and type for tight layouts. When you shrink <code>--dp-ui-date-container-size</code>,
              set <code>--dp-ui-container-width</code> to seven cells plus 24px of side padding.
            </>
          }
        >
          <CodeBlock code={DENSE_CSS} language="css" filename="dense.css" />
          <DatepickerExample label="dense" options={DENSE} code={code("dense")} />
        </Section>

        <Section
          title="High contrast"
          description={
            <>
              Black on white, a 2px border, a yellow range color and a thicker focus ring. In dark mode the roles
              swap through <code>light-dark()</code>.
            </>
          }
        >
          <CodeBlock code={CONTRAST_CSS} language="css" filename="contrast.css" />
          <DatepickerExample label="contrast" options={CONTRAST} code={code("contrast")} />
        </Section>

        <Section
          title="Dark custom"
          description={
            <>
              A navy surface with a cyan accent. <code>ui.colorScheme: &quot;dark&quot;</code> keeps the picker dark on
              a light page, so the values need no <code>light-dark()</code>.
            </>
          }
        >
          <CodeBlock code={NIGHT_CSS} language="css" filename="night.css" />
          <DatepickerExample
            label="night"
            options={NIGHT}
            code={code("night", ', colorScheme: "dark"')}
          />
        </Section>
      </div>

      <Section title="Related">
        <ul>
          <li>
            <Link href="/datepicker/docs/styling">Custom Styling guide</Link>
          </li>
          <li>
            <Link href="/datepicker/examples/themes/custom-theme">Custom theme example</Link>
          </li>
          <li>
            <Link href="/datepicker/api/css-variables">CSS variables</Link>
          </li>
          <li>
            <Link href="/datepicker/api/css-classes">CSS classes</Link>
          </li>
        </ul>
      </Section>
    </div>
  );
}
