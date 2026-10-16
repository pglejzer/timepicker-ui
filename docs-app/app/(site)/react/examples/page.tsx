"use client";

import { Callout } from "@/components/callout";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";

const categories = [
  {
    title: "Basic Examples",
    description: "Get started with simple usage patterns",
    examples: [
      {
        title: "Getting Started",
        href: "/react/examples/basic/getting-started",
      },
      {
        title: "With Callbacks",
        href: "/react/examples/basic/with-callbacks",
      },
      { title: "24h Format", href: "/react/examples/basic/24h-format" },
    ],
  },
  {
    title: "Controlled Components",
    description: "Manage timepicker state with React",
    examples: [
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
    ],
  },
  {
    title: "Callbacks & Events",
    description: "Handle user interactions and events",
    examples: [
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
    ],
  },
  {
    title: "Themes",
    description: "Apply different visual styles",
    examples: [
      { title: "Dark Theme", href: "/react/examples/themes/dark" },
      {
        title: "Material 3 Green",
        href: "/react/examples/themes/m3-green",
      },
      { title: "Custom Styling", href: "/react/examples/themes/custom" },
    ],
  },
  {
    title: "Features",
    description: "Advanced features and options",
    examples: [
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
    ],
  },
  {
    title: "Form Integration",
    description: "Use timepicker in forms with validation",
    examples: [
      {
        title: "Form Validation",
        href: "/react/examples/forms/validation",
      },
      { title: "Required Field", href: "/react/examples/forms/required" },
      { title: "Form State", href: "/react/examples/forms/state" },
    ],
  },
];

export default function ReactExamplesIndexPage() {
  return (
    <div>
      <PageHeader
        title="React Examples"
        description="React examples for controlled value, callbacks, themes, forms and features."
      />

      <Callout title="Installation">
        <code>npm install timepicker-ui-react</code>
        <p>
          All examples use the official React wrapper for timepicker-ui v4.x
        </p>
      </Callout>

      <dl>
        {categories.map((category) => (
          <div key={category.title}>
            <dt>{category.title}</dt>
            <dd>
              {category.description}
              <ul>
                {category.examples.map((example) => (
                  <li key={example.href}>
                    <Link href={example.href}>{example.title}</Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <h2>Resources</h2>
      <dl>
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
          <dd>API reference and advanced usage</dd>
        </div>
        <div>
          <dt>
            <Link href="/docs/configuration">Configuration Options</Link>
          </dt>
          <dd>All timepicker-ui options</dd>
        </div>
      </dl>
    </div>
  );
}
