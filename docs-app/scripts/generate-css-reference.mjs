import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "..");
const pkgRoot = resolve(appRoot, "node_modules", "timepicker-ui");
const distDir = resolve(pkgRoot, "dist");
const cssDir = resolve(distDir, "css");
const outFile = resolve(appRoot, "lib", "generated", "css-reference.json");

const GROUP_RULES = [
  ["Wheel", /^--tp-wheel-/],
  ["Popover", /^--tp-popover-/],
  ["Range", /^--tp-range-/],
  ["Timezone", /^--tp-dropdown-/],
  ["Mobile", /^--tp-mobile-/],
  ["Focus", /^--tp-(outline-width|outline-offset|focus-ring|shadow-focus)/],
  ["Elevation", /^--tp-(shadow|z-)/],
  ["Backdrop", /^--tp-(backdrop|opacity-backdrop)/],
  ["State", /^--tp-(state-|opacity-|ripple)/],
  ["Motion", /^--tp-(duration|easing)-/],
  ["Typography", /^--tp-font-/],
  ["Size", /^--tp-size-/],
  ["Spacing", /^--tp-(spacing|gap|position|scrollbar)-/],
  ["Shape", /^--tp-(border-radius|border-width|radius-|btn-radius)/],
  ["Color", /^--tp-(bg|surface|input-bg|text|am-pm|primary|on-|outline$|outline-variant|tertiary|border$|hover-bg|error|btn-text)/],
];

const GROUP_ORDER = [
  "Color", "Typography", "Size", "Spacing", "Shape", "Focus", "Elevation", "Motion",
  "State", "Backdrop", "Wheel", "Popover", "Range", "Timezone", "Mobile", "Other",
];

const THEME_TOKENS = ["--tp-bg", "--tp-primary", "--tp-surface", "--tp-text"];
const MAX_VAR_DEPTH = 10;

