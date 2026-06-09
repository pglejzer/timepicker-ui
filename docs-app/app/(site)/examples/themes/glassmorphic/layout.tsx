import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Glassmorphic Theme Example",
  description:
    "Glassmorphic theme for timepicker-ui - a frosted-glass, blurred analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/themes/glassmorphic",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/glassmorphic" />
      {children}
    </>
  );
}
