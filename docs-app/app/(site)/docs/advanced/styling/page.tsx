import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Callout } from "@/components/callout";
import { Anatomy } from "@/components/anatomy";
import { Section } from "@/components/section";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Custom Styling",
  description:
    "Customize timepicker-ui with CSS variables and the tp-ui class contract - colors, sizing and themes. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/docs/advanced/styling",
});

export default function StylingPage() {
  return (
    <div>
      <PageHeader
        title="Custom Styling"
        description="Customize the timepicker appearance to match your brand"
      />

      <Anatomy
        notes={[
          { selector: ".tp-ui-select-time", side: "left", code: ".tp-ui-select-time", text: "Header label." },
          { selector: ".tp-ui-hour", side: "left", code: ".tp-ui-hour", text: "Hour field." },
          { selector: ".tp-ui-clock-face", side: "left", code: ".tp-ui-clock-face", text: "Clock face with the hour and minute tips." },
          { selector: ".tp-ui-footer", side: "left", code: ".tp-ui-footer", text: "Footer with the buttons." },
          { selector: ".tp-ui-wrapper", side: "right", code: ".tp-ui-wrapper", text: "The picker's root element." },
          { selector: ".tp-ui-type-mode, .tp-ui-am", side: "right", code: ".tp-ui-type-mode", text: "AM/PM switch in 12-hour mode." },
          { selector: ".tp-ui-minutes", side: "right", code: ".tp-ui-minutes", text: "Minute field." },
          { selector: ".tp-ui-clock-hand", side: "right", code: ".tp-ui-clock-hand", text: "Clock hand." },
        ]}
        options={{ ui: { inline: { enabled: true, showButtons: true } } }}
        caption="Classes you can target in your own CSS."
      />

      <Section title="CSS Variables">
        <p>
          Timepicker-UI uses CSS custom properties (variables) for easy
          customization. Override these variables to change colors and styles:
        </p>
        <h3>Color and Shape Tokens</h3>
        <p>
          Defaults of the <code>basic</code> theme. Each built-in theme
          sets its own values.
        </p>
        <CodeBlock
          code={`:root {
  /* Surfaces */
  --tp-bg: #ece6ee;
  --tp-surface: #e6e0e9;
  --tp-surface-hover: #c8b3fd;
  --tp-input-bg: #e6e0e9;

  /* Text */
  --tp-text: #1d1b20;
  --tp-text-secondary: #49454f;
  --tp-text-disabled: rgba(156, 155, 155, 0.6);
  --tp-text-type-time: #49454f;
  --tp-text-icon: #4e545a;

  /* Primary and containers (Material Design 3 roles) */
  --tp-primary: #6750a4;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #eaddff;
  --tp-on-primary-container: #21005d;

  /* AM/PM */
  --tp-am-pm-active: #ffd8e4;
  --tp-am-pm-text-selected: #633b48;
  --tp-am-pm-text-unselected: #49454f;

  /* Borders and shape */
  --tp-border: #000;
  --tp-outline: #6750a4;
  --tp-shadow: unset;
  --tp-border-radius: 28px;

  /* Font (see "Font" below) */
  /* --tp-font-family: not set, falls back to 'Roboto', sans-serif */

  /* Focus ring (see "Focus Ring" below) */
  /* --tp-focus-ring: not set, falls back to --tp-primary */
  /* --tp-shadow-focus-ring: not set, defaults to none */

  /* Timezone dropdown */
  --tp-dropdown-option-bg: #ffffff;
  --tp-dropdown-option-text: #000000;
  /* --tp-dropdown-option-hover-text: not set, falls back to
     --tp-dropdown-option-text. Text color of a hovered or
     keyboard-focused option. */
}`}
          language="css"
        />
        <p>
          Themes other than <code>basic</code> set their values on{" "}
          <code>.tp-ui-modal[data-theme]</code>, which wins over{" "}
          <code>:root</code>. To override a token for every theme, set it
          on <code>.tp-ui-wrapper</code>. For one picker, use the class you
          pass in <code>ui.cssClass</code> (
          <code>.tp-ui-wrapper.my-theme</code>).
        </p>
        <Callout title="Tokens that do nothing" tone="warning">
          <p>
            No rule reads <code>--tp-tertiary-container</code>,{" "}
            <code>--tp-on-tertiary-container</code>,{" "}
            <code>--tp-hover-bg</code> or <code>--tp-radius</code>. Setting
            them changes nothing, and 5.0 removes them.
          </p>
        </Callout>

        <h3>Font</h3>
        <p>
          To change the font, set <code>--tp-font-family</code>.{" "}
          <code>.tp-ui-wrapper</code> reads it with{" "}
          <code>font-family: var(--tp-font-family, &apos;Roboto&apos;, sans-serif)</code>
          , and the time fields and buttons in the modal inherit it. Set
          the variable on <code>:root</code> or <code>.tp-ui-modal</code>{" "}
          for every picker, or on the class you pass in{" "}
          <code>ui.cssClass</code> for one picker. The picker adds that
          class to <code>.tp-ui-wrapper</code>.
        </p>
        <CodeBlock
          code={`/* ui: { cssClass: 'my-theme' } */
.tp-ui-wrapper.my-theme {
  --tp-font-family: 'Inter', system-ui, sans-serif;
}`}
          language="css"
        />
        <p>
          Setting <code>font-family</code> directly on{" "}
          <code>.tp-ui-wrapper.my-theme</code> also works.
        </p>

        <h3>Seconds Sizes</h3>
        <p>
          Used when <code>clock.showSeconds</code> is on, so three fields
          fit in the header, the wheel and the range tabs.
        </p>
        <CodeBlock
          code={`:root {
  /* Header fields, 12h */
  --tp-size-input-seconds-12h: 64px;
  --tp-size-input-seconds-12h-narrow: 58px; /* screens 330px wide or less */
  --tp-size-colon-seconds-12h: 12px;
  --tp-font-size-seconds-12h: 36px;

  /* Header fields, 24h */
  --tp-size-input-seconds-24h: 80px;
  --tp-size-input-seconds-24h-narrow: 74px; /* 330px or less, and landscape up to 480px tall */
  --tp-size-colon-seconds-24h: 20px;
  --tp-font-size-seconds-24h: 44px;

  /* Wheel and range tabs */
  --tp-wheel-column-width-seconds: 64px;
  --tp-wheel-separator-width-seconds: 16px;
  --tp-range-tab-value-font-size-seconds: 14px;
}`}
          language="css"
        />

        <h3>Keyboard View in Landscape</h3>
        <p>
          Size of the keyboard input view on landscape screens up to 480px
          tall.
        </p>
        <CodeBlock
          code={`:root {
  --tp-mobile-landscape-width: 328px;
  --tp-mobile-landscape-height: 258px;
  --tp-mobile-landscape-height-range: 287px;    /* range plugin */
  --tp-mobile-landscape-height-timezone: 326px; /* timezone selector */
}`}
          language="css"
        />

        <h3>Compact-Wheel Popover</h3>
        <p>
          Used when <code>compact-wheel</code> opens as a popover next to
          the input (<code>wheel.placement</code> is set). The popover is
          at least as wide as the input and <code>--tp-popover-min-width</code>,
          at most <code>--tp-popover-max-width</code>, and never closer to
          the viewport edge than <code>--tp-popover-edge-margin</code>.
        </p>
        <CodeBlock
          code={`:root {
  --tp-popover-gap: 4px;          /* space between the input and the popover */
  --tp-popover-edge-margin: 4px;  /* smallest space to the viewport edge */
  --tp-popover-min-width: 260px;
  --tp-popover-max-width: 328px;
  --tp-popover-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  /* --tp-popover-radius: not set, falls back to --tp-border-radius */
}`}
          language="css"
        />
        <p>
          The gap, edge margin and widths are read from{" "}
          <code>.tp-ui-modal</code>, so set them on <code>:root</code> or{" "}
          <code>.tp-ui-modal</code>, not on <code>.tp-ui-wrapper</code>.
          Any CSS length works, for example <code>px</code>,{" "}
          <code>rem</code> or <code>calc()</code>.
        </p>

        <h3>Scrollbar Gap</h3>
        <p>
          <code>--tp-scrollbar-gap</code> is set by the picker, not by you.
          While a picker locks page scroll (
          <code>ui.allowPageScroll: false</code>, the default), it is set
          on <code>&lt;html&gt;</code> to the width of the removed
          scrollbar, or <code>0px</code> when there was none. Read it in
          your own CSS to keep fixed elements in place. See{" "}
          <Link href="/docs/configuration#scroll-lock">
            Scroll lock and fixed headers
          </Link>
          .
        </p>
      </Section>

      <Section title="Focus Ring">
        <p>
          Keyboard focus shows one 3px ring in <code>--tp-focus-ring</code>, 2px
          outside the control. When <code>--tp-focus-ring</code> is not set, the
          ring uses <code>--tp-primary</code>. The width and offset come from{" "}
          <code>--tp-outline-width-thick</code> and{" "}
          <code>--tp-outline-offset</code>.
        </p>
        <ul>
          <li>
            AM/PM and the time fields draw the ring inside their edge. On the
            selected field it uses <code>--tp-on-primary-container</code>, on
            the selected AM/PM button <code>--tp-am-pm-text-selected</code>.
          </li>
          <li>
            Range tabs and wheel columns use the same 3px ring. Only the
            keyboard-focused timezone option gets a thinner 2px ring inside its
            edge, set by <code>--tp-outline-width</code>.
          </li>
          <li>
            With <code>prefers-contrast: more</code> the ring is 4px. In
            forced-colors mode it uses the system <code>Highlight</code> color.
          </li>
          <li>
            <code>--tp-shadow-focus-ring</code> adds a{" "}
            <code>box-shadow</code> to the ring. It defaults to{" "}
            <code>none</code>.
          </li>
          <li>
            There is no <code>--tp-focus-ring-halo</code> token any more.
            Setting it has no effect.
          </li>
        </ul>
        <CodeBlock
          code={`.tp-ui-wrapper.my-theme {
  --tp-focus-ring: #0b57d0;

  /* Optional, off by default */
  --tp-shadow-focus-ring: 0 0 0 6px rgba(11, 87, 208, 0.25);
}`}
          language="css"
        />
      </Section>

      <Section title="Creating Custom Themes">
        <p>
          Timepicker-UI comes with several built-in themes:
        </p>
        <h3>Available Themes</h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

// Material Design 2 theme (purple/magenta)
const picker1 = new TimepickerUI(input1, { ui: { theme: 'm2' } });

// Material Design 3 theme (green)
const picker2 = new TimepickerUI(input2, { ui: { theme: 'm3-green' } });

// Dark theme
const picker3 = new TimepickerUI(input3, { ui: { theme: 'dark' } });

// Crane theme with rounded corners
const picker4 = new TimepickerUI(input4, { ui: { theme: 'crane' } });

// Crane-straight theme (sharp edges)
const picker5 = new TimepickerUI(input5, { ui: { theme: 'crane-straight' } });`}
          language="typescript"
        />

        <p>
          To make your own theme, give the picker a class with{" "}
          <code>ui.cssClass</code> and set the CSS
          variables under <code>.tp-ui-wrapper.your-class</code>. The picker
          adds the class to its <code>.tp-ui-wrapper</code> when it opens.{" "}
          <code>ui.theme</code> accepts only the 12 built-in names.
        </p>
        <h3>Custom Theme Example</h3>
        <CodeBlock
          code={`.tp-ui-wrapper.my-theme {
  --tp-bg: #ffffff;
  --tp-text: #000000;
  --tp-primary: #6200ee;
  --tp-on-primary: #ffffff;
  --tp-surface: #e0e0e0;
  --tp-surface-hover: #ece0fd;
  --tp-input-bg: #e4e4e4;
  --tp-border: #d6d6d6;
  --tp-text-secondary: #a9a9a9;
  --tp-text-type-time: #787878;
  --tp-text-icon: #4e545a;
  --tp-text-disabled: rgba(156, 155, 155, 0.6);
  --tp-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.25);
  --tp-border-radius: 4px;
}`}
          language="css"
        />

        <h3>Using Your Custom Theme</h3>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const picker = new TimepickerUI('#timepicker', {
  ui: { cssClass: 'my-theme' }
});

picker.create();`}
          language="typescript"
        />
        <p>
          You can also start from a built-in theme:{" "}
          <code>{"ui: { theme: 'dark', cssClass: 'my-theme' }"}</code>. Your
          values win because the wrapper sits inside the themed modal.
        </p>

        <h3>Switching Themes at Runtime</h3>
        <p>
          There is no <code>setTheme()</code> method. Change{" "}
          <code>ui.theme</code> or <code>ui.cssClass</code> with{" "}
          <code>setOptions()</code>. The picker builds its modal when it opens,
          so the new theme shows the next time it opens. A picker that is
          open re-renders right away. Load the CSS file of every theme you
          switch to.
        </p>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-dark.css';

