import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Bundle Size Analysis",
  description:
    "Bundle size analysis for timepicker-ui - see the zero-dependency core and tree-shakeable range, timezone and wheel plugins measured gzipped per entry point.",
  path: "/bundle-stats",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/bundle-stats" />
      {children}
    </>
  );
}
