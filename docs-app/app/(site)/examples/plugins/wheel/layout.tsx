import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Wheel Plugin Example",
  description:
    "Wheel time picker example - iOS-style scroll wheel mode via the tree-shakeable wheel plugin in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe.",
  path: "/examples/plugins/wheel",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/plugins/wheel" />
      {children}
    </>
  );
}
