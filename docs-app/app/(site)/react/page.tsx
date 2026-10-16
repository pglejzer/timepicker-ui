import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";

export const metadata = buildMetadata({
  title: "React Time Picker",
  description:
    "React time picker - the official timepicker-ui-react wrapper. SSR-safe and fully typed for React, with analog clock, wheel modes and 12 themes.",
  path: "/react",
});

export default function ReactPage() {
  return (
    <div>
      <PageHeader
        badge="Official React Wrapper"
        title="timepicker-ui-react"
        description="A lightweight, SSR-safe React component that provides a thin wrapper around timepicker-ui with full TypeScript support."
      />

      <dl>
        <div>
          <dt>
            <a
              href="https://www.npmjs.com/package/timepicker-ui-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              npm Package
            </a>
          </dt>
          <dd>View on npm registry</dd>
        </div>
        <div>
          <dt>
            <a
              href="https://github.com/pglejzer/timepicker-ui-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
          </dt>
          <dd>Source code & issues</dd>
        </div>
        <div>
          <dt>
            <Link href="/react/examples">Live Examples</Link>
          </dt>
          <dd>Interactive demos</dd>
        </div>
      </dl>

      <h2>Features</h2>
      <dl>
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
          <div key={feature.title}>
            <dt>{feature.title}</dt>
            <dd>{feature.description}</dd>
          </div>
        ))}
      </dl>

      <h2>Next Steps</h2>
      <dl>
        <div>
          <dt>
            <Link href="/react/installation">Installation</Link>
          </dt>
          <dd>Install timepicker-ui-react in your project</dd>
        </div>
        <div>
          <dt>
            <Link href="/react/quick-start">Quick Start</Link>
          </dt>
          <dd>Get started with your first timepicker</dd>
        </div>
        <div>
          <dt>
            <Link href="/react/examples">View Live Examples</Link>
          </dt>
          <dd>Interactive demos with code samples</dd>
        </div>
        <div>
          <dt>
            <a
              href="https://github.com/pglejzer/timepicker-ui-react#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              Full Documentation
            </a>
          </dt>
          <dd>API reference, props, and advanced usage</dd>
        </div>
        <div>
          <dt>
            <Link href="/docs">Core Library Documentation</Link>
          </dt>
          <dd>Learn about timepicker-ui options and features</dd>
        </div>
      </dl>
    </div>
  );
}

