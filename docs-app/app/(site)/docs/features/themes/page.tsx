import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Palette, Sparkles, Moon, Zap } from "lucide-react";

export const metadata = {
  title: "Themes",
  description:
    "12 built-in themes for timepicker-ui - Basic, Crane, Material 2/3, Dark, Glassmorphic, Pastel, AI, Cyberpunk and the new Blueprint pair. Zero-dependency and SSR-safe.",
  alternates: {
    canonical: "/docs/features/themes",
  },
};

type Theme = {
  name: string;
  description: string;
  color: string;
  isNew?: boolean;
};

const themes: Theme[] = [
  {
    name: "basic",
    description: "Default Material Design theme with clean aesthetics",
    color: "from-gray-400 to-gray-600",
  },
  {
    name: "crane",
    description: "Google Crane theme with rounded corners",
    color: "from-pink-400 to-red-400",
  },
  {
    name: "crane-straight",
    description: "Google Crane theme with straight edges and sharp corners",
    color: "from-pink-400 to-red-500",
  },
  {
    name: "m3-green",
    description: "Material Design 3 with green color scheme",
    color: "from-green-400 to-teal-500",
  },
  {
    name: "m2",
    description: "Material Design 2 classic theme",
    color: "from-purple-400 to-blue-500",
  },
  {
    name: "dark",
    description: "Dark mode theme with high contrast",
    color: "from-gray-700 to-gray-900",
  },
  {
    name: "glassmorphic",
    description: "Modern glass effect with blur and transparency",
    color: "from-blue-200 to-purple-300",
  },
  {
    name: "pastel",
    description: "Soft pastel colors for gentle aesthetics",
    color: "from-pink-200 to-purple-200",
  },
  {
    name: "ai",
    description: "Futuristic AI-inspired theme with gradients",
    color: "from-cyan-400 to-blue-600",
  },
  {
    name: "cyberpunk",
    description: "Neon cyberpunk aesthetic with vibrant colors",
    color: "from-fuchsia-500 to-cyan-500",
  },
  {
    name: "blueprint",
    description:
      "Light precision-instrument look - vivid cobalt accent, white surfaces and hairline borders",
    color: "from-blue-500 to-indigo-600",
    isNew: true,
  },
  {
    name: "blueprint-dark",
    description:
      "Dark sibling of Blueprint - brighter cobalt on near-black surfaces with hairline borders",
    color: "from-blue-600 to-slate-900",
    isNew: true,
  },
];

export default function ThemesPage() {
  return (
    <div>
      <PageHeader
        title="Themes"
        description="Choose from 12 beautiful built-in themes or create your own"
        eyebrow="Feature"
      />

      <Section icon={Palette} title="Available Themes">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <div
              key={theme.name}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className={`h-24 bg-gradient-to-br ${theme.color}`} />
              <div className="p-5">
                <h3 className="font-bold mb-2 text-foreground flex items-center gap-2">
                  <code className="text-primary">{theme.name}</code>
                  {theme.isNew && (
                    <span className="inline-flex items-center rounded-full border border-[hsl(var(--ok)/0.25)] bg-[hsl(var(--ok)/0.06)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--ok))]">
                      New in v4.4.0
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Sparkles} title="Using Themes">
        <p className="text-muted-foreground mb-4">
          Apply a theme by setting the{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">
            theme
          </code>{" "}
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

      <Section icon={Moon} title="Import Theme Styles">
        <p className="text-muted-foreground mb-4">
          Import only the theme you need to reduce bundle size:
        </p>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Option 1: All themes (largest)
            </h3>
            <CodeBlock
              code={`import 'timepicker-ui/index.css';`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Option 2: Base + specific theme (recommended)
            </h3>
            <CodeBlock
              code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-cyberpunk.css';`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Option 3: Only base (basic theme only)
            </h3>
            <CodeBlock
              code={`import 'timepicker-ui/main.css';`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <Section icon={Zap} title="Dynamic Theme Switching">
        <p className="text-muted-foreground mb-4">
          Change themes at runtime using the update method:
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
picker.update({
  options: { ui: { theme: 'dark' } },
  create: true
});

// Switch to cyberpunk theme
picker.update({
  options: { ui: { theme: 'cyberpunk' } },
  create: true
});`}
          language="typescript"
        />
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Theme Examples
        </h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Material Design 3
            </h3>
            <CodeBlock
              code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-m3.css';

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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">Glassmorphic</h3>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">Cyberpunk</h3>
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
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
              Blueprint
              <span className="inline-flex items-center rounded-full border border-[hsl(var(--ok)/0.25)] bg-[hsl(var(--ok)/0.06)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[hsl(var(--ok))]">
                New in v4.4.0
              </span>
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              A precision-instrument look with a vivid cobalt accent and
              hairline borders. Use <code>blueprint</code> for light surfaces or{" "}
              <code>blueprint-dark</code> for the near-black dark sibling.
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
          </div>
        </div>
      </section>

      <LinkCard
        icon={Palette}
        title="Custom Themes"
        description="You can create custom themes by overriding CSS variables or creating your own theme file. Check the documentation for detailed instructions on custom styling."
        linkText="Learn about custom styling"
        linkHref="/docs/advanced/styling"
        variant="purple"
      />
    </div>
  );
}
