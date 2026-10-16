import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
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
