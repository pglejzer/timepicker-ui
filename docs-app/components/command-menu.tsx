"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { Logo } from "@/components/logo";

type CommandItem = {
  group: string;
  label: string;
  href: string;
  keywords?: string;
};

const COMMANDS: CommandItem[] = [
  // Getting started
  {
    group: "Getting Started",
    label: "Installation",
    href: "/docs/installation",
    keywords: "npm yarn pnpm setup",
  },
  { group: "Getting Started", label: "Quick Start", href: "/docs/quick-start" },
  {
    group: "Getting Started",
    label: "Configuration",
    href: "/docs/configuration",
    keywords: "options config",
  },
  {
    group: "Getting Started",
    label: "Migration Guide v3 to v4",
    href: "/docs/migration-guide",
  },
  {
    group: "Getting Started",
    label: "What's New",
    href: "/docs/whats-new",
    keywords: "changelog release",
  },
  // API
  { group: "API Reference", label: "Options", href: "/docs/api/options" },
  { group: "API Reference", label: "Methods", href: "/docs/api/methods" },
  { group: "API Reference", label: "Events", href: "/docs/api/events" },
  {
    group: "API Reference",
    label: "TypeScript",
    href: "/docs/api/typescript",
    keywords: "types ts",
  },
  // Features
  {
    group: "Features",
    label: "12h / 24h Format",
    href: "/docs/features/clock-format",
  },
  {
    group: "Features",
    label: "Themes",
    href: "/docs/features/themes",
    keywords: "dark crane material cyberpunk",
  },
  {
    group: "Features",
    label: "Inline Mode",
    href: "/docs/features/inline-mode",
  },
  {
    group: "Features",
    label: "Mobile Support",
    href: "/docs/features/mobile",
    keywords: "touch",
  },
  {
    group: "Features",
    label: "Disabled Time",
    href: "/docs/features/disabled-time",
  },
  {
    group: "Features",
    label: "Clear Button",
    href: "/docs/features/clear-button",
  },
  { group: "Features", label: "Validation", href: "/docs/features/validation" },
  {
    group: "Features",
    label: "Plugins",
    href: "/docs/features/plugins",
    keywords: "range timezone wheel",
  },
  // Advanced
  {
    group: "Advanced",
    label: "Custom Styling",
    href: "/docs/advanced/styling",
    keywords: "css variables",
  },
  {
    group: "Advanced",
    label: "Localization",
    href: "/docs/advanced/localization",
    keywords: "i18n labels",
  },
  {
    group: "Advanced",
    label: "Accessibility",
    href: "/docs/advanced/accessibility",
    keywords: "a11y aria",
  },
  // Project
  {
    group: "Project",
    label: "Bundle Analysis",
    href: "/bundle-stats",
    keywords: "size kb",
  },
  { group: "Project", label: "Roadmap", href: "/docs/roadmap" },
  { group: "Project", label: "Changelog", href: "/docs/changelog" },

  // Examples
  { group: "Examples", label: "All Examples", href: "/examples" },
  {
    group: "Examples",
    label: "Getting Started",
    href: "/examples/basic/getting-started",
  },
  {
    group: "Examples",
    label: "12h Format",
    href: "/examples/basic/12h-format",
  },
  {
    group: "Examples",
    label: "24h Format",
    href: "/examples/basic/24h-format",
  },
  {
    group: "Examples",
    label: "Themes",
    href: "/examples/themes/basic",
    keywords: "dark crane material",
  },
  {
    group: "Examples",
    label: "Inline Mode",
    href: "/examples/features/inline-mode",
  },
  { group: "Examples", label: "Mobile", href: "/examples/features/mobile" },
  {
    group: "Examples",
    label: "Disabled Time",
    href: "/examples/features/disabled-time",
  },
  {
    group: "Examples",
    label: "Event Callbacks",
    href: "/examples/advanced/events",
  },
  { group: "Examples", label: "Range Plugin", href: "/examples/plugins/range" },
  { group: "Examples", label: "Wheel Plugin", href: "/examples/plugins/wheel" },
  {
    group: "Examples",
    label: "Timezone Plugin",
    href: "/examples/plugins/timezone",
  },

  // React
  {
    group: "React",
    label: "Introduction",
    href: "/react",
    keywords: "hook component wrapper",
  },
  { group: "React", label: "Installation", href: "/react/installation" },
  { group: "React", label: "Quick Start", href: "/react/quick-start" },
  { group: "React", label: "All React Examples", href: "/react/examples" },
  {
    group: "React",
    label: "Controlled Value",
    href: "/react/examples/controlled/value",
  },
  {
    group: "React",
    label: "All Events",
    href: "/react/examples/callbacks/all-events",
  },
  {
    group: "React",
    label: "Form Validation",
    href: "/react/examples/forms/validation",
  },
];

/** Top-level area a path belongs to - used to surface the current section first. */
function areaOf(path: string): "react" | "examples" | "docs" {
  if (path.startsWith("/react")) return "react";
  if (path.startsWith("/examples")) return "examples";
  return "docs";
}

export function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname() ?? "/docs";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? COMMANDS.filter((c) =>
          `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q),
        )
      : COMMANDS;
    // Surface the section the user is currently in first (stable order within).
    const current = areaOf(pathname);
    return [...matched].sort(
      (a, b) =>
        Number(areaOf(b.href) === current) - Number(areaOf(a.href) === current),
    );
  }, [query, pathname]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    lastFocused.current?.focus?.();
  }, []);

  const openMenu = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  // Global hotkey (Cmd/Ctrl+K) + header trigger event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) lastFocused.current = document.activeElement as HTMLElement;
          return !v;
        });
      }
    };
    const onTrigger = () => openMenu();
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onTrigger);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onTrigger);
    };
  }, [openMenu]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const select = useCallback(
    (item?: CommandItem) => {
      const target = item ?? results[active];
      if (!target) return;
      close();
      router.push(target.href);
    },
    [results, active, close, router],
  );

  const dialogRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select();
    } else if (e.key === "Tab") {
      // Trap focus within the dialog.
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // keep the active row in view
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  let lastGroup = "";
  const activeOptionId =
    results.length > 0 && results[active]
      ? `command-option-${active}`
      : undefined;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
    >
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 cursor-default bg-background/70 backdrop-blur-sm"
        onClick={close}
      />
      <div
        ref={dialogRef}
        className="reveal relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl shadow-black/20"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search documentation…"
            className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={activeOptionId}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          id="command-results"
          role="listbox"
          aria-label="Search results"
          className="app-scroll max-h-[52vh] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <div className="px-3 py-8 text-center font-mono text-xs text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((item, i) => {
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              const isActive = i === active;
              return (
                <div key={item.href}>
                  {showGroup && (
                    <div className="eyebrow px-3 pb-1 pt-3">{item.group}</div>
                  )}
                  <button
                    type="button"
                    role="option"
                    id={`command-option-${i}`}
                    aria-selected={isActive}
                    data-index={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => select(item)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <CornerDownLeft className="h-3.5 w-3.5 opacity-70" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            <ArrowDown className="h-3 w-3" />
            navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" />
            open
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Logo className="h-3.5 w-3.5" />
            timepicker-ui
          </span>
        </div>
      </div>
    </div>
  );
}

