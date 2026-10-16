import data from "@/lib/generated/css-reference.json";

export type CssVariableGroup =
  | "Color"
  | "Typography"
  | "Size"
  | "Spacing"
  | "Shape"
  | "Focus"
  | "Elevation"
  | "Motion"
  | "State"
  | "Backdrop"
  | "Wheel"
  | "Popover"
  | "Range"
  | "Timezone"
  | "Mobile"
  | "Other";

export type CssVariable = {
  name: string;
  group: CssVariableGroup;
  /** `:root` value, else the first rule-level value, else the first `var()` fallback. */
  default: string | null;
  /** Declared in `main.css`, in `:root` or in a rule. */
  declared: boolean;
  /** `tp-ui` classes of the rules that read it. Classes inside `:not()` and `:has()` are left out. */
  usedBy: string[];
  /** `data-*` attributes of rules that read it and have no `tp-ui` class, such as `data-md3-ripple`. */
  usedByAttributes: string[];
  /** Variables whose value reads this one through `var()`. */
  referencedBy: string[];
  setByScript: boolean;
  /** Read through `var()` by `main.css` or a theme file, including fallbacks and other variables' values. */
  read: boolean;
};

export type CssClass = { name: string; example: string };

export type CssTheme = {
  name: string;
  /** `--tp-bg`, `--tp-primary`, `--tp-surface` and `--tp-text` with `var()` resolved. A token the theme does not set comes from `main.css` `:root`. */
  tokens: Record<string, string>;
};

export type CssReference = {
  package: string;
  version: string;
  groups: CssVariableGroup[];
  variables: CssVariable[];
  classes: CssClass[];
  modifiers: CssClass[];
  themes: CssTheme[];
};

export const cssReference = data as unknown as CssReference;

const themeTokenMap = new Map((cssReference.themes ?? []).map((theme) => [theme.name, theme.tokens]));

export function themeTokens(name: string): Record<string, string> {
  return themeTokenMap.get(name) ?? {};
}

export function isColorValue(value: string | null): boolean {
  return value !== null && /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(value);
}
