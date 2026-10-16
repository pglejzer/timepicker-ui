import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/api/css-classes" />
      <JsonLdTechArticle
        pathname="/docs/api/css-classes"
        headline="CSS Classes"
        description="The tp-ui- classes timepicker-ui renders, the state classes it adds and how to write selectors that win over the built-in styles."
      />
      {children}
    </>
  );
}
