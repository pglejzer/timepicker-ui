"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function InstallCommand({
  command = "npm install timepicker-ui",
}: {
  command?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-3 rounded-md border border-border bg-muted/40 px-4 py-2.5 font-mono text-sm transition-colors hover:bg-muted"
      aria-label="Copy install command"
    >
      <span className="select-none text-primary">$</span>
      <span className="text-foreground">{command}</span>
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      )}
    </button>
  );
}
