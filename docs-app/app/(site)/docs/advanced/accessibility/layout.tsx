import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/advanced/accessibility" />
      <JsonLdTechArticle
        pathname="/docs/advanced/accessibility"
        headline="Accessibility"
        description="Accessibility in timepicker-ui - full keyboard navigation, ARIA roles, focus trap and screen-reader support. Zero-dependency, framework-agnostic and SSR-safe."
      />
      {children}
    </>
  );
}
