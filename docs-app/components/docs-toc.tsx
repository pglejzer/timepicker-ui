"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { List } from "lucide-react";

type Heading = { id: string; text: string; level: number };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function useHeadings() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById("doc-content");
    if (!root) return;

    const nodes = Array.from(
      root.querySelectorAll<HTMLHeadingElement>("h2, h3"),
    );
    const used = new Set<string>();
    const items: Heading[] = nodes.map((node) => {
      let id = node.id || slugify(node.textContent ?? "");
      while (used.has(id)) id = `${id}-1`;
      used.add(id);
      if (!node.id) node.id = id;
      node.style.scrollMarginTop = "5.5rem";
      return {
        id,
        text: node.textContent ?? "",
        level: node.tagName === "H3" ? 3 : 2,
      };
    });
    // The heading list is measured from already-rendered DOM content (server
    // MDX), so there is no render-time source to derive it from - this read can
    // only happen in an effect after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM-measured headings have no render-time source
    setHeadings(items);
    setActive((prev) => prev || items[0]?.id || "");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [pathname]);

  return { headings, active };
}

function jump(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    // Move focus to the target heading so keyboard / screen-reader users land
    // on it. Headings aren't focusable by default, so add a programmatic-only
    // tabindex (-1 keeps them out of the tab order).
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

/** Sticky right rail - desktop only (xl+). */
export function DocsToc() {
  const { headings, active } = useHeadings();
  if (headings.length < 2) return null;

  return (
    <nav className="app-scroll sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden">
      <p className="eyebrow mb-4">On this page</p>
      <ul className="space-y-1 border-l border-border">
        {headings.map((h) => (
          <li key={h.id} className="min-w-0">
            <button
              onClick={() => jump(h.id)}
              title={h.text}
              className={`-ml-px block w-full min-w-0 truncate border-l-2 py-1 text-left text-sm transition-colors ${
                h.level === 3 ? "pl-6" : "pl-4"
              } ${
                active === h.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Collapsible "On this page" - shown above content below xl. */
export function DocsTocInline() {
  const { headings, active } = useHeadings();
  const [open, setOpen] = useState(false);
  if (headings.length < 2) return null;

  return (
    <div className="mb-8 rounded-lg border border-border xl:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium"
        aria-expanded={open}
      >
        <List className="h-4 w-4 text-muted-foreground" />
        On this page
        <span className="eyebrow ml-auto">
          {open ? "hide" : String(headings.length)}
        </span>
      </button>
      {open && (
        <ul className="border-t border-border px-2 py-2">
          {headings.map((h) => (
            <li key={h.id} className="min-w-0">
              <button
                onClick={() => {
                  setOpen(false);
                  jump(h.id);
                }}
                title={h.text}
                className={`block w-full min-w-0 truncate rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  h.level === 3 ? "pl-6" : ""
                } ${
                  active === h.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

