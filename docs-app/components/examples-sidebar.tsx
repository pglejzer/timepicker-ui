"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavigationLink {
  title: string;
  href: string;
}

interface NavigationSection {
  title: string;
  links: NavigationLink[];
}

const navigation: NavigationSection[] = [
  {
    title: "Basic Examples",
    links: [
      { title: "Getting Started", href: "/examples/basic/getting-started" },
      { title: "12h Format", href: "/examples/basic/12h-format" },
      { title: "24h Format", href: "/examples/basic/24h-format" },
      { title: "With Backdrop", href: "/examples/basic/backdrop" },
      { title: "Without Animation", href: "/examples/basic/no-animation" },
    ],
  },
  {
    title: "Themes",
    links: [
      { title: "Basic Theme", href: "/examples/themes/basic" },
      { title: "Crane Straight", href: "/examples/themes/crane-straight" },
      { title: "Crane Radius", href: "/examples/themes/crane-radius" },
      { title: "Material 3", href: "/examples/themes/material-3" },
      { title: "Dark Theme", href: "/examples/themes/dark" },
      { title: "Glassmorphic", href: "/examples/themes/glassmorphic" },
      { title: "Pastel", href: "/examples/themes/pastel" },
      { title: "AI Theme", href: "/examples/themes/ai" },
      { title: "Cyberpunk", href: "/examples/themes/cyberpunk" },
    ],
  },
  {
    title: "Features",
    links: [
      { title: "Inline Mode", href: "/examples/features/inline-mode" },
      { title: "Mobile Version", href: "/examples/features/mobile" },
      { title: "Editable Input", href: "/examples/features/editable" },
      { title: "Disabled Time", href: "/examples/features/disabled-time" },
      { title: "Custom Labels", href: "/examples/features/custom-labels" },
      { title: "Current Time", href: "/examples/features/current-time" },
      { title: "Increment Steps", href: "/examples/features/increment" },
      { title: "Focus Trap", href: "/examples/features/focus-trap" },
      { title: "Switch Icon", href: "/examples/features/switch-icon" },
    ],
  },
  {
    title: "Advanced",
    links: [
      { title: "Event Callbacks", href: "/examples/advanced/events" },
      { title: "Custom Styling", href: "/examples/advanced/custom-styling" },
      { title: "Multiple Pickers", href: "/examples/advanced/multiple" },
      { title: "Dynamic Updates", href: "/examples/advanced/dynamic-updates" },
      { title: "Validation", href: "/examples/advanced/validation" },
      { title: "Localization", href: "/examples/advanced/localization" },
      {
        title: "Custom Container",
        href: "/examples/advanced/custom-container",
      },
    ],
  },
];

export function ExamplesSidebar() {
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
