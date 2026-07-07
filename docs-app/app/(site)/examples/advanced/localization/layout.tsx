import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Localization Example",
  description:
    "Localization example - translate the time picker UI for any language in timepicker-ui. Zero-dependency, framework-agnostic and SSR-safe, with copy-paste code.",
  path: "/examples/advanced/localization",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/advanced/localization" />
      {children}
    </>
  );
}
