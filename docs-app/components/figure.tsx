"use client";

import { useId, useState, type ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { CopyButton } from "@/components/copy-button";
import styles from "./figure.module.css";

export type FigureProps = {
  caption?: ReactNode;
  label?: string;
  code?: string;
  language?: string;
  controls?: ReactNode;
  status?: ReactNode;
  scene?: "default" | "phone";
  tone?: "light";
  codeOpen?: boolean;
  children: ReactNode;
};

export function Figure({
  caption,
  label,
  code,
  language = "typescript",
  controls,
  status,
  scene = "default",
  tone,
  codeOpen = true,
  children,
}: FigureProps) {
  const [open, setOpen] = useState(codeOpen);
  const codeId = useId();

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.bar}>
        <span className={styles.caption}>
          <span className={styles.label}>{label}</span>
          {caption}
        </span>
        {status && <span className={styles.status}>{status}</span>}
        <span className={styles.tools}>
          {controls}
          {code && (
            <button
              type="button"
              className={styles.tool}
              aria-expanded={open}
              aria-controls={codeId}
              onClick={() => setOpen((value) => !value)}
            >
              Code
            </button>
          )}
          {code && <CopyButton text={code.trim()} />}
        </span>
      </figcaption>
      <div className={styles.scene} data-scene={scene} data-tone={tone}>
        {children}
      </div>
      {code && (
        <div id={codeId} className={styles.code} hidden={!open}>
          <CodeBlock code={code} language={language} bare />
        </div>
      )}
    </figure>
  );
}
