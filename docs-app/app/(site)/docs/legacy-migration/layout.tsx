import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/legacy-migration" />
      <JsonLdTechArticle
        pathname="/docs/legacy-migration"
        headline="Legacy Migration Guide v2 to v3"
        description="Upgrade timepicker-ui from v2.x to v3.x - the legacy migration guide covering breaking changes, renamed options and updated initialization, with code examples."
      />
      {children}
    </>
  );
}
