import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Multiple Pickers Example",
  description:
    "Multiple time pickers example - run several independent timepicker-ui instances on one page. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  alternates: {
    canonical: "/examples/advanced/multiple",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/multiple" />
      {children}
    </>
  );
}
