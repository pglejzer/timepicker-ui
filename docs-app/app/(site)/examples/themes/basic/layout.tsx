import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Basic Theme Example",
  description:
    "The default Basic theme for timepicker-ui - a clean analog clock time picker out of the box. Zero-dependency, framework-agnostic and SSR-safe, copy-paste ready.",
  path: "/examples/themes/basic",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/basic" />
      {children}
    </>
  );
}
