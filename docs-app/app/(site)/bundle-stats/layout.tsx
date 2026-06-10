import type { Metadata } from "next";
import { JsonLdBreadcrumb } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Bundle Size Analysis",
  description:
    "Bundle size analysis for timepicker-ui - see the zero-dependency core and tree-shakeable range, timezone and wheel plugins measured gzipped per entry point.",
  alternates: {
    canonical: "/bundle-stats",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdBreadcrumb pathname="/bundle-stats" />
      {children}
    </>
  );
}
