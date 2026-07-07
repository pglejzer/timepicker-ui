import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Dynamic Updates Example",
  description:
    "Dynamic updates example - change time picker options at runtime with update() in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  path: "/examples/advanced/dynamic-updates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/dynamic-updates" />
      {children}
    </>
  );
}