const picker = new TimepickerUI('#timepicker', {
  ui: { theme: 'basic' }
});

picker.create();

picker.setOptions({ ui: { theme: 'dark' } });`}
          language="typescript"
        />
      </Section>

      <Section title="Material Design 3 Ripple Effect">
        <p>
          Pressing a control shows a ripple that grows from the press point.
          Hover, keyboard focus and press also show a state layer, a faint
          overlay in the control&apos;s text color. Keyboard activation does not
          start a ripple. With <code>prefers-reduced-motion</code>, a press
          shows only the pressed layer, without the ripple.
        </p>

        <h3>Where It Applies</h3>
        <ul>
          <li>OK, Cancel and Clear buttons</li>
          <li>AM/PM buttons</li>
          <li>Hour, minute and second fields</li>
          <li>The view-switch icon</li>
          <li>Range tabs (range plugin) and the timezone trigger (timezone plugin)</li>
        </ul>

        <h3>Customizing the Ripple</h3>
        <p>
          Controls with the effect carry the{" "}
          <code>data-md3-ripple</code> attribute.
          Their <code>::before</code> is the state layer and{" "}
          <code>::after</code> is the ripple. Both use the control&apos;s text
          color (<code>currentColor</code>). On the selected time field that
          is <code>--tp-on-primary-container</code>. Strength and timing come
          from these tokens (defaults shown):
        </p>
        <CodeBlock
          code={`.tp-ui-wrapper.my-theme {
  --tp-state-hover-opacity: 0.08;
  --tp-state-focus-opacity: 0.1;
  --tp-state-pressed-opacity: 0.1;
  --tp-ripple-opacity: 1; /* multiplies the pressed opacity for the ripple */
  --tp-duration-ripple: 700ms;
  --tp-duration-ripple-fade: 500ms;
}

