import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { DocsShell } from "@/components/docs-shell";
import { examplesNav } from "@/lib/nav";

// Server layout: carries the /examples section-index metadata (leaf routes
// override it via their own layouts). BreadcrumbList JSON-LD is emitted per
// leaf to avoid duplicate breadcrumbs on nested example pages.
// section: true re-establishes the branded title template for the whole
// /examples section, so leaf routes still render "<Leaf> - timepicker-ui".
export const metadata: Metadata = buildMetadata({
  title: "Examples",
  section: true,
  description:
    "Live, copy-paste timepicker-ui examples - analog clock, scroll wheel and compact-wheel modes, 12 themes, plugins and features. Zero-dependency and SSR-safe.",
  path: "/examples",
});

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsShell nav={examplesNav} navLabel="Examples">
      {children}
    </DocsShell>
  );
}

