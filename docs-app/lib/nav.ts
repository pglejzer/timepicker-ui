export type NavLink = {
  title: string;
  href: string;
  badge?: string;
  keywords?: string;
  external?: boolean;
};

export type NavSection = { title: string; links: NavLink[] };

export type SiteArea = "docs" | "examples" | "react";

export type SearchItem = NavLink & { group: string; area: SiteArea };

export const docsNav: NavSection[] = [
  {
    title: "Getting Started",
    links: [
      { title: "Installation", href: "/docs/installation", keywords: "npm yarn pnpm setup" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Configuration", href: "/docs/configuration", keywords: "options config" },
      {
        title: "Migrate to v5",
        href: "/docs/migration-guide-v5",
        badge: "Beta",
        keywords: "migration guide upgrade 5.0 renamed deprecated removed beta",
      },
      { title: "Migrate to v4", href: "/docs/migration-guide", keywords: "migration guide upgrade" },
      { title: "What's New", href: "/docs/whats-new", keywords: "changelog release" },
    ],
  },
  {
    title: "Guides",
    links: [
      { title: "Server Rendering", href: "/docs/guides/server-rendering", keywords: "ssr next nuxt sveltekit" },
      { title: "Testing", href: "/docs/guides/testing", keywords: "jest playwright testing library" },
      { title: "Use with AI", href: "/docs/guides/ai", keywords: "mcp claude cursor llms" },
      { title: "Troubleshooting", href: "/docs/guides/troubleshooting", keywords: "errors faq problems" },
    ],
  },
  {
    title: "API Reference",
    links: [
      { title: "Options", href: "/docs/api/options", keywords: "renamed deprecated" },
      { title: "Methods", href: "/docs/api/methods" },
      { title: "Events", href: "/docs/api/events" },
      { title: "TypeScript", href: "/docs/api/typescript", keywords: "types ts" },
      { title: "CSS Variables", href: "/docs/api/css-variables", keywords: "tokens custom properties --tp" },
      { title: "CSS Classes", href: "/docs/api/css-classes", keywords: "tp-ui selectors specificity" },
    ],
  },
  {
    title: "Features",
    links: [
      { title: "12h/24h Format", href: "/docs/features/clock-format" },
      {
        title: "Seconds",
        href: "/docs/features/seconds",
        keywords: "showSeconds hh:mm:ss incrementSeconds",
      },
      {
        title: "Themes",
        href: "/docs/features/themes",
        keywords: "dark crane material cyberpunk",
      },
      { title: "Inline Mode", href: "/docs/features/inline-mode" },
      { title: "Mobile Support", href: "/docs/features/mobile", keywords: "touch" },
      { title: "Disabled Time", href: "/docs/features/disabled-time" },
      { title: "Clear Button", href: "/docs/features/clear-button" },
      { title: "Validation", href: "/docs/features/validation" },
      { title: "Plugins", href: "/docs/features/plugins", keywords: "range timezone wheel" },
    ],
  },
  {
    title: "Advanced",
    links: [
      { title: "Custom Styling", href: "/docs/advanced/styling", keywords: "css variables" },
      { title: "Localization", href: "/docs/advanced/localization", keywords: "i18n labels" },
      { title: "Accessibility", href: "/docs/advanced/accessibility", keywords: "a11y aria" },
    ],
  },
  {
    title: "Project",
    links: [
      { title: "Changelog", href: "/docs/changelog" },
      { title: "React Changelog", href: "/docs/changelog/react", keywords: "react wrapper release" },
      { title: "MCP Server Changelog", href: "/docs/changelog/mcp", keywords: "mcp server release" },
      { title: "Roadmap", href: "/docs/roadmap" },
      { title: "Bundle Analysis", href: "/bundle-stats", keywords: "size kb" },
    ],
  },
  {
    title: "Legacy",
    links: [{ title: "Migrate to v3", href: "/docs/legacy-migration", keywords: "migration guide" }],
  },
];

export const examplesNav: NavSection[] = [
  {
    title: "Basic Examples",
    links: [
      { title: "All examples", href: "/examples" },
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
      { title: "Basic Theme", href: "/examples/themes/basic", keywords: "dark crane material" },
      { title: "Crane", href: "/examples/themes/crane" },
      { title: "Crane Straight", href: "/examples/themes/crane-straight" },
      { title: "Material 3 Green", href: "/examples/themes/material-3" },
      { title: "Material 2", href: "/examples/themes/material-2" },
      { title: "Dark Theme", href: "/examples/themes/dark" },
      { title: "Glassmorphic", href: "/examples/themes/glassmorphic" },
      { title: "Pastel", href: "/examples/themes/pastel" },
      { title: "AI Theme", href: "/examples/themes/ai" },
      { title: "Cyberpunk", href: "/examples/themes/cyberpunk" },
      { title: "Blueprint", href: "/examples/themes/blueprint", badge: "New" },
      { title: "Blueprint Dark", href: "/examples/themes/blueprint-dark", badge: "New" },
    ],
  },
  {
    title: "Features",
    links: [
      { title: "Inline Mode", href: "/examples/features/inline-mode" },
      { title: "Mobile Version", href: "/examples/features/mobile" },
      { title: "Editable Input", href: "/examples/features/editable" },
      {
        title: "Open From a Button",
        href: "/examples/features/open-from-button",
        badge: "New",
        keywords: "data-open icon trigger returnFocus",
      },
      { title: "Disabled Time", href: "/examples/features/disabled-time" },
      { title: "Custom Labels", href: "/examples/features/custom-labels" },
      { title: "Current Time", href: "/examples/features/current-time" },
      { title: "Increment Steps", href: "/examples/features/increment" },
      {
        title: "Seconds",
        href: "/examples/features/seconds",
        badge: "New",
        keywords: "showSeconds hh:mm:ss",
      },
      { title: "Focus Trap", href: "/examples/features/focus-trap" },
      { title: "Switch Icon", href: "/examples/features/switch-icon" },
      { title: "Smooth Hour Snap", href: "/examples/features/smooth-hour-snap" },
      { title: "Clear Button", href: "/examples/features/clear-button" },
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
      { title: "Custom Container", href: "/examples/advanced/custom-container" },
      { title: "External API", href: "/examples/advanced/external-api" },
    ],
  },
  {
    title: "Plugins",
    links: [
      { title: "Range Mode", href: "/examples/plugins/range", keywords: "plugin" },
      { title: "Timezone Selector", href: "/examples/plugins/timezone", keywords: "plugin" },
      { title: "Wheel Mode", href: "/examples/plugins/wheel", keywords: "plugin" },
    ],
  },
];

export const reactNav: NavSection[] = [
  {
    title: "Overview",
    links: [
      { title: "Introduction", href: "/react", keywords: "hook component wrapper" },
      { title: "Installation", href: "/react/installation" },
      { title: "Quick Start", href: "/react/quick-start" },
      { title: "All React examples", href: "/react/examples" },
    ],
  },
  {
    title: "Basic Examples",
    links: [
      { title: "Getting Started", href: "/react/examples/basic/getting-started" },
      { title: "With Callbacks", href: "/react/examples/basic/with-callbacks" },
      { title: "24h Format", href: "/react/examples/basic/24h-format" },
    ],
  },
  {
    title: "Controlled",
    links: [
      { title: "Controlled Value", href: "/react/examples/controlled/value" },
      { title: "Multiple Pickers", href: "/react/examples/controlled/multiple" },
      { title: "On Update", href: "/react/examples/controlled/on-update" },
    ],
  },
  {
    title: "Callbacks",
    links: [
      { title: "All Events", href: "/react/examples/callbacks/all-events" },
      { title: "onConfirm", href: "/react/examples/callbacks/on-confirm" },
      { title: "Selection Events", href: "/react/examples/callbacks/selection" },
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
      { title: "Custom Labels", href: "/react/examples/features/custom-labels" },
      { title: "Time Increment", href: "/react/examples/features/increment" },
    ],
  },
  {
    title: "Forms",
    links: [
      { title: "Validation", href: "/react/examples/forms/validation", keywords: "form" },
      { title: "Required Field", href: "/react/examples/forms/required" },
      { title: "Form State", href: "/react/examples/forms/state" },
    ],
  },
  {
    title: "Resources",
    links: [
      { title: "GitHub", href: "https://github.com/pglejzer/timepicker-ui-react", external: true },
      { title: "npm Package", href: "https://www.npmjs.com/package/timepicker-ui-react", external: true },
      { title: "Changelog", href: "/docs/changelog/react" },
      { title: "Core Library Docs", href: "/docs" },
    ],
  },
];

export const navByArea: Record<SiteArea, NavSection[]> = {
  docs: docsNav,
  examples: examplesNav,
  react: reactNav,
};

const AREA_LABEL: Record<SiteArea, string> = {
  docs: "Docs",
  examples: "Examples",
  react: "React",
};

export function areaOf(pathname: string): SiteArea {
  if (pathname.startsWith("/react")) return "react";
  if (pathname.startsWith("/examples")) return "examples";
  return "docs";
}

export function findNavMeta(
  sections: NavSection[],
  pathname: string,
): { section?: string; title?: string } {
  for (const section of sections) {
    const link = section.links.find((l) => l.href === pathname);
    if (link) return { section: section.title, title: link.title };
  }
  return {};
}

const docsPages = docsNav
  .flatMap((section) => section.links)
  .filter((link) => link.href.startsWith("/docs/"));

export function getDocsPager(pathname: string): {
  prev?: NavLink;
  next?: NavLink;
} {
  const index = docsPages.findIndex((link) => link.href === pathname);
  if (index === -1) return {};
  return { prev: docsPages[index - 1], next: docsPages[index + 1] };
}

const PLAYGROUND_ITEM: SearchItem = {
  title: "Playground",
  href: "/playground",
  keywords: "configurator builder generator",
  group: "Tools",
  area: "docs",
};

export function searchItems(): SearchItem[] {
  const seen = new Set<string>();
  const items: SearchItem[] = [];
  (Object.keys(navByArea) as SiteArea[]).forEach((area) => {
    navByArea[area].forEach((section) => {
      section.links.forEach((link) => {
        if (link.external || seen.has(link.href)) return;
        seen.add(link.href);
        const group =
          area === "docs" ? section.title : `${AREA_LABEL[area]} · ${section.title}`;
        items.push({ ...link, group, area });
      });
    });
  });
  if (!seen.has(PLAYGROUND_ITEM.href)) items.push(PLAYGROUND_ITEM);
  return items;
}
