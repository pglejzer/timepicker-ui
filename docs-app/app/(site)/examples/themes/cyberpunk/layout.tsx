import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Cyberpunk Theme Example",
  description:
    "Cyberpunk theme for timepicker-ui - a neon, high-contrast analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  path: "/examples/themes/cyberpunk",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/cyberpunk" />
      {children}
    </>
  );
}
