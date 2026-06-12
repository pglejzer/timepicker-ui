import { SITE_URL } from "@/lib/seo-routes";

/**
 * Site-wide SoftwareApplication structured data. Rendered once from the root
 * layout. Server component - JSON is stringified from a static object, never
 * from user input.
 */
export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "timepicker-ui",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    description:
      "Zero-dependency, framework-agnostic, SSR-safe time picker with analog clock, scroll wheel and compact-wheel modes, 12 themes, full TypeScript types and tree-shakeable plugins.",
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Piotr Glejzer",
    },
    sameAs: [
      "https://www.npmjs.com/package/timepicker-ui",
      "https://github.com/pglejzer/timepicker-ui",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * FAQPage structured data. Only render this on pages whose visible content
 * contains the exact same questions and answers - the markup must mirror what
 * users see. Server component, JSON stringified from static props.
 */
export function JsonLdFaq({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question" as const,
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * TechArticle structured data for long-form docs/guide pages. Headline and
 * description should mirror the page's own metadata. Server component, JSON
 * stringified from static props.
 */
export function JsonLdTechArticle({
  pathname,
  headline,
  description,
}: {
  pathname: string;
  headline: string;
  description: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    description,
    url: `${SITE_URL}${pathname}`,
    mainEntityOfPage: `${SITE_URL}${pathname}`,
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: "Piotr Glejzer",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SEGMENT_LABELS: Record<string, string> = {
  docs: "Docs",
  examples: "Examples",
  react: "React",
  api: "API",
  features: "Features",
  advanced: "Advanced",
  basic: "Basic",
  themes: "Themes",
  plugins: "Plugins",
  callbacks: "Callbacks",
  controlled: "Controlled",
  forms: "Forms",
  "bundle-stats": "Bundle Size Analysis",
};

function humanize(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  return segment
    .split("-")
    .map((w) => (w.length <= 2 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * BreadcrumbList structured data driven by the route segments. Rendered from
 * per-route server layouts on nested docs/examples/react pages.
 */
export function JsonLdBreadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  const itemListElement = [
    {
      "@type": "ListItem" as const,
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return {
        "@type": "ListItem" as const,
        position: index + 2,
        name: humanize(segment),
        item: `${SITE_URL}${href}`,
      };
    }),
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
