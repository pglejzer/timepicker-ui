"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { findDocMeta } from "@/lib/docs-nav";

export function DocsBreadcrumb() {
  const pathname = usePathname() ?? "";
  const { section, title } = findDocMeta(pathname);

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap font-mono text-xs text-muted-foreground"
    >
      <Link href="/docs" className="transition-colors hover:text-foreground">
        Docs
      </Link>
      {section && (
        <>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
          <span className="opacity-70">{section}</span>
        </>
      )}
      {title && (
        <>
          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
          <span className="text-foreground">{title}</span>
        </>
      )}
    </nav>
  );
}
