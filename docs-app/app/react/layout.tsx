"use client";

import { ReactSidebar } from "@/components/react-sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";

export default function ReactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto flex-1 px-4 py-6 md:px-6 md:py-8">
      <MobileSidebar>
        <ReactSidebar />
      </MobileSidebar>
      <div className="flex flex-col gap-6 md:flex-row md:gap-8 lg:gap-12">
        <aside className="hidden md:block md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-y-auto">
          <ReactSidebar />
        </aside>
        <main className="min-w-0 flex-1 max-w-4xl">{children}</main>
      </div>
    </div>
  );
}
