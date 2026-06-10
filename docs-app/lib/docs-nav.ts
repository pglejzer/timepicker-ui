export type DocLink = { title: string; href: string };
export type DocSection = { title: string; links: DocLink[] };

export const docsNavigation: DocSection[] = [
  {
    title: "Getting Started",
    links: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Configuration", href: "/docs/configuration" },
      { title: "Migration Guide v3 to v4", href: "/docs/migration-guide" },
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
      { title: "Clear Button", href: "/docs/features/clear-button" },
      { title: "Validation", href: "/docs/features/validation" },
      { title: "Plugins", href: "/docs/features/plugins" },
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
      { title: "Bundle Analysis", href: "/bundle-stats" },
    ],
  },
  {
    title: "Legacy",
    links: [
      { title: "Migration Guide v2 to v3", href: "/docs/legacy-migration" },
    ],
  },
];

/** Flat, ordered list of in-docs pages for prev/next paging. */
export const docsFlat: DocLink[] = docsNavigation
  .flatMap((s) => s.links)
  .filter((l) => l.href.startsWith("/docs/"));

/** Resolve the section title + page title for a given pathname (breadcrumbs). */
export function findDocMeta(pathname: string): {
  section?: string;
  title?: string;
} {
  for (const section of docsNavigation) {
    const link = section.links.find((l) => l.href === pathname);
    if (link) return { section: section.title, title: link.title };
  }
  return {};
}

/** Previous / next page relative to the current pathname. */
export function getDocPager(pathname: string): {
  prev?: DocLink;
  next?: DocLink;
} {
  const i = docsFlat.findIndex((l) => l.href === pathname);
  if (i === -1) return {};
  return {
    prev: i > 0 ? docsFlat[i - 1] : undefined,
    next: i < docsFlat.length - 1 ? docsFlat[i + 1] : undefined,
  };
}
