"use client";

import { InfoBox } from "@/components/info-box";
import {
  Clock,
  Code2,
  Palette,
  Smartphone,
  Settings,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  examples: { title: string; href: string }[];
}

function CategoryCard({
  icon: Icon,
  title,
  description,
  examples,
}: CategoryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/30">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-6">
        <ul className="space-y-2">
          {examples.map((example) => (
            <li key={example.href}>
              <Link
                href={example.href}
                className="block rounded-lg px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                → {example.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ReactExamplesIndexPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          React Examples
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive examples showing how to use timepicker-ui-react in
          different scenarios
        </p>
      </div>

      <InfoBox title="Installation" emoji="📦" variant="blue" className="mb-8">
        <code className="text-sm">npm install timepicker-ui-react</code>
        <p className="mt-2 text-sm">
          All examples use the official React wrapper for timepicker-ui v4.x
        </p>
      </InfoBox>

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryCard
          icon={Clock}
          title="Basic Examples"
          description="Get started with simple usage patterns"
          examples={[
            {
              title: "Getting Started",
              href: "/react/examples/basic/getting-started",
            },
            {
              title: "With Callbacks",
              href: "/react/examples/basic/with-callbacks",
            },
            { title: "24h Format", href: "/react/examples/basic/24h-format" },
          ]}
        />

        <CategoryCard
          icon={Code2}
          title="Controlled Components"
          description="Manage timepicker state with React"
          examples={[
            {
              title: "Controlled Value",
              href: "/react/examples/controlled/value",
            },
            {
              title: "onUpdate Event",
              href: "/react/examples/controlled/on-update",
            },
            {
              title: "Multiple Pickers",
              href: "/react/examples/controlled/multiple",
            },
          ]}
        />

        <CategoryCard
          icon={Settings}
          title="Callbacks & Events"
          description="Handle user interactions and events"
          examples={[
            {
              title: "All Events",
              href: "/react/examples/callbacks/all-events",
            },
            {
              title: "onConfirm",
              href: "/react/examples/callbacks/on-confirm",
            },
            { title: "onCancel", href: "/react/examples/callbacks/on-cancel" },
            {
              title: "Selection Events",
              href: "/react/examples/callbacks/selection",
            },
          ]}
        />

        <CategoryCard
          icon={Palette}
          title="Themes"
          description="Apply different visual styles"
          examples={[
            { title: "Dark Theme", href: "/react/examples/themes/dark" },
            {
              title: "Material 3 Green",
              href: "/react/examples/themes/m3-green",
            },
            { title: "Custom Styling", href: "/react/examples/themes/custom" },
          ]}
        />

        <CategoryCard
          icon={Smartphone}
          title="Features"
          description="Advanced features and options"
          examples={[
            { title: "Mobile Mode", href: "/react/examples/features/mobile" },
            {
              title: "Custom Labels",
              href: "/react/examples/features/custom-labels",
            },
            {
              title: "Increment Steps",
              href: "/react/examples/features/increment",
            },
            {
              title: "Disabled Input",
              href: "/react/examples/features/disabled",
            },
          ]}
        />

        <CategoryCard
          icon={FileCheck}
          title="Form Integration"
          description="Use timepicker in forms with validation"
          examples={[
            {
              title: "Form Validation",
              href: "/react/examples/forms/validation",
            },
            { title: "Required Field", href: "/react/examples/forms/required" },
            { title: "Form State", href: "/react/examples/forms/state" },
          ]}
        />
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://github.com/pglejzer/timepicker-ui-react#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Code2 className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">Full Documentation</div>
              <div className="text-sm text-muted-foreground truncate">
                API reference and advanced usage
              </div>
            </div>
          </a>

          <a
            href="/docs/configuration"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Palette className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium">Configuration Options</div>
              <div className="text-sm text-muted-foreground truncate">
                All timepicker-ui options
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
