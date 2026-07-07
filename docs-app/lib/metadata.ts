import type { Metadata } from "next";

const OG_IMAGE = "/opengraph-image";
const SITE_NAME = "timepicker-ui";
const BRAND_SUFFIX = " - timepicker-ui";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string;
  section?: boolean;
};

/**
 * Single source of per-route metadata. Returns a unique title, description,
 * canonical, and page-specific Open Graph + Twitter cards so every route
 * ships its own social card instead of inheriting the root one.
 *
 * Pass `section: true` on a section-index layout (e.g. /examples) to
 * re-establish the branded title template for its nested routes.
 */
export function buildMetadata({
  title,
  description,
  path,
  section = false,
}: BuildMetadataArgs): Metadata {
  const ogTitle = `${title}${BRAND_SUFFIX}`;
  return {
    title: section ? { default: title, template: `%s${BRAND_SUFFIX}` } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
