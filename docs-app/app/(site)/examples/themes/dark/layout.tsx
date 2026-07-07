import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Dark Theme Example",
  description:
    "Dark theme time picker example - a dark-mode analog clock with timepicker-ui. Zero-dependency, framework-agnostic, accessible and SSR-safe, with example code.",
  path: "/examples/themes/dark",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/dark" />
      {children}
    </>
  );
}
