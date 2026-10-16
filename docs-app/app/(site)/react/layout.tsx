import { DocsShell } from "@/components/docs-shell";
import { reactNav } from "@/lib/nav";

export default function ReactLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={reactNav} navLabel="React">
      {children}
    </DocsShell>
  );
}
