"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";

const navigation = [
  {
    title: "Overview",
    links: [
      { title: "Introduction", href: "/react" },
      { title: "Installation", href: "/react/installation" },
      { title: "Quick Start", href: "/react/quick-start" },
    ],
  },
  {
    title: "Basic Examples",
    links: [
      {
        title: "Getting Started",
        href: "/react/examples/basic/getting-started",
      },
      { title: "With Callbacks", href: "/react/examples/basic/with-callbacks" },
      { title: "24h Format", href: "/react/examples/basic/24h-format" },
    ],
  },
  {
    title: "Controlled",
    links: [
      { title: "Controlled Value", href: "/react/examples/controlled/value" },
      {
        title: "Multiple Pickers",
        href: "/react/examples/controlled/multiple",
      },
      {
        title: "On Update",
        href: "/react/examples/controlled/on-update",
      },
    ],
  },
  {
    title: "Callbacks",
    links: [
      { title: "All Events", href: "/react/examples/callbacks/all-events" },
      { title: "onConfirm", href: "/react/examples/callbacks/on-confirm" },
      {
        title: "Selection Events",
        href: "/react/examples/callbacks/selection",
      },
      { title: "onCancel", href: "/react/examples/callbacks/on-cancel" },
    ],
  },
  {
    title: "Themes",
    links: [
      { title: "Dark Theme", href: "/react/examples/themes/dark" },
      { title: "Custom Theme", href: "/react/examples/themes/custom" },
      { title: "Material 3 Green", href: "/react/examples/themes/m3-green" },
    ],
  },
  {
    title: "Features",
    links: [
      { title: "Mobile Mode", href: "/react/examples/features/mobile" },
      { title: "Disabled State", href: "/react/examples/features/disabled" },
      {
        title: "Custom Labels",
        href: "/react/examples/features/custom-labels",
      },
      {
        title: "Time Increment",
        href: "/react/examples/features/increment",
      },
    ],
  },
  {
    title: "Forms",
    links: [
      { title: "Validation", href: "/react/examples/forms/validation" },
      { title: "Required Field", href: "/react/examples/forms/required" },
      { title: "Form State", href: "/react/examples/forms/state" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        title: "GitHub",
        href: "https://github.com/pglejzer/timepicker-ui-react",
        external: true,
      },
      {
        title: "npm Package",
        href: "https://www.npmjs.com/package/timepicker-ui-react",
        external: true,
      },
      {
        title: "Core Library Docs",
        href: "/docs",
      },
    ],
  },
];

export function ReactSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(navigation.map((s) => [s.title, true]))
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav className="w-full">
      <div>
        <div className="space-y-4 py-4">
          {navigation.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-accent/50 md:cursor-default md:hover:bg-transparent"
              >
                <span className="eyebrow">{section.title}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform md:hidden ${
                    openSections[section.title] ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`mt-1 space-y-1 ${
                  openSections[section.title] ? "block" : "hidden md:block"
                }`}
              >
                <ul className="space-y-1">
                  {section.links.map((link) => {
                    const isActive = pathname === link.href;
                    const isExternal = "external" in link && link.external;

                    return (
                      <li key={link.href}>
                        {isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 border-l-2 border-transparent px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                          >
                            {link.title}
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className={`block border-l-2 px-3 py-1.5 text-sm transition-colors ${
                              isActive
                                ? "border-primary font-medium text-primary"
                                : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                            }`}
                          >
                            {link.title}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
