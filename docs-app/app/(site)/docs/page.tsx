import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";

export const metadata = buildMetadata({
  title: "Documentation",
  description:
    "Documentation for timepicker-ui - install, configure and use the zero-dependency, framework-agnostic, SSR-safe time picker with TypeScript types.",
  path: "/docs",
});

const cards = [
  {
    title: "Installation",
    description: "Install the package and import the styles.",
    href: "/docs/installation",
  },
  {
    title: "Quick Start",
    description: "Render your first picker in three lines.",
    href: "/docs/quick-start",
  },
  {
    title: "Configuration",
    description: "Every grouped option, explained.",
    href: "/docs/configuration",
  },
  {
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
      <PageHeader
        title="Documentation"
        description="How to install, configure, and use timepicker-ui."
      />

      <dl>
        {cards.map((c) => (
          <div key={c.href}>
            <dt>
              <Link href={c.href}>{c.title}</Link>
            </dt>
            <dd>{c.description}</dd>
          </div>
        ))}
      </dl>

      <Section title="Features">
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </Section>

      <Section title="Browser support">
        <ul>
          {browsers.map((browser) => (
            <li key={browser}>{browser}</li>
          ))}
        </ul>
      </Section>

      <Callout title="License">
        MIT - free for personal and commercial use.
      </Callout>
    </div>
  );
}

