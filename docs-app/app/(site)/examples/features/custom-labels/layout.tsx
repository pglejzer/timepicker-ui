import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Custom Labels Example",
  description:
    "Custom labels time picker example - localize OK, Cancel, AM/PM and all UI text in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  path: "/examples/features/custom-labels",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/custom-labels" />
      {children}
    </>
  );
}
