import { docsNav, examplesNav, type NavLink } from "@/lib/nav";

type ExampleRef = string | { section: string };

const RELATED_EXAMPLES: Record<string, ExampleRef[]> = {
  "/docs/installation": ["/examples/basic/getting-started"],
  "/docs/quick-start": ["/examples/basic/getting-started"],
  "/docs/configuration": [
    "/examples/basic/backdrop",
    "/examples/features/current-time",
    "/examples/features/editable",
    "/examples/features/increment",
  ],
  "/docs/api/options": [
    "/examples/features/smooth-hour-snap",
    "/examples/advanced/custom-container",
    "/examples/features/open-from-button",
  ],
  "/docs/api/methods": [
    "/examples/advanced/dynamic-updates",
    "/examples/advanced/external-api",
    "/examples/advanced/multiple",
  ],
  "/docs/api/events": ["/examples/advanced/events"],
  "/docs/api/css-variables": ["/examples/advanced/custom-styling"],
  "/docs/api/css-classes": ["/examples/advanced/custom-styling"],
  "/docs/features/clock-format": ["/examples/basic/12h-format", "/examples/basic/24h-format"],
  "/docs/features/seconds": ["/examples/features/seconds"],
  "/docs/features/themes": [{ section: "Themes" }],
  "/docs/features/inline-mode": ["/examples/features/inline-mode"],
  "/docs/features/mobile": ["/examples/features/mobile", "/examples/features/switch-icon"],
  "/docs/features/disabled-time": [
    "/examples/features/disabled-time",
    "/examples/features/increment",
    "/examples/advanced/validation",
  ],
  "/docs/features/clear-button": ["/examples/features/clear-button"],
  "/docs/features/validation": ["/examples/advanced/validation", "/examples/features/editable"],
  "/docs/features/plugins": [
    "/examples/plugins/range",
    "/examples/plugins/timezone",
    "/examples/plugins/wheel",
  ],
  "/docs/advanced/styling": ["/examples/advanced/custom-styling"],
  "/docs/advanced/localization": ["/examples/advanced/localization", "/examples/features/custom-labels"],
  "/docs/advanced/accessibility": ["/examples/features/focus-trap", "/examples/basic/no-animation"],
};

type ResolvedExample = { link: NavLink; covers: string[] };

export type RelatedPages = { kind: "examples" | "docs"; links: NavLink[] };

const exampleLinks = examplesNav.flatMap((section) => section.links);

function resolveExample(ref: ExampleRef): ResolvedExample[] {
  if (typeof ref === "string") {
    const link = exampleLinks.find((candidate) => candidate.href === ref);
    return link ? [{ link, covers: [link.href] }] : [];
  }
  const section = examplesNav.find((candidate) => candidate.title === ref.section);
  const first = section?.links[0];
  if (!section || !first) return [];
  return [
    {
      link: { title: section.title, href: first.href },
      covers: section.links.map((link) => link.href),
    },
  ];
}

const examplesByDocs = new Map<string, NavLink[]>();
const docsByExample = new Map<string, NavLink[]>();

docsNav
  .flatMap((section) => section.links)
  .forEach((docsLink) => {
    const refs = RELATED_EXAMPLES[docsLink.href];
    if (!refs) return;
    const resolved = refs.flatMap(resolveExample);
    if (resolved.length === 0) return;
    examplesByDocs.set(
      docsLink.href,
      resolved.map(({ link }) => link),
    );
    resolved.forEach(({ covers }) => {
      covers.forEach((href) => {
        const docs = docsByExample.get(href) ?? [];
        if (!docs.includes(docsLink)) docs.push(docsLink);
        docsByExample.set(href, docs);
      });
    });
  });

export function getRelatedPages(pathname: string): RelatedPages | undefined {
  const examples = examplesByDocs.get(pathname);
  if (examples) return { kind: "examples", links: examples };
  const docs = docsByExample.get(pathname);
  if (docs) return { kind: "docs", links: docs };
  return undefined;
}
