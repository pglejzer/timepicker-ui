import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/guides/testing" />
      <JsonLdTechArticle
        pathname="/docs/guides/testing"
        headline="Testing"
        description="Test forms that use timepicker-ui with Testing Library and Playwright: find the picker by role, set a time with the keyboard and check the value."
      />
      {children}
    </>
  );
}
