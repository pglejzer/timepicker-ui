import { JsonLdBreadcrumb } from "@/components/json-ld";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/docs/advanced/accessibility" />
      {children}
    </>
  );
}
