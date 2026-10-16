"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { SearchIcon } from "@/components/icons";
import { areaOf, searchItems, type SearchItem } from "@/lib/nav";
import styles from "./command-menu.module.css";

const ITEMS = searchItems();

type Group = { name: string; entries: { item: SearchItem; index: number }[] };

function groupResults(results: SearchItem[]): Group[] {
  const groups: Group[] = [];
  results.forEach((item, index) => {
    const last = groups[groups.length - 1];
    if (last && last.name === item.group) last.entries.push({ item, index });
    else groups.push({ name: item.group, entries: [{ item, index }] });
  });
  return groups;
}

export function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname() ?? "/docs";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = q
      ? ITEMS.filter((item) =>
          `${item.title} ${item.group} ${item.keywords ?? ""}`.toLowerCase().includes(q),
        )
      : ITEMS;
    const current = areaOf(pathname);
    return [...found].sort((a, b) => Number(b.area === current) - Number(a.area === current));
  }, [query, pathname]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    const root = document.documentElement;
    root.style.setProperty("--page-scrollbar", `${window.innerWidth - root.clientWidth}px`);
    dialog.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", open);
    };
  }, [open, close]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item?: SearchItem) => {
    const target = item ?? results[active];
    if (!target) return;
    close();
    router.push(target.href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.max(0, Math.min(index + 1, results.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go();
    }
  };

  const activeId = results[active] ? `command-option-${active}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Search documentation"
      onClose={() => {
        setQuery("");
        setActive(0);
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.searchRow}>
          <SearchIcon size={18} />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search the docs"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            className={styles.input}
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>
        <div ref={listRef} id="command-results" role="listbox" aria-label="Results" className={styles.list}>
          {results.length === 0 ? (
            <p className={styles.empty}>No results for “{query}”</p>
          ) : (
            groupResults(results).map((group) => (
              <div key={group.name} role="group" aria-label={group.name}>
                <p className={styles.group} aria-hidden="true">
                  {group.name}
                </p>
                {group.entries.map(({ item, index }) => (
                  <button
                    key={item.href}
                    type="button"
                    role="option"
                    id={`command-option-${index}`}
                    aria-selected={index === active}
                    tabIndex={-1}
                    data-index={index}
                    className={styles.option}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(item)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
        <div className={styles.footer} aria-hidden="true">
          <span>↑ ↓ to move</span>
          <span>Enter to open</span>
          <span>Esc to close</span>
        </div>
      </div>
    </dialog>
  );
}
