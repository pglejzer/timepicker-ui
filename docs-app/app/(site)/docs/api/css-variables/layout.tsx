import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/api/css-variables" />
      <JsonLdTechArticle
        pathname="/docs/api/css-variables"
        headline="CSS Variables"
        description="Every --tp- CSS variable in timepicker-ui with its default value and the classes that read it, generated from the published stylesheet."
      />
      {children}
    </>
  );
}
