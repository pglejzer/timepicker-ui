import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Cyberpunk Theme Example",
  description:
    "Cyberpunk theme for timepicker-ui - a neon, high-contrast analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/themes/cyberpunk",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/cyberpunk" />
      {children}
    </>
  );
}
