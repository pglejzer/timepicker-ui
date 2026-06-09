import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  Rocket,
  SlidersHorizontal,
  Braces,
} from "lucide-react";

export const metadata = {
  title: "Documentation",
  description:
    "Documentation for timepicker-ui - install, configure and use the zero-dependency, framework-agnostic, SSR-safe time picker with TypeScript types.",
  alternates: {
    canonical: "/docs",
  },
};

const cards = [
  {
    icon: Download,
    title: "Installation",
    description: "Install the package and import the styles.",
    href: "/docs/installation",
  },
  {
    icon: Rocket,
    title: "Quick Start",
    description: "Render your first picker in three lines.",
    href: "/docs/quick-start",
  },
  {
    icon: SlidersHorizontal,
    title: "Configuration",
    description: "Every grouped option, explained.",
    href: "/docs/configuration",
  },
  {
    icon: Braces,
    title: "API Reference",
    description: "Methods, events, and TypeScript types.",
    href: "/docs/api/methods",
  },
];

const features = [
  "12 built-in themes",
  "12h / 24h clock formats",
  "Mobile + touch support",
  "Inline mode",
  "Keyboard navigation",
  "Disabled time ranges",
  "Framework-agnostic",
  "TypeScript types",
  "SSR-safe",
  "ARIA accessible",
];

const browsers = [
  "Chrome / Edge (latest)",
  "Firefox (latest)",
  "Safari (latest)",
  "iOS Safari, Chrome Mobile",
];

export default function DocsPage() {
  return (
    <div>
      <h1 className="display text-4xl font-semibold tracking-tight">
        Documentation
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        How to install, configure, and use timepicker-ui.
      </p>

      <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center justify-between">
              <c.icon className="h-5 w-5 transition-colors group-hover:text-primary" />
              <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-medium">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.description}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-semibold tracking-tight">Features</h2>
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <Check className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-semibold tracking-tight">
        Browser support
      </h2>
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <ul className="space-y-2.5">
          {browsers.map((browser) => (
            <li key={browser} className="flex items-center gap-3 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {browser}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 rounded-lg border border-l-2 border-border border-l-primary bg-muted/40 p-6">
        <h2 className="text-lg font-medium">License</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          MIT - free for personal and commercial use.
        </p>
      </div>
    </div>
  );
}

