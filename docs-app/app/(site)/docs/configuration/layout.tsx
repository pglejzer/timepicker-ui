import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/configuration" />
      <JsonLdTechArticle
        pathname="/docs/configuration"
        headline="Configuration"
        description="Configure timepicker-ui - clock, ui, labels, behavior, callbacks, timezone, range, wheel and clearBehavior option groups for the zero-dependency, SSR-safe time picker."
      />
      {children}
    </>
  );
}
