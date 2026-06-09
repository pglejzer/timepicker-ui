"use client";

import { ReactSidebar } from "@/components/react-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { DocsToc, DocsTocInline } from "@/components/docs-toc";

export default function ReactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex-1 px-4 py-6 sm:px-6 md:py-8">
      <MobileSidebar>
        <ReactSidebar />
      </MobileSidebar>

      <div className="flex gap-8 lg:gap-10 xl:gap-12">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="app-scroll sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden pb-8">
            <ReactSidebar />
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
