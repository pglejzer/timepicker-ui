import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { JsonLdBreadcrumb } from "@/components/json-ld";
import { ChangelogSwitcher, ReleaseList, type ReleaseNotes } from "@/components/changelog";

export const metadata = buildMetadata({
  title: "timepicker-ui-mcp Changelog",
  description:
    "Release notes for timepicker-ui-mcp, the MCP server that gives AI assistants the timepicker-ui options, events and themes, listed by version.",
  path: "/docs/changelog/mcp",
});

const RELEASES: ReleaseNotes[] = [
  {
    title: "Version 2.0.0 - 2026-10-16",
    changes: {
      Added: [
        "`search_reference` tool: keyword search across options, events, CSS variables, classes, methods, themes and troubleshooting entries.",
        "`list_css_variables` tool with `group` and `includeUnread` filters.",
        "`migration_guide` path `v4.5->v5` and the `prepare-for-v5` prompt, with the renamed and removed tables from the docs.",
        "`react-wrapper` recipe for `timepicker-ui-react`, and `showSeconds` and `clockType: 'auto'` in `generate_snippet`.",
        "Server instructions, read-only tool annotations and links to the docs in results.",
        "Completion for the `framework` argument of the `integrate` prompt.",
        "Support for clients on the MCP 2026-07-28 revision. Clients on the 2025 protocol work as before.",
      ],
      Changed: [
        "**Needs Node 20 or newer** (was 18). The server now uses the MCP TypeScript SDK v2 (`@modelcontextprotocol/server`) with zod 4.",
        "`generate_custom_theme` writes a `.tp-ui-wrapper.<name>` block for `ui.cssClass` instead of `[data-theme]` with `as any`.",
        "`get_options` and `list_events` leave out deprecated and internal entries unless asked. Deprecated entries carry a `deprecated` note.",
        "CSS variables, CSS classes and troubleshooting entries now come from the docs site, so all 168 variables are listed.",
        "Framework recipes render the input inside `div.tp-ui`, so unmounting does not break React.",
      ],
      Fixed: [
        "The server reported version 1.0.0 to clients. It now reports the package version.",
        "`generate_custom_theme` called `--tp-focus-ring`, `--tp-font-family` and 12 other real variables unknown.",
        "An unknown option name returns `isError: true` with a hint, so the model can retry.",
        "`list_api` now covers seconds in `getValue()` and `setValue()`, `setOptions()`, `getElement()` and the deprecated methods.",
      ],
    },
  },
  {
    title: "Version 1.0.2 - 2026-10-16",
    changes: {
      Changed: ["Package and MCP Registry metadata only. The tools are the same as in 1.0.0."],
    },
  },
  {
    title: "Version 1.0.1 - 2026-10-16",
    changes: {
      Changed: ["Shorter package description. The tools are the same as in 1.0.0."],
    },
  },
  {
    title: "Version 1.0.0 - 2026-10-16",
    changes: {
      Added: [
        "First release: 15 tools, 4 resources and 3 prompts with reference data for timepicker-ui 4.5.0.",
      ],
    },
  },
];

export default function McpChangelogPage() {
  return (
    <div data-toc-depth="2">
      <JsonLdBreadcrumb pathname="/docs/changelog/mcp" />
      <PageHeader
        title="timepicker-ui-mcp Changelog"
        description={
          <>
            Notable changes to <code>timepicker-ui-mcp</code>, newest first.{" "}
            <Link href="/docs/guides/ai">Use with AI</Link> shows how to set
            it up. The package follows{" "}
            <a href="https://semver.org/spec/v2.0.0.html">Semantic Versioning</a>.
          </>
        }
      />

      <ChangelogSwitcher current="mcp" />

      <ReleaseList releases={RELEASES} />
    </div>
  );
}
