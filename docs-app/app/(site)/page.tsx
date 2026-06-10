import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Smartphone,
  Timer,
  Disc3,
  Palette,
  Code2,
  Shield,
  Layers,
  Accessibility,
  Globe,
  Languages,
  Lock,
  Settings,
  KeyRound,
} from "lucide-react";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";
import { StarCallout } from "@/components/star-callout";

function BasicExample() {
  return (
    <TimepickerExample
      code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);
picker.create();`}
      options={{}}
      inputPlaceholder="Select time"
      showCode={false}
    />
  );
}

function MobileExample() {
  return (
    <TimepickerExample
      code={`const picker = new TimepickerUI(input, {
  ui: { mobile: true },
});`}
      options={{ ui: { mobile: true, enableSwitchIcon: true } }}
      inputPlaceholder="Select time"
      showCode={false}
    />
  );
}

function RangeExample() {
  return (
    <TimepickerExample
      code={`import { RangePlugin } from 'timepicker-ui/plugins/range';
PluginRegistry.register(RangePlugin);`}
      options={{ range: { enabled: true, minDuration: 30 } }}
      plugins={["range"]}
      inputPlaceholder="Select time range"
      showCode={false}
    />
  );
}

function WheelExample() {
  return (
    <TimepickerExample
      code={`import { WheelPlugin } from 'timepicker-ui/plugins/wheel';
PluginRegistry.register(WheelPlugin);`}
      options={{ ui: { mode: "wheel" } }}
      plugins={["wheel"]}
      inputPlaceholder="Select time"
      showCode={false}
    />
  );
}

const stats = [
  { value: "0", label: "Dependencies" },
  { value: "3", label: "UI Modes" },
  { value: "12", label: "Themes" },
  { value: "SSR", label: "Safe" },
  { value: "TS", label: "Typed" },
];

const features = [
  {
    icon: Clock,
    title: "12h / 24h formats",
    description:
      "Switch clock format at runtime, with AM/PM or 24-hour output.",
  },
  {
    icon: Disc3,
    title: "Three UI modes",
    description:
      "Analog clock, scroll wheel, and compact-wheel - one option to swap.",
  },
  {
    icon: Palette,
    title: "12 built-in themes",
    description:
      "Material 2/3, Crane, Dark, Glassmorphic, Cyberpunk, Pastel, AI, Blueprint.",
  },
  {
    icon: Code2,
    title: "Framework-agnostic",
    description: "Vanilla JS core. Works in React, Vue, Angular, Svelte.",
  },
  {
    icon: Shield,
    title: "TypeScript types",
    description: "Full type definitions and grouped, autocompleted options.",
  },
  {
    icon: Layers,
    title: "Inline mode",
    description: "Render the picker in-page without a modal overlay.",
  },
  {
    icon: Accessibility,
    title: "Keyboard & ARIA",
    description: "Focus trap, arrow-key selection, screen-reader labels.",
  },
  {
    icon: Globe,
    title: "SSR-safe",
    description: "No top-level DOM access. Runs under Next.js and Nuxt.",
  },
  {
    icon: KeyRound,
    title: "Tree-shakeable plugins",
    description: "Range, timezone, and wheel ship only when imported.",
  },
];

const advanced = [
  {
    icon: Lock,
    title: "Disabled time",
    description: "Block specific hours, minutes, or intervals.",
    href: "/docs/features/disabled-time",
  },
  {
    icon: Settings,
    title: "Grouped options",
    description:
      "clock, ui, labels, behavior, callbacks - merged and validated.",
    href: "/docs/api/options",
  },
  {
    icon: Languages,
    title: "Localization",
    description: "Replace every label for any language.",
    href: "/docs/advanced/localization",
  },
  {
    icon: Palette,
    title: "Custom styling",
    description: "Override CSS variables or author a full theme.",
    href: "/docs/advanced/styling",
  },
  {
    icon: Code2,
    title: "Instance registry",
    description: "getById, getAllInstances, destroyAll.",
    href: "/docs/api/methods",
  },
  {
    icon: Timer,
    title: "Events & callbacks",
    description: "Subscribe to selection, confirm, cancel, and clear.",
    href: "/docs/api/events",
  },
];

const liveExamples = [
  {
    icon: Clock,
    title: "Analog clock",
    note: "Default 12-hour",
    component: <BasicExample />,
    badge: null,
  },
  {
    icon: Smartphone,
    title: "Mobile view",
    note: "Touch input",
    component: <MobileExample />,
    badge: null,
  },
  {
    icon: Timer,
    title: "Range plugin",
    note: "Start & end",
    component: <RangeExample />,
    badge: "plugin",
  },
  {
    icon: Disc3,
    title: "Wheel plugin",
    note: "Scroll spinner",
    component: <WheelExample />,
    badge: "plugin",
  },
];

export default function Home() {
  return (
    <main id="main-content" className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bp-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <div className="container mx-auto px-4 py-20 sm:py-28 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="eyebrow reveal">
                Zero-dependency · Framework-agnostic · SSR-safe
              </p>
              <h1
                className="display reveal mt-5 text-5xl font-semibold sm:text-6xl md:text-7xl"
                style={{ animationDelay: "60ms" }}
              >
                Precise time
                <br />
                input, <span className="text-primary">for the web.</span>
              </h1>
              <p
                className="reveal mt-6 max-w-md text-base text-muted-foreground sm:text-lg"
                style={{ animationDelay: "120ms" }}
              >
                A time picker with an analog clock, scroll wheel, and
                compact-wheel modes. 12 themes, full TypeScript types, and
                plugins that tree-shake out when unused.
              </p>

              <div
                className="reveal mt-8 flex flex-wrap items-center gap-3"
                style={{ animationDelay: "180ms" }}
              >
                <Link
                  href="/docs/installation"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/pglejzer/timepicker-ui"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-accent"
                >
                  GitHub
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </div>

              <div className="reveal mt-5" style={{ animationDelay: "240ms" }}>
                <InstallCommand />
              </div>
            </div>

            {/* Live picker panel */}
            <div className="reveal" style={{ animationDelay: "200ms" }}>
              <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <span className="eyebrow">Live</span>
                  <span className="nums text-2xl text-muted-foreground/60">
                    12:30
                  </span>
                </div>
                <div className="tick-row mb-6" />
                <BasicExample />
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    href="/examples"
                    className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    more examples
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link
                    href="/docs/whats-new"
                    className="font-mono text-xs text-primary"
                  >
                    v4.4.0
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-y divide-border px-4 sm:grid-cols-3 md:grid-cols-5 md:divide-y-0 md:px-6">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-8 text-center">
              <div className="nums text-3xl font-semibold sm:text-4xl">
                {s.value}
              </div>
              <div className="eyebrow mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:px-6">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Capabilities</p>
              <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
                What it does
              </h2>
            </div>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              read the docs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group border-b border-r border-border p-6 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <f.icon className="h-5 w-5 text-foreground transition-colors group-hover:text-primary" />
                  <span className="nums text-xs text-muted-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live examples */}
      <section className="border-b border-border bg-muted/20">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:px-6">
          <div className="mb-10">
            <p className="eyebrow">Interactive</p>
            <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
              Try it here
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {liveExamples.map((ex) => (
              <div
                key={ex.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ex.icon className="h-4 w-4 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium">{ex.title}</h3>
                      <p className="font-mono text-xs text-muted-foreground">
                        {ex.note}
                      </p>
                    </div>
                  </div>
                  {ex.badge && (
                    <span className="rounded border border-primary/40 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      {ex.badge}
                    </span>
                  )}
                </div>
                {ex.component}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick integrate */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Setup</p>
              <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
                Three lines to a picker
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Install, import, and call{" "}
                <code className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-sm">
                  create()
                </code>
                . No build step, no wrapper required.
              </p>
              <ul className="mt-7 space-y-3 text-sm">
                {[
                  "npm, yarn, or pnpm",
                  "ESM and CJS builds",
                  "Typed options with autocomplete",
                  "Drop into any existing input",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/docs/quick-start"
                className="mt-8 inline-flex items-center font-mono text-sm text-primary"
              >
                Quick start
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <CodeBlock
              filename="app.ts"
              language="typescript"
              code={`import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/index.css';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  ui: { theme: 'dark' },
});

picker.create();`}
            />
          </div>
        </div>
      </section>

      {/* Advanced */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-16 sm:py-20 md:px-6">
          <div className="mb-10">
            <p className="eyebrow">Going further</p>
            <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
              Built for real apps
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {advanced.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-card p-6 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <f.icon className="h-5 w-5 transition-colors group-hover:text-primary" />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-primary" />
                </div>
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Star call-out */}
      <StarCallout />

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="bp-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <div className="container mx-auto px-4 py-20 text-center sm:py-28 md:px-6">
          <span className="nums text-4xl text-muted-foreground/40">00:00</span>
          <h2 className="display mx-auto mt-4 max-w-2xl text-3xl font-semibold sm:text-5xl">
            Add a time picker in minutes
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/installation"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/examples"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-accent"
            >
              Browse examples
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

