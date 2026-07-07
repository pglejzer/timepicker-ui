import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Custom Container Example",
  description:
    "Custom container example - mount the time picker inside any DOM element in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with example code.",
  path: "/examples/advanced/custom-container",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/custom-container" />
      {children}
    </>
  );
}
