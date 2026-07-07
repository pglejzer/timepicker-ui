import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Pastel Theme Example",
  description:
    "Pastel theme for timepicker-ui - a soft, light-colored analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste example code.",
  path: "/examples/themes/pastel",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/pastel" />
      {children}
    </>
  );
}
