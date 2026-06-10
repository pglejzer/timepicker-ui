import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Custom Styling Example",
  description:
    "Custom styling example - override CSS variables and tp-ui classes to restyle timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  alternates: {
    canonical: "/examples/advanced/custom-styling",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/custom-styling" />
      {children}
    </>
  );
}
