import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Blueprint Dark Theme Example",
  description:
    "Blueprint Dark theme for timepicker-ui, the dark variant of the blueprint look. Zero-dependency, framework-agnostic time picker with copy-paste example code.",
  path: "/examples/themes/blueprint-dark",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/themes/blueprint-dark" />
      {children}
    </>
  );
}
