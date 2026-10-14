import type { KeyboardEvent } from "react";

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
  children: React.ReactNode;
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
      className={`relative flex h-10 shrink-0 items-center whitespace-nowrap px-1 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 -bottom-px h-0.5 transition-colors ${
          active ? "bg-primary" : "bg-transparent"
        }`}
      />
    </button>
  );
}
