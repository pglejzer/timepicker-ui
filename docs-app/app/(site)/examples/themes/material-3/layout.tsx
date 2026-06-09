import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Material 3 Green Theme Example",
  description:
    "Material 3 (Material You) green theme for timepicker-ui - a modern analog clock time picker. Zero-dependency, framework-agnostic and SSR-safe, with code.",
  alternates: {
    canonical: "/examples/themes/material-3",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/material-3" />
      {children}
    </>
  );
}
