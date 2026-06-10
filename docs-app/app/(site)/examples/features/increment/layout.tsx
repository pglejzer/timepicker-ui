import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Increment Steps Example",
  description:
    "Increment steps example - set minute step intervals (5, 10, 15…) in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste code.",
  alternates: {
    canonical: "/examples/features/increment",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/increment" />
      {children}
    </>
  );
}
