import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/api/options" />
      <JsonLdTechArticle
        pathname="/docs/api/options"
        headline="Options"
        description="Complete options reference for timepicker-ui - clock, ui, labels, behavior, callbacks and plugin config for the zero-dependency, SSR-safe time picker."
      />
      {children}
    </>
  );
}
