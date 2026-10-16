"use client";

import { useEffect, useState } from "react";
import styles from "./copy-button.module.css";

type CopyButtonProps = { text: string; label?: string };

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.button}
        data-copied={copied ? "" : undefined}
        onClick={copy}
      >
        {copied ? "Copied" : label}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
