import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/api/typescript" />
      <JsonLdTechArticle
        pathname="/docs/api/typescript"
        headline="TypeScript"
        description="TypeScript reference for timepicker-ui - first-class types and interfaces for options, values and events in the zero-dependency, framework-agnostic time picker."
      />
      {children}
    </>
  );
}
