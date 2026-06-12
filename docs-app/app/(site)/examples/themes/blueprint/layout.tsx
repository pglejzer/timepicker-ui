import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Blueprint Theme Example",
  description:
    "Blueprint theme for timepicker-ui, a light technical look with a cobalt accent and hairline borders. Zero-dependency, SSR-safe, with copy-paste example code.",
  alternates: {
    canonical: "/examples/themes/blueprint",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/blueprint" />
      {children}
    </>
  );
}
