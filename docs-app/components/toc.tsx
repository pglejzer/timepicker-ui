"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { findNavMeta, type NavSection } from "@/lib/nav";
import { slugify } from "@/lib/slugify";
import styles from "./toc.module.css";

type Heading = { id: string; text: string; level: number };

function useHeadings() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const root = document.getElementById("doc-content");
    if (!root) return;

    const depth = root.querySelector<HTMLElement>("[data-toc-depth]")?.dataset.tocDepth;
    const nodes = Array.from(root.querySelectorAll<HTMLHeadingElement>(depth === "2" ? "h2" : "h2, h3"));
    const used = new Set<string>();
    const items: Heading[] = nodes.map((node) => {
      let id = node.id || slugify(node.textContent ?? "");
      while (used.has(id)) id = `${id}-1`;
      used.add(id);
      if (!node.id) node.id = id;
      return { id, text: node.textContent ?? "", level: node.tagName === "H3" ? 3 : 2 };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- headings are read from rendered DOM, so they only exist after mount
    setHeadings(items);
    setActive((prev) => prev || items[0]?.id || "");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return { headings, active };
}

function jump(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

function HeadingList({
  headings,
  active,
  onJump,
}: {
  headings: Heading[];
  active: string;
  onJump?: () => void;
}) {
  return (
    <ul className={styles.list}>
      {headings.map((heading) => (
        <li key={heading.id}>
          <button
            type="button"
            className={styles.item}
            data-level={heading.level}
            aria-current={active === heading.id ? "true" : undefined}
            onClick={() => {
              onJump?.();
              jump(heading.id);
            }}
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function Toc() {
  const { headings, active } = useHeadings();
  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className={styles.rail}>
      <p className={styles.title}>On this page</p>
      <HeadingList headings={headings} active={active} />
    </nav>
  );
}

export function TocBar({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname() ?? "";
  const { headings, active } = useHeadings();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const { section, title } = findNavMeta(sections, pathname);
  const trail = [section, title].filter(Boolean).join(" / ");

  if (!trail && headings.length < 2) return null;

  return (
    <div className={styles.bar}>
      <span className={styles.trail}>{trail}</span>
      {headings.length >= 2 && (
        <details ref={detailsRef} className={styles.disclosure}>
          <summary className={styles.summary}>On this page</summary>
          <nav aria-label="On this page" className={styles.panel}>
            <HeadingList
              headings={headings}
              active={active}
              onJump={() => {
                if (detailsRef.current) detailsRef.current.open = false;
              }}
            />
          </nav>
        </details>
      )}
    </div>
  );
}
