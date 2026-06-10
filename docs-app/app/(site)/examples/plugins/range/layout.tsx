import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Range Plugin Example",
  description:
    "Time range picker example - select start and end times with the tree-shakeable range plugin in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe.",
  alternates: {
    canonical: "/examples/plugins/range",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/plugins/range" />
      {children}
    </>
  );
}
