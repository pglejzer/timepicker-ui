import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Event Callbacks Example",
  description:
    "Event callbacks example - hook into open, confirm, cancel and selection events in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  alternates: {
    canonical: "/examples/advanced/events",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/events" />
      {children}
    </>
  );
}
