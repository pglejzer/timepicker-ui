import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ExamplesSidebar } from "@/components/examples-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { DocsToc, DocsTocInline } from "@/components/docs-toc";

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
    <div className="container mx-auto flex-1 px-4 py-6 sm:px-6 md:py-8">
      <MobileSidebar>
        <ExamplesSidebar />
      </MobileSidebar>

      <div className="flex gap-8 lg:gap-10 xl:gap-12">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="app-scroll sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden pb-8">
            <ExamplesSidebar />
          </div>
        </aside>

        <main id="main-content" className="min-w-0 flex-1 xl:max-w-3xl">
          <DocsTocInline />
          <div id="doc-content">{children}</div>
        </main>

        <aside className="hidden w-56 shrink-0 xl:block">
          <DocsToc />
        </aside>
      </div>
    </div>
  );
}

