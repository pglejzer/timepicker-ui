"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const navigation = [
  {
    title: "Getting Started",
    links: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    title: "API Reference",
    links: [
      { title: "Options", href: "/docs/api/options" },
      { title: "Methods", href: "/docs/api/methods" },
      { title: "Events", href: "/docs/api/events" },
      { title: "TypeScript", href: "/docs/api/typescript" },
    ],
  },
  {
    title: "Features",
    links: [
      { title: "12h/24h Format", href: "/docs/features/clock-format" },
      { title: "Themes", href: "/docs/features/themes" },
      { title: "Inline Mode", href: "/docs/features/inline-mode" },
      { title: "Mobile Support", href: "/docs/features/mobile" },
      { title: "Disabled Time", href: "/docs/features/disabled-time" },
      { title: "Validation", href: "/docs/features/validation" },
    ],
  },
  {
    title: "Advanced",
    links: [
      { title: "Custom Styling", href: "/docs/advanced/styling" },
      { title: "Localization", href: "/docs/advanced/localization" },
      { title: "Accessibility", href: "/docs/advanced/accessibility" },
    ],
  },
  {
    title: "Project",
    links: [
      { title: "Changelog", href: "/docs/changelog" },
      { title: "Roadmap", href: "/docs/roadmap" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(navigation.map((s) => [s.title, true]))
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav className="w-full md:w-64 md:shrink-0">
      <div className="md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-y-auto">
        <div className="space-y-4 py-4">
          {navigation.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent/50 md:cursor-default md:hover:bg-transparent"
              >
                <span>{section.title}</span>
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
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          {link.title}
                        </Link>
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
