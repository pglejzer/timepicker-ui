import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  Download,
  ExternalLink,
  Github,
  Package,
} from "lucide-react";

export const metadata = {
  title: "React - Timepicker-UI",
  description: "Official React wrapper for timepicker-ui v4.x",
};

export default function ReactPage() {
  return (
    <div>
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary mb-6">
          <Package className="h-4 w-4" />
          <span className="font-medium">Official React Wrapper</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          timepicker-ui-react
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A lightweight, SSR-safe React component that provides a thin wrapper
          around timepicker-ui with full TypeScript support.
        </p>
      </div>

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
