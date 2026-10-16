import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/guides/ai" />
      <JsonLdTechArticle
        pathname="/docs/guides/ai"
        headline="Use with AI"
        description="Connect the timepicker-ui MCP server to Claude Code, Cursor, VS Code or Claude Desktop so your assistant reads real options, events and themes from the library."
      />
      {children}
    </>
  );
}
