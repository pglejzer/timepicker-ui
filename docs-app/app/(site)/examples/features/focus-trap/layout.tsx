import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Focus Trap Example",
  description:
    "Focus trap example - keep keyboard focus inside the open time picker modal in timepicker-ui. Accessible, zero-dependency and SSR-safe, with copy-paste code.",
  path: "/examples/features/focus-trap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/examples/features/focus-trap" />
      {children}
    </>
  );
}
