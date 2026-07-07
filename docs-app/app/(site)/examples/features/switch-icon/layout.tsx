import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Switch Icon Example",
  description:
    "Switch icon example - toggle the keyboard/clock switch icon on timepicker-ui. Zero-dependency, framework-agnostic, accessible and SSR-safe, with example code.",
  path: "/examples/features/switch-icon",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/switch-icon" />
      {children}
    </>
  );
}
