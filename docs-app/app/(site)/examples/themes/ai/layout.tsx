import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "AI Theme Example",
  description:
    "The AI theme for timepicker-ui - a modern gradient analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste example code.",
  path: "/examples/themes/ai",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/ai" />
      {children}
    </>
  );
}
