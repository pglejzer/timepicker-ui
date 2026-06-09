"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { docsNavigation as navigation } from "@/lib/docs-nav";

function slugifySection(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function DocsSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(navigation.map((s) => [s.title, true])),
  );

  const toggleSection = (title: string) => {
    if (window.innerWidth < 768) {
      setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
    }
  };

  const sectionPanelId = (title: string) =>
    `docs-section-${slugifySection(title)}`;

  return (
    <nav className="w-full">
      <div>
        <div className="space-y-4 py-4">
          {navigation.map((section) => {
            const panelId = sectionPanelId(section.title);
            return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                aria-expanded={openSections[section.title]}
                aria-controls={panelId}
                className="flex w-full items-center justify-between px-3 py-2 transition-colors hover:bg-accent/50 md:pointer-events-none md:cursor-default md:hover:bg-transparent"
              >
                <span className="eyebrow">{section.title}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform md:hidden ${
                    openSections[section.title] ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
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
                          onClick={handleLinkClick}
                          aria-current={isActive ? "page" : undefined}
                          className={`block border-l-2 px-3 py-1.5 text-sm transition-colors ${
                            isActive
                              ? "border-primary font-medium text-primary"
                              : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
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
            );
          })}
        </div>
      </div>
    </nav>
  );
}
