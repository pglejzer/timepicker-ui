import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { ApiTable } from "@/components/api-table";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Themes",
  description:
    "12 built-in themes for timepicker-ui - Basic, Crane, Crane Straight, Material 2/3, Dark, Glassmorphic, Pastel, AI, Cyberpunk, Blueprint and Blueprint Dark.",
  path: "/docs/features/themes",
});

type Theme = {
  name: string;
  description: string;
  isNew?: boolean;
};

const themes: Theme[] = [
  {
    name: "basic",
    description: "Default Material Design theme with clean aesthetics",
  },
  {
    name: "crane",
    description: "Google Crane theme with rounded corners",
  },
  {
    name: "crane-straight",
    description: "Google Crane theme with straight edges and sharp corners",
  },
  {
    name: "m3-green",
    description: "Material Design 3 with green color scheme",
  },
  {
    name: "m2",
    description: "Material Design 2 classic theme",
  },
  {
    name: "dark",
    description: "Dark mode theme with high contrast",
  },
  {
    name: "glassmorphic",
    description: "Modern glass effect with blur and transparency",
  },
  {
    name: "pastel",
    description: "Soft pastel colors for gentle aesthetics",
  },
  {
    name: "ai",
    description: "AI-inspired theme with light gray surfaces and a solid blue accent",
  },
  {
    name: "cyberpunk",
    description: "Neon cyan accents and a cyan glow on dark indigo surfaces",
  },
  {
    name: "blueprint",
    description:
      "Light precision-instrument look - vivid cobalt accent, pale blue surfaces and hairline borders",
    isNew: true,
  },
  {
    name: "blueprint-dark",
    description:
      "Dark sibling of Blueprint - brighter cobalt on navy surfaces with hairline borders",
    isNew: true,
  },
];

const darkTokens: [string, string, string][] = [
  ["--tp-bg", "#1c1b1f", "#2b2930"],
  ["--tp-surface, --tp-input-bg", "#2c2b30", "#36343b"],
  ["--tp-surface-hover, --tp-hover-bg", "#3b3940", "#444249"],
  ["--tp-surface-container", "unset (light #f3edf7)", "#211f26"],
  ["--tp-text, --tp-on-surface", "#e5e5e5", "#e6e0e9"],
  ["--tp-on-surface-rgb", "229, 229, 229", "230, 224, 233"],
  [
    "--tp-text-secondary, --tp-text-type-time, --tp-text-icon, --tp-am-pm-text-unselected",
    "#a1a1a1",
    "#cac4d0",
  ],
  ["--tp-on-surface-variant", "unset (light #49454f)", "#cac4d0"],
  ["--tp-text-disabled", "rgba(161, 161, 161, 0.6)", "rgba(230, 224, 233, 0.38)"],
  ["--tp-primary, --tp-outline", "#bb86fc, #d8b4fe", "#d0bcff"],
  ["--tp-primary-rgb", "unset (light 103, 80, 164)", "208, 188, 255"],
  ["--tp-on-primary", "#000000", "#381e72"],
  ["--tp-primary-container", "var(--tp-primary)", "#4f378b"],
  ["--tp-on-primary-container", "#000000", "#eaddff"],
  ["--tp-tertiary-container, --tp-am-pm-active", "var(--tp-primary)", "#633b48"],
  ["--tp-on-tertiary-container, --tp-am-pm-text-selected", "#000000", "#ffd8e4"],
  ["--tp-outline-variant", "unset (light #cac4d0)", "#49454f"],
  ["--tp-border", "rgba(255, 255, 255, 0.12)", "#49454f"],
  ["--tp-dropdown-option-bg", "#2c2b30", "#2b2930"],
  ["--tp-dropdown-option-text", "#e5e5e5", "#e6e0e9"],
  ["--tp-error", "#ff6b6b", "#f2b8b5"],
  ["--tp-wheel-highlight-bg", "rgba(187, 134, 252, 0.12)", "#4f378b"],
  ["--tp-wheel-highlight-border", "rgba(255, 255, 255, 0.12)", "#49454f"],
  ["--tp-wheel-text-color", "#e5e5e5", "#e6e0e9"],
  ["--tp-wheel-selected-color", "#bb86fc", "#eaddff"],
];

const DARK_OLD_LOOK = `[data-theme='dark'] {
  --tp-bg: #1c1b1f;
  --tp-surface: #2c2b30;
  --tp-input-bg: #2c2b30;
  --tp-surface-hover: #3b3940;
  --tp-hover-bg: #3b3940;
  --tp-surface-container: #f3edf7;

  --tp-text: #e5e5e5;
  --tp-on-surface: #e5e5e5;
  --tp-on-surface-rgb: 229, 229, 229;
  --tp-text-secondary: #a1a1a1;
  --tp-text-type-time: #a1a1a1;
  --tp-text-icon: #a1a1a1;
  --tp-am-pm-text-unselected: #a1a1a1;
  --tp-on-surface-variant: #49454f;
  --tp-text-disabled: rgba(161, 161, 161, 0.6);

  --tp-primary: #bb86fc;
  --tp-outline: #d8b4fe;
  --tp-primary-rgb: 103, 80, 164;
  --tp-on-primary: #000000;
  --tp-primary-container: var(--tp-primary);
  --tp-on-primary-container: #000000;
  --tp-tertiary-container: var(--tp-primary);
  --tp-am-pm-active: var(--tp-primary);
  --tp-on-tertiary-container: #000000;
  --tp-am-pm-text-selected: #000000;

  --tp-outline-variant: #cac4d0;
  --tp-border: rgba(255, 255, 255, 0.12);
  --tp-dropdown-option-bg: #2c2b30;
  --tp-dropdown-option-text: #e5e5e5;
  --tp-error: #ff6b6b;

  --tp-wheel-highlight-bg: rgba(187, 134, 252, 0.12);
  --tp-wheel-highlight-border: rgba(255, 255, 255, 0.12);
  --tp-wheel-text-color: #e5e5e5;
  --tp-wheel-selected-color: #bb86fc;
}`;

