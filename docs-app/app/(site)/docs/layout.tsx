import { DocsShell } from "@/components/docs-shell";
import { docsNav } from "@/lib/nav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={docsNav} navLabel="Documentation" withBreadcrumb withPager>
      {children}
    </DocsShell>
  );
}
