import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import {
  ArrowRight,
  Check,
  Code2,
  Download,
  ExternalLink,
  Github,
  Package,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "React Time Picker",
  description:
    "React time picker - the official timepicker-ui-react wrapper. Zero-dependency, SSR-safe and fully typed for React, with analog clock, wheel modes and 12 themes.",
  path: "/react",
});

export default function ReactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="React"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Package className="h-3.5 w-3.5" />
            Official React Wrapper
          </span>
        }
        title="timepicker-ui-react"
        description="A lightweight, SSR-safe React component that provides a thin wrapper around timepicker-ui with full TypeScript support."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <a
          href="https://www.npmjs.com/package/timepicker-ui-react"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <Package className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="font-medium">npm Package</div>
            <div className="text-sm text-muted-foreground">
              View on npm registry
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>

        <a
          href="https://github.com/pglejzer/timepicker-ui-react"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <Github className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="font-medium">GitHub Repository</div>
            <div className="text-sm text-muted-foreground">
              Source code & issues
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>

        <Link
          href="/react/examples"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <Code2 className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="font-medium">Live Examples</div>
            <div className="text-sm text-muted-foreground">
              Interactive demos
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Full TypeScript Support",
              description:
                "All types directly from timepicker-ui core with full IntelliSense",
            },
            {
              title: "SSR-Safe",
              description:
                "Works with Next.js, Remix, Gatsby, and other SSR frameworks",
            },
            {
              title: "Zero Type Duplication",
              description: "Re-exports core types, no duplicated interfaces",
            },
            {
              title: "Event-Driven",
              description: "Direct mapping to timepicker-ui's EventEmitter API",
            },
            {
              title: "Controlled & Uncontrolled",
              description: "Support for both value patterns",
            },
            {
              title: "ForwardRef Support",
              description:
                "Compatible with React Hook Form and other form libraries",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex gap-3 rounded-lg border border-border bg-card p-4"
            >
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <div className="space-y-3">
          <Link
            href="/react/installation"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Download className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Installation</div>
              <div className="text-sm text-muted-foreground">
                Install timepicker-ui-react in your project
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/react/quick-start"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Code2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Quick Start</div>
              <div className="text-sm text-muted-foreground">
                Get started with your first timepicker
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/react/examples"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Code2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">View Live Examples</div>
              <div className="text-sm text-muted-foreground">
                Interactive demos with code samples
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <a
            href="https://github.com/pglejzer/timepicker-ui-react#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Github className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Full Documentation</div>
              <div className="text-sm text-muted-foreground">
                API reference, props, and advanced usage
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>

          <Link
            href="/docs"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Package className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Core Library Documentation</div>
              <div className="text-sm text-muted-foreground">
                Learn about timepicker-ui options and features
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}