const CLASS_PATTERN = /\.(tp-ui(?:-[a-z0-9-]+)?)(?![\w-])/g;
const CONDITION_PATTERN = /:(?:not|has)\(/g;

function groupOf(name) {
  const rule = GROUP_RULES.find(([, pattern]) => pattern.test(name));
  return rule ? rule[0] : "Other";
}

function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function rulesOf(css) {
  const rules = [];
  const stack = [];
  let buffer = "";
  for (const char of stripComments(css)) {
    if (char === "{") {
      stack.push(buffer.trim());
      buffer = "";
    } else if (char === "}") {
      const prelude = stack.pop() ?? "";
      const body = buffer.trim();
      if (body) rules.push({ selector: prelude, body, nested: stack.length > 0 });
      buffer = "";
    } else {
      buffer += char;
    }
  }
  return rules;
}

function fallbackAt(body, from) {
  let index = from;
  while (body[index] === " ") index += 1;
  if (body[index] !== ",") return null;
  let depth = 0;
  const start = index + 1;
  for (let end = start; end < body.length; end += 1) {
    const char = body[end];
    if (char === "(") depth += 1;
    if (char === ")") {
      if (depth === 0) return body.slice(start, end).trim();
      depth -= 1;
    }
  }
  return null;
}

function varUses(body) {
  const uses = [];
  const pattern = /var\(\s*(--tp-[a-z0-9-]+)/g;
  let match = pattern.exec(body);
  while (match) {
    uses.push({ name: match[1], fallback: fallbackAt(body, pattern.lastIndex) });
    match = pattern.exec(body);
  }
  return uses;
}

function declarations(body) {
  const result = [];
  const pattern = /(?:^|;)\s*(--tp-[a-z0-9-]+)\s*:\s*([^;]*)/g;
  let match = pattern.exec(body);
  while (match) {
    result.push({ name: match[1], value: match[2].trim() });
    match = pattern.exec(body);
  }
  return result;
}

function splitList(selector) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < selector.length; index += 1) {
    const char = selector[index];
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if (char === "," && depth === 0) {
      parts.push(selector.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(selector.slice(start).trim());
  return parts;
}

function withoutConditions(selector) {
  let result = "";
  let from = 0;
  for (const match of selector.matchAll(CONDITION_PATTERN)) {
    if (match.index < from) continue;
    result += selector.slice(from, match.index);
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < selector.length && depth > 0) {
      if (selector[index] === "(") depth += 1;
      if (selector[index] === ")") depth -= 1;
      index += 1;
    }
    from = index;
  }
  return result + selector.slice(from);
}

function isLibraryClass(name) {
  return name === "tp-ui" || name.startsWith("tp-ui-");
}

function classesIn(selector) {
  return [...selector.matchAll(CLASS_PATTERN)].map((m) => m[1]);
}

function modifiersIn(selector) {
  const found = [];
  for (const compound of selector.split(/[\s>+~]+/)) {
    if (classesIn(compound).length === 0) continue;
    for (const m of compound.matchAll(/\.([a-z][a-z0-9-]*)/g)) {
      if (!isLibraryClass(m[1])) found.push(m[1]);
    }
  }
  return found;
}

function dataAttributesIn(selector) {
  return [...selector.matchAll(/\[(data-[a-z0-9-]+)/g)].map((m) => m[1]);
}

function scriptVariables() {
  const pluginDir = resolve(distDir, "plugins");
  const plugins = readdirSync(pluginDir)
    .filter((name) => name.endsWith(".js") && !name.endsWith(".umd.js"))
    .sort()
    .map((name) => join(pluginDir, name));
  const names = new Set();
  for (const file of [resolve(distDir, "index.js"), ...plugins]) {
    for (const m of readFileSync(file, "utf8").matchAll(/--tp-[a-z0-9]+(?:-[a-z0-9]+)*/g)) {
      if (!m[0].startsWith("--tp-ui-")) names.add(m[0]);
    }
  }
  return [...names].sort();
}

function tokensFrom(css, matchesSelector) {
  const tokens = new Map();
  for (const { selector, body, nested } of rulesOf(css)) {
    const subject = selector.slice(selector.lastIndexOf(";") + 1);
    if (nested || !splitList(subject).some(matchesSelector)) continue;
    for (const { name, value } of declarations(body)) tokens.set(name, value);
  }
  return tokens;
}

function isThemeSelector(name) {
  return (part) => part.replace(/["'\s]/g, "") === `[data-theme=${name}]`;
}

function closingParen(value, open) {
  let depth = 0;
  for (let index = open; index < value.length; index += 1) {
    if (value[index] === "(") depth += 1;
    if (value[index] === ")") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function topLevelComma(value) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) return index;
  }
  return -1;
}

// layers: token maps from the innermost scope (the theme rule) to the outermost (`:root`).
// A `var()` resolves like the browser does: the innermost scope that sets the variable, then the fallback.
function lookupToken(layers, name, depth) {
  if (depth > MAX_VAR_DEPTH) return null;
  const index = layers.findIndex((layer) => layer.has(name));
  if (index === -1) return null;
  return substituteVars(layers[index].get(name), layers.slice(index), depth + 1);
}

function substituteVars(value, layers, depth) {
  let result = "";
  let from = 0;
  let start = value.indexOf("var(");
  while (start !== -1) {
    const end = closingParen(value, start + 3);
    if (end === -1) return null;
    const inner = value.slice(start + 4, end);
    const comma = topLevelComma(inner);
    const name = (comma === -1 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma === -1 ? null : inner.slice(comma + 1).trim();
    const resolved =
      lookupToken(layers, name, depth) ?? (fallback === null ? null : substituteVars(fallback, layers, depth + 1));
    if (resolved === null) return null;
    result += value.slice(from, start) + resolved;
    from = end + 1;
    start = value.indexOf("var(", from);
  }
  return (result + value.slice(from)).trim();
}

function pickThemeTokens(layers) {
  const tokens = {};
  for (const name of THEME_TOKENS) {
    const value = lookupToken(layers, name, 0);
    if (value) tokens[name] = value;
  }
  return tokens;
}

const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf8"));
const mainCss = readFileSync(resolve(cssDir, "main.css"), "utf8");
const themeDir = resolve(cssDir, "themes");
const themeFiles = readdirSync(themeDir)
  .filter((file) => file.endsWith(".css"))
  .sort()
  .map((file) => ({
    name: file.replace(/^theme-/, "").replace(/\.css$/, ""),
    css: readFileSync(join(themeDir, file), "utf8"),
  }));
const themeCss = themeFiles.map((file) => file.css).join("\n");

const rootTokens = tokensFrom(mainCss, (part) => part === ":root");
const themeLayers = new Map([["basic", [rootTokens]]]);
for (const file of themeFiles) {
  const own = tokensFrom(file.css, isThemeSelector(file.name));
  if (own.size === 0) process.stderr.write(`No [data-theme=${file.name}] tokens found, using :root values\n`);
  themeLayers.set(file.name, [own, rootTokens]);
}
const themes = [...themeLayers]
  .map(([name, layers]) => ({ name, tokens: pickThemeTokens(layers) }))
  .sort(byName);

const variables = new Map();
const ensure = (name) => {
  if (!variables.has(name)) {
    variables.set(name, {
      name,
      group: groupOf(name),
      default: null,
      declared: false,
      usedBy: new Set(),
      usedByAttributes: new Set(),
      referencedBy: new Set(),
      setByScript: false,
      read: false,
    });
  }
  return variables.get(name);
};

const classes = new Map();
const modifiers = new Map();

for (const { selector, body } of rulesOf(mainCss)) {
  for (const { name, value } of declarations(body)) {
    const entry = ensure(name);
    entry.declared = true;
    if (selector === ":root" || entry.default === null) entry.default = value;
    for (const use of varUses(value)) ensure(use.name).referencedBy.add(name);
  }
  const readers = new Set();
  const attributes = new Set();
  for (const complex of splitList(selector)) {
    for (const cls of classesIn(complex)) if (!classes.has(cls)) classes.set(cls, complex);
    for (const mod of modifiersIn(complex)) if (!modifiers.has(mod)) modifiers.set(mod, complex);
    const subject = withoutConditions(complex);
    const subjectClasses = classesIn(subject);
    for (const cls of subjectClasses) readers.add(cls);
    if (subjectClasses.length === 0) {
      for (const attribute of dataAttributesIn(subject)) attributes.add(attribute);
    }
  }
  for (const use of varUses(body)) {
    const entry = ensure(use.name);
    entry.read = true;
    if (entry.default === null && use.fallback !== null) entry.default = use.fallback;
    for (const cls of readers) entry.usedBy.add(cls);
    for (const attribute of attributes) entry.usedByAttributes.add(attribute);
  }
}

for (const { body } of rulesOf(themeCss)) {
  for (const use of varUses(body)) ensure(use.name).read = true;
}

for (const name of scriptVariables()) {
  ensure(name).setByScript = true;
}

const list = [...variables.values()].map((entry) => ({
  ...entry,
  usedBy: [...entry.usedBy].sort(),
  usedByAttributes: [...entry.usedByAttributes].sort(),
  referencedBy: [...entry.referencedBy].sort(),
}));

const other = list.filter((entry) => entry.group === "Other").map((entry) => entry.name);
if (other.length) process.stderr.write(`Ungrouped variables: ${other.join(", ")}\n`);

const groups = GROUP_ORDER.filter((group) => list.some((entry) => entry.group === group));
const toList = (map) => [...map].map(([name, example]) => ({ name, example })).sort(byName);

const output = {
  package: pkg.name,
  version: pkg.version,
  groups,
  variables: list,
  classes: toList(classes),
  modifiers: toList(modifiers),
  themes,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(output, null, 2).replace(/\n/g, "\r\n")}\r\n`);

const count = (predicate) => list.filter(predicate).length;
const groupCounts = groups.map((group) => `${group} ${count((entry) => entry.group === group)}`);
process.stdout.write(
  `css-reference.json: ${list.length} variables, ${output.classes.length} classes, ${output.modifiers.length} modifiers\n`,
);
process.stdout.write(`Groups: ${groupCounts.join(", ")}\n`);
process.stdout.write(`Themes: ${themes.map((theme) => theme.name).join(", ")}\n`);
process.stdout.write(
  `Read but not declared: ${count((entry) => entry.read && !entry.declared)}. ` +
    `Set at runtime: ${count((entry) => entry.setByScript)}. ` +
    `Not read: ${count((entry) => !entry.read && !entry.setByScript)}.\n`,
);