export default function ThemesPage() {
  return (
    <div>
      <PageHeader
        title="Themes"
        description="12 built-in themes, or your own through CSS variables"
      />

      <Section title="Available Themes">
        <dl>
          {themes.map((theme) => (
            <div key={theme.name}>
              <dt>
                <code>{theme.name}</code>
                {theme.isNew && (
                  <>
                    {" "}
                    <em>New in v4.4.0</em>
                  </>
                )}
              </dt>
              <dd>{theme.description}</dd>
            </div>
          ))}
        </dl>
        <Callout title="Crane and contrast" tone="warning">
          <p>
            In <code>crane</code> and <code>crane-straight</code> the keyboard
            focus ring uses the theme&apos;s coral <code>--tp-outline</code>.
          </p>
          <p>
            Known exception: the Crane red on plum is below the 3:1 non-text
            contrast of WCAG 1.4.11 for the selected clock tip circle and the
            selected AM/PM fill. The white text on them meets AA.
          </p>
        </Callout>
      </Section>

      <Section title="The dark theme in 4.7.0">
        <p>
          The <code>dark</code> theme now uses the Material 3 baseline dark
          palette, so it matches the <code>basic</code> theme and the other M3
          themes. Before, it was toned like Material 2. The card is lighter
          (surface <code>#2b2930</code>), the accent is{" "}
          <code>#d0bcff</code>, and the selected hour and the AM / PM button
          use tonal containers instead of a solid purple fill. No option,
          class or file name changed. The tokens that were unset now have dark
          values, where they used to fall back to the light ones.
        </p>
        <ApiTable
          columns={[
            { key: "token", label: "Token", mono: true },
            { key: "before", label: "Before 4.7.0", mono: true },
            { key: "after", label: "4.7.0", mono: true },
          ]}
          rows={darkTokens.map(([token, before, after]) => ({
            id: token,
            token,
            before,
            after,
          }))}
          rowKey="id"
        />
        <h3>Keep the old look</h3>
        <p>
          Set the old values on <code>[data-theme=&apos;dark&apos;]</code>{" "}
          after the theme stylesheet. The four tokens that were unset in the
          old theme took these values from the light defaults.
        </p>
        <CodeBlock code={DARK_OLD_LOOK} language="css" />
      </Section>

      <Section title="Using Themes">
        <p>
          Apply a theme by setting the{" "}
          <code>theme</code>{" "}
          option:
        </p>
        <CodeBlock
          code={`const picker = new TimepickerUI(input, {
  ui: {
    theme: 'cyberpunk'
  }
});
picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="Import Theme Styles">
        <p>
          Import only the theme you need to reduce bundle size:
        </p>
        <h3>Option 1: All themes (largest)</h3>
        <CodeBlock
          code={`import 'timepicker-ui/index.css';`}
          language="typescript"
        />

        <h3>Option 2: Base + specific theme (recommended)</h3>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-cyberpunk.css';`}
          language="typescript"
        />

        <h3>Option 3: Only base (basic theme only)</h3>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';`}
          language="typescript"
        />
      </Section>

      <Section title="Dynamic Theme Switching">
        <p>
          Change themes at runtime with <code>setOptions()</code>:
        </p>
        <CodeBlock
          code={`// Initialize with basic theme
const picker = new TimepickerUI(input, {
  ui: {
    theme: 'basic'
  }
});
picker.create();

// Switch to dark theme
picker.setOptions({ ui: { theme: 'dark' } });

// Switch to cyberpunk theme
picker.setOptions({ ui: { theme: 'cyberpunk' } });`}
          language="typescript"
        />
      </Section>

      <Section title="Theme Examples">
        <h3>Material Design 3</h3>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-m3-green.css';

const picker = new TimepickerUI(input, {
  ui: {
    theme: 'm3-green',
    animation: true
  },
  clock: {
    type: '12h'
  }
});`}
          language="typescript"
        />

        <h3>Glassmorphic</h3>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-glassmorphic.css';

const picker = new TimepickerUI(input, {
  ui: {
    theme: 'glassmorphic',
    backdrop: true,
    animation: true
  }
});`}
          language="typescript"
        />

        <h3>Cyberpunk</h3>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-cyberpunk.css';

const picker = new TimepickerUI(input, {
  ui: {
    theme: 'cyberpunk',
    animation: true,
    backdrop: true
  },
  clock: {
    type: '24h'
  }
});`}
          language="typescript"
        />

        <h3>
          Blueprint <em>New in v4.4.0</em>
        </h3>
        <p>
          A precision-instrument look with a vivid cobalt accent and
          hairline borders. Use <code>blueprint</code> for light surfaces or{" "}
          <code>blueprint-dark</code> for the navy dark sibling.
        </p>
        <CodeBlock
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-blueprint.css';

const picker = new TimepickerUI(input, {
  ui: {
    theme: 'blueprint',
    animation: true
  }
});

// Dark sibling
// import 'timepicker-ui/theme-blueprint-dark.css';
// ui: { theme: 'blueprint-dark' }`}
          language="typescript"
        />
      </Section>

      <dl>
        <div>
          <dt>Custom Themes</dt>
          <dd>
            You can create custom themes by overriding CSS variables or
            creating your own theme file. Check the documentation for detailed
            instructions on custom styling.
          </dd>
          <dd>
            <Link href="/docs/advanced/styling">Learn about custom styling</Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
