"use client";

import { Highlight } from "prism-react-renderer";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { inkTheme } from "@/lib/prism-ink-theme";
import styles from "./code-block.module.css";

type CodeBlockProps = {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  filename?: string;
  bare?: boolean;
};

const COLLAPSE_AFTER_LINES = 18;

const EXTENSION: Record<string, string> = {
  typescript: "ts",
  javascript: "js",
  tsx: "tsx",
  jsx: "jsx",
  bash: "sh",
  shell: "sh",
  css: "css",
  html: "html",
  markup: "html",
  json: "json",
};

export function CodeBlock({ code, language, showLineNumbers, filename, bare = false }: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const trimmed = code.trim();
  const lineCount = trimmed.split("\n").length;
  const collapsible = lineCount > COLLAPSE_AFTER_LINES;
  const collapsed = collapsible && !expanded;
  const withLineNumbers = showLineNumbers ?? lineCount > 1;
  const name = filename ?? `index.${EXTENSION[language] ?? language}`;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new ResizeObserver(() => {
      setScrollable(scroller.scrollWidth > scroller.clientWidth);
    });
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [trimmed, withLineNumbers]);

  return (
    <div className={bare ? styles.bare : styles.block}>
      {!bare && (
        <div className={styles.head}>
          <span className={styles.filename}>{name}</span>
          <CopyButton text={trimmed} />
        </div>
      )}
      <div className={styles.surface}>
        <div
          ref={scrollerRef}
          className={styles.scroller}
          data-collapsed={collapsed ? "" : undefined}
          tabIndex={scrollable ? 0 : undefined}
          role={scrollable ? "region" : undefined}
          aria-label={scrollable ? `${name} code` : undefined}
        >
          <Highlight theme={inkTheme} code={trimmed} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} ${styles.pre}`} style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {withLineNumbers && (
                      <span className={styles.number} aria-hidden="true">
                        {i + 1}
                      </span>
                    )}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
        {collapsible && (
          <div className={styles.toggle}>
            <button
              type="button"
              className={styles.toggleButton}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show less" : `Show all ${lineCount} lines`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
