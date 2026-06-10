"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDocPager } from "@/lib/docs-nav";

export function DocsPager() {
  const pathname = usePathname() ?? "";
  const { prev, next } = getDocPager(pathname);

  if (!prev && !next) return null;

  return (
    <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
        >
          <span className="eyebrow flex items-center gap-1.5">
            <ArrowLeft className="h-3 w-3" />
            Previous
          </span>
          <span className="font-medium transition-colors group-hover:text-primary">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:border-primary/50"
        >
          <span className="eyebrow flex items-center gap-1.5">
            Next
            <ArrowRight className="h-3 w-3" />
          </span>
          <span className="font-medium transition-colors group-hover:text-primary">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
