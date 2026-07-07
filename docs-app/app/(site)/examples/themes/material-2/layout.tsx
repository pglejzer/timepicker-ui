import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Material 2 Theme Example",
  description:
    "Material 2 theme for timepicker-ui - the classic Material Design analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, copy-paste ready.",
  path: "/examples/themes/material-2",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/material-2" />
      {children}
    </>
  );
}
