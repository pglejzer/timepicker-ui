import { docsNav, examplesNav, reactNav, type NavSection } from "@/lib/nav";
import { SITE_URL } from "@/lib/seo-routes";
import { LIBRARY_VERSION, THEMES } from "@/lib/site";

export const dynamic = "force-static";

const OPTIONAL_SECTIONS = new Set(["Project", "Legacy"]);

const TOOLS: NavSection[] = [{ title: "Tools", links: [{ title: "Playground", href: "/playground" }] }];

const THEME_LIST = THEMES.map((theme) => `\`${theme}\``).join(", ");

const INTRO = [
  "# timepicker-ui",
  "",
  `> A zero-dependency, framework-agnostic, SSR-safe time picker for the web, with analog clock, scroll wheel and compact-wheel modes, ${THEMES.length} themes, TypeScript types and optional plugins.`,
  "",
  `Version ${LIBRARY_VERSION}, MIT license. Install it with \`npm install timepicker-ui\`, import \`timepicker-ui/main.css\`, then call \`new TimepickerUI(input, options).create()\`. \`TimepickerUI\` is both the default and a named export of \`timepicker-ui\`.`,
  "",
  "Options are grouped into `clock`, `ui`, `labels`, `behavior` and `callbacks`. `ui.mode` is `clock` (the default), `wheel` or `compact-wheel`. The two wheel modes need `WheelPlugin`, and the `range` and `timezone` options need `RangePlugin` and `TimezonePlugin`. Import each plugin from `timepicker-ui/plugins/<name>` and register it once with `PluginRegistry.register()`.",
  "",
  `\`ui.theme\` takes ${THEME_LIST}. Every theme except \`basic\` has its own CSS file, for example \`timepicker-ui/theme-dark.css\`, and \`timepicker-ui/index.css\` contains all of them.`,
  "",
  "React projects can use the `timepicker-ui-react` wrapper. The `timepicker-ui-mcp` package is an MCP server that lets AI assistants look up options, events and themes, generate config snippets and validate times.",
  "",
];

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function links(sections: NavSection[], seen: Set<string>): string[] {
  const lines: string[] = [];
  for (const section of sections) {
    for (const link of section.links) {
      if (link.external || !isInternal(link.href) || seen.has(link.href)) continue;
      seen.add(link.href);
      lines.push(`- [${link.title}](${SITE_URL}${link.href})`);
    }
  }
  return lines;
}

function block(title: string, lines: string[]): string[] {
  return lines.length ? [`## ${title}`, "", ...lines, ""] : [];
}

export function GET() {
  const seen = new Set<string>();
  const main = docsNav.filter((section) => !OPTIONAL_SECTIONS.has(section.title));
  const optional = docsNav.filter((section) => OPTIONAL_SECTIONS.has(section.title));

  const body = [
    ...INTRO,
    ...main.flatMap((section) => block(section.title, links([section], seen))),
    ...block("Examples", links(examplesNav, seen)),
    ...block("React", links(reactNav, seen)),
    ...block("Tools", links(TOOLS, seen)),
    ...block("Optional", links(optional, seen)),
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
