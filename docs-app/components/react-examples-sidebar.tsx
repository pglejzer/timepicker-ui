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
      {
        title: "Getting Started",
        href: "/react/examples/basic/getting-started",
      },
      { title: "With Callbacks", href: "/react/examples/basic/with-callbacks" },
      { title: "24h Format", href: "/react/examples/basic/24h-format" },
    ],
  },
  {
    title: "Controlled Components",
    links: [
      { title: "Controlled Value", href: "/react/examples/controlled/value" },
      { title: "onUpdate Event", href: "/react/examples/controlled/on-update" },
      {
        title: "Multiple Pickers",
        href: "/react/examples/controlled/multiple",
      },
    ],
  },
  {
    title: "Callbacks & Events",
    links: [
      { title: "All Events", href: "/react/examples/callbacks/all-events" },
      { title: "onConfirm", href: "/react/examples/callbacks/on-confirm" },
      { title: "onCancel", href: "/react/examples/callbacks/on-cancel" },
      {
        title: "Selection Events",
        href: "/react/examples/callbacks/selection",
      },
    ],
  },
  {
    title: "Themes",
    links: [
      { title: "Dark Theme", href: "/react/examples/themes/dark" },
      { title: "Material 3 Green", href: "/react/examples/themes/m3-green" },
      { title: "Custom Styling", href: "/react/examples/themes/custom" },
    ],
  },
  {
    title: "Features",
    links: [
      { title: "Mobile Mode", href: "/react/examples/features/mobile" },
      {
        title: "Custom Labels",
        href: "/react/examples/features/custom-labels",
      },
      { title: "Increment Steps", href: "/react/examples/features/increment" },
      { title: "Disabled Input", href: "/react/examples/features/disabled" },
    ],
  },
  {
    title: "Form Integration",
    links: [
      { title: "Form Validation", href: "/react/examples/forms/validation" },
      { title: "Required Field", href: "/react/examples/forms/required" },
      { title: "Form State", href: "/react/examples/forms/state" },
    ],
  },
];

export function ReactExamplesSidebar() {
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
