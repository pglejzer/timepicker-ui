import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Smooth Hour Snap Example",
  description:
    "Smooth hour snap example - fluid analog clock hand snapping in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste example code.",
  path: "/examples/features/smooth-hour-snap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/smooth-hour-snap" />
      {children}
    </>
  );
}
