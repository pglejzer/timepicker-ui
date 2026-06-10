"use client";

import { DocsSidebar } from "@/components/docs-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { DocsToc, DocsTocInline } from "@/components/docs-toc";
import { DocsBreadcrumb } from "@/components/docs-breadcrumb";
import { DocsPager } from "@/components/docs-pager";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex-1 px-4 py-6 sm:px-6 md:py-8">
      <MobileSidebar>
        <DocsSidebar />
      </MobileSidebar>

      <div className="flex gap-8 lg:gap-10 xl:gap-12">
        {/* Left: navigation */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="app-scroll sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden pb-8">
            <DocsSidebar />
          </div>
        </aside>

        {/* Center: content */}
        <main id="main-content" className="min-w-0 flex-1 xl:max-w-3xl">
          <DocsBreadcrumb />
          <DocsTocInline />
          <article id="doc-content" className="prose">
            {children}
          </article>
          <DocsPager />
        </main>

        {/* Right: table of contents */}
        <aside className="hidden w-56 shrink-0 xl:block">
          <DocsToc />
        </aside>
      </div>
    </div>
  );
}
