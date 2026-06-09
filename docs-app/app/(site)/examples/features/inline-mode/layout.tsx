import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Inline Mode Example",
  description:
    "Inline time picker example - an always-visible timepicker-ui with no modal or backdrop. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/features/inline-mode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/inline-mode" />
      {children}
    </>
  );
}
