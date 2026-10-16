import type { ReactNode } from "react";
import styles from "./callout.module.css";

export type CalloutTone = "note" | "tip" | "warning" | "danger";

const LABEL: Record<CalloutTone, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  danger: "Danger",
};

type CalloutProps = { tone?: CalloutTone; title?: string; children: ReactNode };

export function Callout({ tone = "note", title, children }: CalloutProps) {
  return (
    <div role="note" className={styles.callout} data-tone={tone}>
      <p className={styles.label}>{title ?? LABEL[tone]}</p>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
