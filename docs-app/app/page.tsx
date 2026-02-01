import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Palette,
  Smartphone,
  Code2,
  Zap,
  Shield,
  Check,
  Sparkles,
  Globe,
  Accessibility,
  Layers,
  Lock,
  Settings,
  Paintbrush,
  Languages,
  Timer,
} from "lucide-react";
import { TimepickerExample } from "@/components/examples/timepicker-example";

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
      code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  ui: { mobile: true },
});
picker.create();`}
      options={{
        ui: { mobile: true, enableSwitchIcon: true },
      }}
      inputPlaceholder="Select time"
      showCode={false}
    />
  );
}

function RangeExample() {
  return (
    <TimepickerExample
      code={`import { TimepickerUI, PluginRegistry } from 'timepicker-ui';
import { RangePlugin } from 'timepicker-ui/plugins/range';

PluginRegistry.register(RangePlugin);

const picker = new TimepickerUI(input, {
  range: { enabled: true, minDuration: 30 },
});`}
      options={{
        range: { enabled: true, minDuration: 30 },
      }}
      plugins={["range"]}
      inputPlaceholder="Select time range"
      showCode={false}
    />
  );
}

const features = [
  {
    icon: Palette,
    title: "10 Built-in Themes",
    description: "Material, Crane, Dark, Glassmorphic, Cyberpunk, AI, and more",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Responsive with touch and keyboard support",
  },
  {
    icon: Code2,
    title: "Framework Agnostic",
    description: "Works with vanilla JS, React, Vue, Angular, and others",
  },
  {
    icon: Shield,
    title: "TypeScript Support",
    description: "Full type definitions and IntelliSense",
  },
  {
    icon: Layers,
    title: "Inline Mode",
    description: "Always-visible timepicker without modal overlay",
  },
  {
    icon: Zap,
    title: "Rich API",
    description: "Comprehensive methods and event system",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description: "ARIA-compliant with keyboard navigation",
  },
  {
    icon: Globe,
    title: "SSR Compatible",
    description: "Works with Next.js, Nuxt, and other SSR frameworks",
  },
  {
    icon: Sparkles,
    title: "Lightweight",
    description: "Minimal footprint with tree-shaking support",
  },
];

const advancedFeatures = [
  {
    icon: Lock,
    title: "Disabled Time Ranges",
    description:
      "Disable specific hours, minutes, or time intervals with flexible configuration",
    href: "/docs/configuration",
  },
  {
    icon: Clock,
    title: "12h/24h Formats",
    description:
      "Support for both 12-hour and 24-hour clock formats with automatic switching",
    href: "/docs/configuration",
  },
  {
    icon: Settings,
    title: "Extensive Configuration",
    description:
      "25+ options to customize behavior, labels, animations, and more",
    href: "/docs/api/options",
  },
  {
    icon: Paintbrush,
    title: "Custom Styling",
    description: "Override CSS variables or create completely custom themes",
    href: "/docs/configuration",
  },
  {
    icon: Languages,
    title: "Localization",
    description: "Customize all labels and text for international applications",
    href: "/docs/configuration",
  },
  {
    icon: Code2,
    title: "Instance Management",
    description:
      "Create multiple pickers with getById(), destroyAll(), and custom IDs",
    href: "/docs/api/methods",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Modern Time Picker for
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Web Applications
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A lightweight, accessible, and highly customizable time picker
              component with beautiful themes and mobile-first design.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <Link
                href="/react"
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <Code2 className="h-4 w-4" />
                <span className="font-medium">React wrapper available</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs/installation"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <Link
              href="/docs/whats-new"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors max-w-2xl mx-auto text-center"
            >
              <Sparkles className="h-4 w-4 flex-shrink-0" />
              <span>
                <span className="font-medium">New:</span> Version 4.1.1 with
                Range Plugin and improved input validation!
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Packed with features to build modern time pickers
            </p>
          </div>
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              See it in action
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Try the timepicker right here with different configurations
            </p>
          </div>
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Basic Example
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Default 12-hour format
                  </p>
                </div>
              </div>
              <BasicExample />
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Smartphone className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Mobile Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Touch-optimized view
                  </p>
                </div>
              </div>
              <MobileExample />
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Timer className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Range Plugin
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      NEW
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select start &amp; end times
                  </p>
                </div>
              </div>
              <RangeExample />
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/examples"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Explore more examples
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Quick to integrate
                </h2>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground">
                  Get started in seconds with simple installation and minimal
                  configuration.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Install via npm, yarn, or pnpm",
                    "Works with any JavaScript framework",
                    "Comprehensive TypeScript support",
                    "Extensive documentation and examples",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm sm:text-base text-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/docs"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Read documentation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 overflow-hidden">
                <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm">
                    <code className="text-foreground">
                      <span className="text-muted-foreground"># Install</span>
                      {"\n"}
                      <span className="text-primary">npm install</span>{" "}
                      timepicker-ui
                      {"\n\n"}
                      <span className="text-muted-foreground">
                        # Import and use
                      </span>
                      {"\n"}
                      <span className="text-purple-500">import</span>{" "}
                      {"{ TimepickerUI }"}{" "}
                      <span className="text-purple-500">from</span>{" "}
                      <span className="text-emerald-500">'timepicker-ui'</span>;
                      {"\n\n"}
                      <span className="text-purple-500">const</span> input ={" "}
                      <span className="text-blue-500">document</span>
                      {"\n  "}.
                      <span className="text-yellow-500">querySelector</span>(
                      <span className="text-emerald-500">'#timepicker'</span>
                      );
                      {"\n\n"}
                      <span className="text-purple-500">const</span> picker ={" "}
                      <span className="text-purple-500">new</span>{" "}
                      <span className="text-blue-500">TimepickerUI</span>
                      (input);
                      {"\n"}
                      picker.<span className="text-yellow-500">create</span>();
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Advanced Features
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Powerful capabilities for complex requirements
            </p>
          </div>
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advancedFeatures.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {feature.description}
                </p>
                <div className="flex items-center text-xs font-medium text-primary">
                  Learn more
                  <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to get started?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Install timepicker-ui and start building beautiful time pickers
              today.
            </p>
            <div className="mt-8">
              <Link
                href="/docs/installation"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
