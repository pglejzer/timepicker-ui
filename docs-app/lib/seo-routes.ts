export type SitemapTier = "top" | "section" | "leaf";

export type SeoRoute = {
  path: string;
  tier: SitemapTier;
};

/**
 * Canonical list of every public route on the docs site.
 * Derived from the App Router page tree (app/.../page.tsx), lib/docs-nav.ts,
 * and the nav arrays in components/examples-sidebar.tsx and
 * components/react-sidebar.tsx. Keep in sync when routes are added/removed.
 *
 * Tiers map to sitemap priority + changeFrequency:
 *   top     -> priority 1.0 / 0.9, weekly  (home + section index pages)
 *   section -> priority 0.9,       weekly  (high-value landing pages)
 *   leaf    -> priority 0.6-0.7,   monthly (individual example/feature pages)
 */
export const seoRoutes: SeoRoute[] = [
  { path: "/", tier: "top" },
  { path: "/docs", tier: "top" },
  { path: "/examples", tier: "top" },
  { path: "/react", tier: "top" },
  { path: "/react/examples", tier: "top" },

  { path: "/bundle-stats", tier: "section" },

  // docs — getting started
  { path: "/docs/installation", tier: "section" },
  { path: "/docs/quick-start", tier: "section" },
  { path: "/docs/configuration", tier: "section" },
  { path: "/docs/migration-guide", tier: "leaf" },
  { path: "/docs/legacy-migration", tier: "leaf" },
  { path: "/docs/whats-new", tier: "leaf" },
  { path: "/docs/changelog", tier: "leaf" },
  { path: "/docs/roadmap", tier: "leaf" },

  // docs — api
  { path: "/docs/api/options", tier: "section" },
  { path: "/docs/api/methods", tier: "section" },
  { path: "/docs/api/events", tier: "section" },
  { path: "/docs/api/typescript", tier: "section" },

  // docs — features
  { path: "/docs/features/clock-format", tier: "leaf" },
  { path: "/docs/features/themes", tier: "section" },
  { path: "/docs/features/inline-mode", tier: "leaf" },
  { path: "/docs/features/mobile", tier: "leaf" },
  { path: "/docs/features/disabled-time", tier: "leaf" },
  { path: "/docs/features/clear-button", tier: "leaf" },
  { path: "/docs/features/validation", tier: "leaf" },
  { path: "/docs/features/plugins", tier: "section" },

  // docs — advanced
  { path: "/docs/advanced/styling", tier: "leaf" },
  { path: "/docs/advanced/localization", tier: "leaf" },
  { path: "/docs/advanced/accessibility", tier: "leaf" },

  // examples — basic
  { path: "/examples/basic/getting-started", tier: "leaf" },
  { path: "/examples/basic/12h-format", tier: "leaf" },
  { path: "/examples/basic/24h-format", tier: "leaf" },
  { path: "/examples/basic/backdrop", tier: "leaf" },
  { path: "/examples/basic/no-animation", tier: "leaf" },

  // examples — themes
  { path: "/examples/themes/basic", tier: "leaf" },
  { path: "/examples/themes/crane", tier: "leaf" },
  { path: "/examples/themes/crane-straight", tier: "leaf" },
  { path: "/examples/themes/material-3", tier: "leaf" },
  { path: "/examples/themes/material-2", tier: "leaf" },
  { path: "/examples/themes/dark", tier: "leaf" },
  { path: "/examples/themes/glassmorphic", tier: "leaf" },
  { path: "/examples/themes/pastel", tier: "leaf" },
  { path: "/examples/themes/ai", tier: "leaf" },
  { path: "/examples/themes/cyberpunk", tier: "leaf" },

  // examples — features
  { path: "/examples/features/inline-mode", tier: "leaf" },
  { path: "/examples/features/mobile", tier: "leaf" },
  { path: "/examples/features/editable", tier: "leaf" },
  { path: "/examples/features/disabled-time", tier: "leaf" },
  { path: "/examples/features/custom-labels", tier: "leaf" },
  { path: "/examples/features/current-time", tier: "leaf" },
  { path: "/examples/features/increment", tier: "leaf" },
  { path: "/examples/features/focus-trap", tier: "leaf" },
  { path: "/examples/features/switch-icon", tier: "leaf" },
  { path: "/examples/features/smooth-hour-snap", tier: "leaf" },
  { path: "/examples/features/clear-button", tier: "leaf" },

  // examples — advanced
  { path: "/examples/advanced/events", tier: "leaf" },
  { path: "/examples/advanced/custom-styling", tier: "leaf" },
  { path: "/examples/advanced/multiple", tier: "leaf" },
  { path: "/examples/advanced/dynamic-updates", tier: "leaf" },
  { path: "/examples/advanced/validation", tier: "leaf" },
  { path: "/examples/advanced/localization", tier: "leaf" },
  { path: "/examples/advanced/custom-container", tier: "leaf" },
  { path: "/examples/advanced/external-api", tier: "leaf" },

  // examples — plugins
  { path: "/examples/plugins/range", tier: "section" },
  { path: "/examples/plugins/timezone", tier: "section" },
  { path: "/examples/plugins/wheel", tier: "section" },

  // react — overview
  { path: "/react/installation", tier: "section" },
  { path: "/react/quick-start", tier: "section" },

  // react — basic examples
  { path: "/react/examples/basic/getting-started", tier: "leaf" },
  { path: "/react/examples/basic/with-callbacks", tier: "leaf" },
  { path: "/react/examples/basic/24h-format", tier: "leaf" },

  // react — controlled
  { path: "/react/examples/controlled/value", tier: "leaf" },
  { path: "/react/examples/controlled/multiple", tier: "leaf" },
  { path: "/react/examples/controlled/on-update", tier: "leaf" },

  // react — callbacks
  { path: "/react/examples/callbacks/all-events", tier: "leaf" },
  { path: "/react/examples/callbacks/on-confirm", tier: "leaf" },
  { path: "/react/examples/callbacks/selection", tier: "leaf" },
  { path: "/react/examples/callbacks/on-cancel", tier: "leaf" },

  // react — themes
  { path: "/react/examples/themes/dark", tier: "leaf" },
  { path: "/react/examples/themes/custom", tier: "leaf" },
  { path: "/react/examples/themes/m3-green", tier: "leaf" },

  // react — features
  { path: "/react/examples/features/mobile", tier: "leaf" },
  { path: "/react/examples/features/disabled", tier: "leaf" },
  { path: "/react/examples/features/custom-labels", tier: "leaf" },
  { path: "/react/examples/features/increment", tier: "leaf" },

  // react — forms
  { path: "/react/examples/forms/validation", tier: "leaf" },
  { path: "/react/examples/forms/required", tier: "leaf" },
  { path: "/react/examples/forms/state", tier: "leaf" },
];

export const SITE_URL = "https://timepicker-ui.vercel.app";
