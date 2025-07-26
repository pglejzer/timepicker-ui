import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Documentation - Timepicker-UI",
};

const features = [
  "Multiple themes (8 built-in)",
  "12h/24h clock formats",
  "Mobile optimized with touch support",
  "Inline mode (always visible)",
  "Keyboard navigation (Tab, Enter, Escape, Arrow keys)",
  "Time validation and disabled ranges",
  "Framework agnostic (vanilla JS, React, Vue, Angular)",
  "TypeScript support",
  "SSR compatible",
  "Fully accessible (ARIA)",
];

const browsers = [
  "Chrome/Edge (latest)",
  "Firefox (latest)",
  "Safari (latest)",
  "Mobile browsers (iOS Safari, Chrome Mobile)",
];

export default function DocsPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about using Timepicker-UI in your
          projects.
        </p>
      </div>

      <div className="mb-16 grid gap-6 sm:grid-cols-2">
        <DocCard
          title="Installation"
          description="Install and set up Timepicker-UI"
          href="/docs/installation"
          gradient="from-violet-500 to-purple-500"
        />
        <DocCard
          title="Quick Start"
          description="Get started in minutes"
          href="/docs/quick-start"
          gradient="from-blue-500 to-cyan-500"
        />
        <DocCard
          title="Configuration"
          description="All available options"
          href="/docs/configuration"
          gradient="from-pink-500 to-rose-500"
        />
        <DocCard
          title="API Reference"
          description="Methods, events, and types"
          href="/docs/api/methods"
          gradient="from-amber-500 to-orange-500"
        />
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Features</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Browser Support
        </h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground mb-4">
            Timepicker-UI works in all modern browsers:
          </p>
          <ul className="space-y-2">
            {browsers.map((browser) => (
              <li key={browser} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                <span className="text-sm">{browser}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-purple-500/5 p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2">License</h2>
        <p className="text-muted-foreground">
          MIT License - free for personal and commercial use.
        </p>
      </div>
    </div>
  );
}

interface DocCardProps {
  title: string;
  description: string;
  href: string;
  gradient: string;
}

function DocCard({ title, description, href, gradient }: DocCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-10`}
      ></div>
      <div className="relative">
        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="flex items-center text-sm font-medium text-primary">
          Learn more
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
}
