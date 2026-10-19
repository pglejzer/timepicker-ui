import Link from "next/link";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import { ApiTable } from "@/components/api-table";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { DatepickerExample } from "@/components/datepicker-example";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import styles from "./page.module.css";

const GUIDE_DEMO: DatepickerOptions = { ui: { cssClass: "guide" } };

const GUIDE_CSS = `.guide {
  --dp-ui-sys-color-primary: light-dark(#0b6b3a, #7fdba0);
  --dp-ui-sys-color-on-primary: light-dark(#ffffff, #00391c);
  --dp-ui-container-shape-docked: 8px;
}`;

const GUIDE_JS = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/main.css";
import "./guide.css";

new DatepickerUI("#date", { ui: { cssClass: "guide" } }).create();`;

const TOKEN_CODE = `.brand {
  --dp-ui-sys-color-primary: #a04000;
  --dp-ui-sys-color-on-primary: #ffffff;
}

.brand {
  --dp-ui-date-selected-container-color: #7a2e00;
}`;

const CLASS_CODE = `.brand .dp-ui__date-indicator {
  border-radius: 12px;
}

.brand .dp-ui__text-button--confirm {
  text-transform: uppercase;
}`;

const SCOPE_CODE = `new DatepickerUI("#start", { ui: { cssClass: "brand" } }).create();
new DatepickerUI("#end", { ui: { cssClass: "plain" } }).create();`;

const MODAL_CSS = `:is(.dp-ui__container, .dp-ui__dialog).brand {
  --dp-ui-sys-color-primary: #a04000;
  --dp-ui-sys-color-on-primary: #ffffff;
}`;

const PAGE_SCOPE_CSS = `.checkout :is(.dp-ui__container, .dp-ui__dialog).brand {
  --dp-ui-sys-color-primary: #a04000;
}`;

const WRONG_CSS = `:root,
.dp-ui {
  --dp-ui-sys-color-primary: #a04000;
}`;

const SCHEME_CSS = `.brand {
  --dp-ui-sys-color-primary: light-dark(#a04000, #ffb68a);
  --dp-ui-sys-color-on-primary: light-dark(#ffffff, #4f2300);
}`;

const SCHEME_JS = `new DatepickerUI("#date", {
  ui: { cssClass: "brand", colorScheme: "dark" },
}).create();`;

const THEME_CSS = `:is(.dp-ui__container, .dp-ui__dialog).brand[data-theme] {
  --dp-ui-sys-color-primary: #a04000;
  --dp-ui-container-shape-docked: 8px;
}`;

const THEME_JS = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/theme-crane.css";
import "@pglejzer/datepicker-ui/main.css";
import "./brand.css";

new DatepickerUI("#date", {
  ui: { theme: "crane", cssClass: "brand" },
}).create();`;

const CORE_JS = `import DatepickerUI from "@pglejzer/datepicker-ui";
import "@pglejzer/datepicker-ui/main.css";
import "./brand.css";

new DatepickerUI("#date", { ui: { cssClass: "brand" } }).create();`;

const TOKEN_ROWS = [
  {
    layer: "System tokens",
    pattern: "--dp-ui-sys-color-*, --dp-ui-sys-shape-corner-*, --dp-ui-sys-typescale-*",
    use: "Recolor, reshape or retype everything that reads them.",
  },
  {
    layer: "Component tokens",
    pattern: "--dp-ui-container-*, --dp-ui-date-*, --dp-ui-text-field-*, --dp-ui-focus-ring-*",
    use: "Change one part, or one size, without touching the rest.",
  },
  {
    layer: "Classes",
    pattern: ".dp-ui__date-indicator, .dp-ui__text-button--confirm",
    use: "Set properties that have no token, such as a cell radius.",
  },
];

const RELATED = [
  { href: "/datepicker/docs/themes", title: "Date picker themes" },
  { href: "/datepicker/api/css-variables", title: "CSS variables" },
  { href: "/datepicker/api/css-classes", title: "CSS classes" },
  { href: "/datepicker/examples/advanced/custom-styling", title: "Custom styling example" },
  { href: "/datepicker/examples/themes/custom-theme", title: "Custom theme example" },
];

export default function DatepickerStylingPage() {
  return (
    <div>
      <PageHeader
        title="Date Picker Custom Styling"
        description="Restyle @pglejzer/datepicker-ui, the companion of timepicker-ui, with --dp-ui-* CSS variables, dp-ui__* classes and ui.cssClass."
      />

      <Section title="How styling works">
        <p>
          The picker is plain CSS. Colors, sizes, corners and type come from <code>--dp-ui-*</code> custom
          properties, and every part has a <code>dp-ui__*</code> class. <code>ui.cssClass</code> adds your own class
          to the surface root, so you can set variables or write rules for one picker.
        </p>
        <ApiTable
          rowKey="layer"
          columns={[
            { key: "layer", label: "Layer" },
            { key: "pattern", label: "Examples", mono: true },
            { key: "use", label: "Use it to" },
          ]}
          rows={TOKEN_ROWS}
        />
        <p>
          The system tokens follow the Material Design 3 roles and are set with <code>light-dark()</code>. Component
          tokens derive from them, so changing <code>--dp-ui-sys-color-primary</code> also recolors the selected
          day, the today outline, the focus ring and the text buttons.
        </p>
        <div className={styles.scope}>
          <DatepickerExample label="guide" options={GUIDE_DEMO} code={GUIDE_JS} />
        </div>
        <CodeBlock code={GUIDE_CSS} language="css" filename="guide.css" />
      </Section>

      <Section title="Tokens or classes">
        <p>
          Start with tokens. They survive library updates better than selectors, and they follow light and dark
          for free when you write them with <code>light-dark()</code>. A component token set on your class wins over
          the value derived from a system token:
        </p>
        <CodeBlock code={TOKEN_CODE} language="css" />
        <p>
          Use a class rule only for a property with no token. Write the selector with your class first, so it is
          more specific than the library rule:
        </p>
        <CodeBlock code={CLASS_CODE} language="css" />
        <p>
          The full lists are on the <Link href="/datepicker/api/css-variables">CSS Variables</Link> and{" "}
          <Link href="/datepicker/api/css-classes">CSS Classes</Link> pages.
        </p>
      </Section>

      <Section title="Where to set a variable">
        <p>
          The picker declares every token again on the host, on the modal <code>&lt;dialog&gt;</code> and on each
          docked or inline container. A value set higher up is replaced by the default on those elements:
        </p>
        <CodeBlock code={WRONG_CSS} language="css" />
        <Callout tone="warning" title="Set tokens on the cssClass element">
          Set them on the class you pass in <code>ui.cssClass</code>. The picker adds it to the surface root, which
          is the <code>.dp-ui__container</code> element for a docked or inline picker and the{" "}
          <code>&lt;dialog&gt;</code> for a modal.
        </Callout>
      </Section>

      <Section title="Scope one picker">
        <p>
          A class only reaches the pickers that receive it. Give each picker its own name and the rules stay apart:
        </p>
        <CodeBlock code={SCOPE_CODE} language="typescript" />
        <p>
          To limit a class to one part of the page, put an ancestor selector in front of it:
        </p>
        <CodeBlock code={PAGE_SCOPE_CSS} language="css" />
        <p>
          This needs the picker inside that ancestor. A docked popover stays where the host is in the DOM. The
          modal dialog is appended to the host unless you set <code>ui.appendTo</code>, so with{" "}
          <code>appendTo: document.body</code> an ancestor selector no longer matches and the class alone has to
          carry the rules.
        </p>
      </Section>

      <Section title="Docked popover and modal dialog">
        <p>
          A docked or inline picker is a <code>.dp-ui__container</code>. A modal is a{" "}
          <code>&lt;dialog class=&quot;dp-ui__dialog&quot;&gt;</code>, and the container sits inside it.{" "}
          <code>ui.cssClass</code> lands on whichever one is the root. Name both in the selector, so one rule works
          in every display mode:
        </p>
        <CodeBlock code={MODAL_CSS} language="css" />
        <Callout title="displayMode auto">
          With <code>ui.displayMode: &quot;auto&quot;</code> the same picker is a modal on a narrow or short screen
          and docked on a wide one. A rule for only <code>.dp-ui__container</code> would style one and miss the
          other.
        </Callout>
        <p>
          Inside a CSS Module, a bare <code>:global(.brand)</code> fails the purity check. Keep one local class in
          the selector, for example <code>.scope :global(:is(.dp-ui__container, .dp-ui__dialog).brand)</code>.
        </p>
      </Section>

      <Section title="Dark mode and colorScheme">
        <p>
          The system colors use <code>light-dark()</code>, which reads the <code>color-scheme</code> of the element.
          The picker sets it from <code>ui.colorScheme</code>, and <code>&quot;auto&quot;</code> detects it when the
          picker opens. Write each color as a pair and your style follows the scheme:
        </p>
        <CodeBlock code={SCHEME_CSS} language="css" />
        <p>
          If your design has one fixed look, force the scheme and use plain values. The scheme then also decides
          the native parts of the page, such as scrollbars:
        </p>
        <CodeBlock code={SCHEME_JS} language="typescript" />
        <p>
          See <Link href="/datepicker/docs/themes#color-scheme">Color scheme</Link> for how <code>auto</code>{" "}
          picks.
        </p>
      </Section>

      <Section title="Start from a built-in theme or from main.css">
        <p>
          <code>main.css</code> holds the core and the <code>basic</code> theme. It is the smallest base and the
          best choice for a fully custom look:
        </p>
        <CodeBlock code={CORE_JS} language="typescript" />
        <p>
          To adjust a built-in theme instead, load its file and add your class with <code>ui.cssClass</code>. A
          theme sets its values on <code>[data-theme]</code>, which is more specific than a bare class. Add{" "}
          <code>[data-theme]</code> to your selector so your values win:
        </p>
        <CodeBlock code={THEME_CSS} language="css" filename="brand.css" />
        <CodeBlock code={THEME_JS} language="typescript" />
        <p>
          Only <code>basic</code> and <code>blueprint</code> follow <code>ui.colorScheme</code>. The other themes
          keep their own scheme, so a <code>light-dark()</code> pair will resolve to one side. See the{" "}
          <Link href="/datepicker/docs/themes">Themes</Link> page for the list.
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
