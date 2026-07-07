import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Validation Example",
  description:
    "Validation example - enforce allowed times and show errors in timepicker-ui. Zero-dependency, framework-agnostic, accessible and SSR-safe, with example code.",
  path: "/examples/advanced/validation",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/validation" />
      {children}
    </>
  );
}