/* Turn the ripple off and keep the state layers */
.tp-ui-wrapper.no-ripple {
  --tp-ripple-opacity: 0;
}`}
          language="css"
        />
      </Section>

      <Section id="complete-custom-theme" title="Complete Custom Theme Example">
        <p>
          Here&apos;s a complete example of a custom purple theme:
        </p>
        <CodeBlock
          filename="theme-purple.css"
          code={`.tp-ui-wrapper.purple {
  --tp-bg: #faf5ff;
  --tp-text: #1e1b4b;
  --tp-primary: #8b5cf6;
  --tp-on-primary: #ffffff;
  --tp-surface: #ede9fe;
  --tp-surface-hover: #ddd6fe;
  --tp-input-bg: #f3e8ff;
  --tp-border: #c4b5fd;
  --tp-text-secondary: #7c3aed;
  --tp-text-type-time: #6d28d9;
  --tp-text-icon: #7c3aed;
  --tp-text-disabled: #a78bfa;
  --tp-shadow: 0 10px 35px 0 rgba(139, 92, 246, 0.3);
  --tp-border-radius: 16px;
  --tp-font-family: 'Inter', system-ui, sans-serif;
}`}
          language="css"
        />
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';
import './theme-purple.css';

const picker = new TimepickerUI('#timepicker', {
  ui: { cssClass: 'purple' }
});

picker.create();`}
          language="typescript"
        />
      </Section>

      <dl>
        <div>
          <dt>Browser Compatibility</dt>
          <dd>
            CSS custom properties are supported in all modern browsers. For
            older browsers, provide fallback values or use a PostCSS plugin to
            generate static CSS. Test your custom themes across different
            browsers to ensure consistent appearance.
          </dd>
          <dd>
            <Link href="/docs/features/themes">View built-in themes</Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
