import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Timezone Plugin Example",
  description:
    "Timezone picker example - a searchable timezone selector via the tree-shakeable timezone plugin in timepicker-ui. Zero-dependency and SSR-safe.",
  path: "/examples/plugins/timezone",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/plugins/timezone" />
      {children}
    </>
  );
}
