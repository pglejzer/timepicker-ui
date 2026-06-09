import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Validation Example",
  description:
    "Validation example - enforce allowed times and show errors in timepicker-ui. Zero-dependency, framework-agnostic, accessible and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/advanced/validation",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/validation" />
      {children}
    </>
  );
}
