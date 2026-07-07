import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/api/methods" />
      <JsonLdTechArticle
        pathname="/docs/api/methods"
        headline="Methods"
        description="Methods reference for timepicker-ui - create, open, close, getValue, setValue, update, destroy and static helpers for the zero-dependency, SSR-safe time picker."
      />
      {children}
    </>
  );
}
