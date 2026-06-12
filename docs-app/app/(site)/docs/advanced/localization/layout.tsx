import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/advanced/localization" />
      <JsonLdTechArticle
        pathname="/docs/advanced/localization"
        headline="Localization"
        description="Localize timepicker-ui for any language - translate every label and AM/PM text for global apps. Zero-dependency, framework-agnostic, accessible and SSR-safe."
      />
      {children}
    </>
  );
}
