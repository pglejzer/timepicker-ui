import { JsonLdBreadcrumb, JsonLdTechArticle } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/api/events" />
      <JsonLdTechArticle
        pathname="/docs/api/events"
        headline="Events"
        description="Events reference for timepicker-ui - subscribe to open, confirm, cancel, clear and selection events via on/once/off on the zero-dependency time picker."
      />
      {children}
    </>
  );
}
