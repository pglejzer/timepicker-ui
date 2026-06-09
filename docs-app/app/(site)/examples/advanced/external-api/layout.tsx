import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "External API Control Example",
  description:
    "External API example - drive the time picker programmatically via the public API in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  alternates: {
    canonical: "/examples/advanced/external-api",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/external-api" />
      {children}
    </>
  );
}
