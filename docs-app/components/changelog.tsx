import type { ReactNode } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";
import styles from "./changelog.module.css";

export type ChangeEntry = string | { title: string; description?: ReactNode };

const GROUP_ORDER = ["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"] as const;

export type ChangeGroup = (typeof GROUP_ORDER)[number];

export type ReleaseNotes = {
  title: string;
  changes: Partial<Record<ChangeGroup, ChangeEntry[]>>;
};

export type ChangelogPackage = "library" | "react" | "mcp";

const PACKAGES: { id: ChangelogPackage; label: string; href: string }[] = [
  { id: "library", label: "Library", href: "/docs/changelog" },
  { id: "react", label: "React", href: "/docs/changelog/react" },
  { id: "mcp", label: "MCP server", href: "/docs/changelog/mcp" },
];

const INLINE_MARKUP = /(`[^`]+`|\*\*[^*]+\*\*)/;

function renderInline(part: string, index: number): ReactNode {
  if (index % 2 === 0) return part;
  if (part.startsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
  return <strong key={index}>{part.slice(2, -2)}</strong>;
}

function withMarkup(text: ReactNode): ReactNode {
  if (typeof text !== "string" || !INLINE_MARKUP.test(text)) return text;
  return text.split(INLINE_MARKUP).map(renderInline);
}

function ChangeItem({ entry }: { entry: ChangeEntry }) {
  if (typeof entry === "string") return <li>{withMarkup(entry)}</li>;

  return (
    <li>
      <strong>{withMarkup(entry.title)}</strong>
      {entry.description && <> - {withMarkup(entry.description)}</>}
    </li>
  );
}

export function ChangeSection({
  label,
  breaking = false,
  items,
}: {
  label: string;
  breaking?: boolean;
  items: ChangeEntry[];
}) {
  return (
    <>
      <h3 className={styles.category}>
        {breaking ? (
          <strong className={styles.breaking}>{label}</strong>
        ) : (
          label
        )}
      </h3>
      <ul>
        {items.map((entry) => (
          <ChangeItem key={typeof entry === "string" ? entry : entry.title} entry={entry} />
        ))}
      </ul>
    </>
  );
}

export function Release({ title, children }: { title: string; children: ReactNode }) {
  const anchor = slugify(title);
  const [version, ...rest] = title.split(" - ");
  const date = rest.join(" - ");

  return (
    <section className={styles.release}>
      <h2 id={anchor} className={styles.version}>
        <a href={`#${anchor}`} className={styles.stamp}>
          <span className={styles.number}>{version}</span>
          {date && (
            <>
              <span className="sr-only">{" - "}</span>
              <span className={styles.date}>{date}</span>
            </>
          )}
        </a>
      </h2>
      <div className={styles.entries}>{children}</div>
    </section>
  );
}

export function ReleaseList({ releases }: { releases: ReleaseNotes[] }) {
  return (
    <>
      {releases.map((release) => (
        <Release key={release.title} title={release.title}>
          {GROUP_ORDER.map((group) => {
            const items = release.changes[group];
            return items ? <ChangeSection key={group} label={group} items={items} /> : null;
          })}
        </Release>
      ))}
    </>
  );
}

export function ChangelogSwitcher({ current }: { current: ChangelogPackage }) {
  return (
    <nav aria-label="Changelogs" className={styles.switcher}>
      <ul className={styles.packages}>
        {PACKAGES.map((item, index) => (
          <li key={item.id}>
            {index > 0 && (
              <span aria-hidden="true" className={styles.separator}>
                ·
              </span>
            )}
            <Link
              href={item.href}
              className={styles.package}
              aria-current={item.id === current ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
