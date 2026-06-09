import type { MetadataRoute } from "next";
import { seoRoutes, SITE_URL, type SitemapTier } from "@/lib/seo-routes";

const tierConfig: Record<
  SitemapTier,
  { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
> = {
  top: { changeFrequency: "weekly", priority: 1.0 },
  section: { changeFrequency: "weekly", priority: 0.9 },
  leaf: { changeFrequency: "monthly", priority: 0.7 },
};

export default function sitemap(): MetadataRoute.Sitemap {
  // No `lastModified`: we don't track real per-page content dates, and Google
  // treats a uniform build-time timestamp as an untrustworthy signal (it can
  // make it ignore lastmod site-wide). Omitting is better than faking it.
  return seoRoutes.map(({ path, tier }) => {
    const config = tierConfig[tier];
    // The home route keeps the top priority of 1.0; other "top" section
    // indexes drop to 0.9 so the landing page ranks highest.
    const priority = path === "/" ? 1.0 : tier === "top" ? 0.9 : config.priority;

    return {
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      changeFrequency: config.changeFrequency,
      priority,
    };
  });
}
