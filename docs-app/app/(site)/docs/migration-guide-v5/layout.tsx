import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/migration-guide-v5" />
      <JsonLdTechArticle
        pathname="/docs/migration-guide-v5"
        headline="Migration Guide v4 to v5"
        description="Draft guide for moving timepicker-ui from 4.x to 5.0 - renamed options, APIs removed in 5.0, the new returnFocus default and the steps you can take on 4.5.0 today."
      />
      {children}
    </>
  );
}
