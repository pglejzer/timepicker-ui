import type { KeyboardEvent, ReactNode } from "react";
import styles from "./TabButton.module.css";

export function TabButton({
  active,
  id,
  controls,
  tabIndex,
  onClick,
  onKeyDown,
  buttonRef,
  children,
}: {
  active: boolean;
  id?: string;
  controls?: string;
  tabIndex?: number;
  onClick: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef?: (node: HTMLButtonElement | null) => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={controls}
      aria-selected={active}
      tabIndex={tabIndex}
      ref={buttonRef}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={styles.tab}
    >
      {children}
    </button>
  );
}
