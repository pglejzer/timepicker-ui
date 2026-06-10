import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Editable Input Example",
  description:
    "Editable input time picker example - let users type the time directly in timepicker-ui. Zero-dependency, framework-agnostic, accessible and SSR-safe, with code.",
  alternates: {
    canonical: "/examples/features/editable",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/editable" />
      {children}
    </>
  );
}
