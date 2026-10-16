import type { PrismTheme } from "prism-react-renderer";

export const inkTheme: PrismTheme = {
  plain: { color: "var(--ink)", backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "var(--ink-3)", fontStyle: "italic" } },
    { types: ["keyword", "boolean", "null", "nil", "important", "atrule", "rule", "tag", "selector"], style: { fontWeight: "700" } },
    { types: ["string", "char", "attr-value", "template-string", "regex", "url"], style: { color: "var(--ink-2)" } },
    { types: ["number"], style: { fontWeight: "500" } },
    { types: ["punctuation", "operator"], style: { color: "var(--ink-3)" } },
    { types: ["deleted"], style: { color: "var(--danger)" } },
  ],
};
