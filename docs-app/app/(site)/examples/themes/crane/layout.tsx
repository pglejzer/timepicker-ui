import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Crane Theme Example",
  description:
    "The Crane theme for timepicker-ui - a rounded, Material-inspired analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/themes/crane",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/crane" />
      {children}
    </>
  );
}
