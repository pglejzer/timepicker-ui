import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Disabled Time Example",
  description:
    "Disabled time example - block specific hours, minutes or intervals in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste code.",
  path: "/examples/features/disabled-time",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/disabled-time" />
      {children}
    </>
  );
}
