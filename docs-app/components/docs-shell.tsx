import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { NavTree } from "@/components/nav-tree";
import { Pager } from "@/components/pager";
import { Toc, TocBar } from "@/components/toc";
import type { NavSection } from "@/lib/nav";
import styles from "./docs-shell.module.css";

type DocsShellProps = {
  nav: NavSection[];
  navLabel: string;
  withBreadcrumb?: boolean;
  withPager?: boolean;
  children: ReactNode;
};

export function DocsShell({ nav, navLabel, withBreadcrumb = false, withPager = false, children }: DocsShellProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <nav aria-label={navLabel} className={styles.sidebarInner}>
          <NavTree sections={nav} />
        </nav>
      </aside>
      <main id="main-content" className={styles.main}>
        <TocBar sections={nav} />
        {withBreadcrumb && <Breadcrumb />}
        <article id="doc-content" className={styles.article}>
          {children}
        </article>
        {withPager && <Pager />}
      </main>
      <aside className={styles.toc}>
        <Toc />
      </aside>
    </div>
  );
}
