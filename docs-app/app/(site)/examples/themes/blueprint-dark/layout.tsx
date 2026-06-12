import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Blueprint Dark Theme Example",
  description:
    "Blueprint Dark theme for timepicker-ui, the dark variant of the blueprint look. Zero-dependency, framework-agnostic time picker with copy-paste example code.",
  alternates: {
    canonical: "/examples/themes/blueprint-dark",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/blueprint-dark" />
      {children}
    </>
  );
}
