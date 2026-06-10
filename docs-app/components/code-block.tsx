"use client";

import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useDarkMode } from "@/lib/use-dark-mode";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  filename?: string;
}

// Collapse threshold: snippets longer than this (in lines) get a max-height,
// a fade mask, and a Show more / Show less toggle. Short snippets render whole.
const COLLAPSE_AFTER_LINES = 18;

export function CodeBlock({
  code,
  language,
  showLineNumbers,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isDark = useDarkMode();

  const trimmed = code.trim();
  const lineCount = trimmed.split("\n").length;
  const collapsible = lineCount > COLLAPSE_AFTER_LINES;
  const isCollapsed = collapsible && !expanded;

  // Default line numbers on for multi-line snippets; honor an explicit prop.
  const withLineNumbers = showLineNumbers ?? lineCount > 1;

  // Theme-aware prism palette. Backgrounds are driven by the --code-bg token,
  // so we only consume token colors from the prism theme, never its surface.
  const prismTheme = isDark ? themes.nightOwl : themes.oneLight;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-code-bg shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          {/* Hairline window cue */}
          <span
            className="hidden items-center gap-1.5 sm:inline-flex"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full border border-border" />
            <span className="h-2 w-2 rounded-full border border-border" />
            <span className="h-2 w-2 rounded-full border border-border" />
          </span>
          <span className="truncate font-mono text-xs text-muted-foreground">
            {filename ?? `index.${language === "typescript" ? "ts" : language}`}
          </span>
          <span className="shrink-0 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? "Code copied to clipboard" : ""}
        </span>
      </div>

      {/* Code surface */}
      <div className="relative">
        <div
          className={`bench-scroll overflow-x-auto ${
            isCollapsed ? "bench-code-fade max-h-96 overflow-y-hidden" : ""
          }`}
        >
          <Highlight theme={prismTheme} code={trimmed} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-4 font-mono text-[13px] leading-relaxed`}
                style={{ ...style, backgroundColor: "transparent" }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {withLineNumbers && (
                      <span className="mr-4 inline-block w-6 select-none text-right text-muted-foreground/40">
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
          <div
            className={`flex justify-center ${
              isCollapsed
                ? "absolute inset-x-0 bottom-0 pb-2 pt-8"
                : "border-t border-border py-2"
            }`}
          >
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1 font-mono text-xs text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  Show {lineCount} lines
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
