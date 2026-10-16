import ts from 'typescript';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const appSrc = resolve(repoRoot, 'app', 'src');
const docsApp = resolve(repoRoot, 'docs-app');
const outDir = resolve(here, '..', 'src', 'generated');

const SITE_URL = 'https://timepicker-ui.vercel.app';

const ROOT_PACKAGE = resolve(repoRoot, 'package.json');
const OPTIONS_FILE = resolve(appSrc, 'types', 'options.d.ts');
const TYPES_FILE = resolve(appSrc, 'types', 'types.d.ts');
const EMITTER_FILE = resolve(appSrc, 'utils', 'EventEmitter.ts');
const THEMES_DIR = resolve(appSrc, 'styles', 'themes');
const TEMPLATE_DIR = resolve(appSrc, 'utils', 'template');
const CSS_REFERENCE_FILE = resolve(docsApp, 'lib', 'generated', 'css-reference.json');
const SLUGIFY_FILE = resolve(docsApp, 'lib', 'slugify.ts');
const TROUBLESHOOTING_FILE = resolve(docsApp, 'app', '(site)', 'docs', 'guides', 'troubleshooting', 'troubleshooting-data.ts');
const RENAMED_FILE = resolve(docsApp, 'lib', 'renamed-options.tsx');
const REMOVED_FILE = resolve(docsApp, 'lib', 'removed-in-v5.tsx');

const INTERFACE_TO_GROUP = {
  ClockOptions: 'clock',
  UIOptions: 'ui',
  LabelsOptions: 'labels',
  BehaviorOptions: 'behavior',
  CallbacksOptions: 'callbacks',
  TimezoneOptions: 'timezone',
  RangeOptions: 'range',
  WheelOptions: 'wheel',
  ClearBehaviorOptions: 'clearBehavior',
};

const INTERNAL_EVENTS = new Set(['range:minute:commit', 'animation:clock', 'animation:start', 'animation:end']);
const DEPRECATED_EVENTS = {
  'select:am': 'Use `select:period`. Removed in 5.0.',
  'select:pm': 'Use `select:period`. Removed in 5.0.',
};
const OUTSIDE_WRAPPER = new Set(['tp-ui-modal', 'tp-ui']);

function sourceOf(file) {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}

function commentText(tag) {
  if (typeof tag.comment === 'string') return tag.comment.replace(/\r/g, '').trim();
  if (Array.isArray(tag.comment)) return tag.comment.map((c) => c.text).join('').replace(/\r/g, '').trim();
  return '';
}

function tagsOf(node, tagName) {
  return (ts.getJSDocTags(node) ?? []).filter((tag) => tag.tagName?.text === tagName);
}

function jsdocTag(node, tagName) {
  const texts = tagsOf(node, tagName).map(commentText).filter(Boolean);
  return texts.length ? texts.join('\n') : undefined;
}

function deprecationOf(node) {
  const tags = tagsOf(node, 'deprecated');
  if (!tags.length) return undefined;
  return commentText(tags[0]) || 'Deprecated.';
}

function nameOf(member, source) {
  return ts.isStringLiteral(member.name) ? member.name.text : member.name.getText(source);
}

function typeLiteralIn(node) {
  if (!node) return undefined;
  if (ts.isTypeLiteralNode(node)) return node;
  if (ts.isParenthesizedTypeNode(node)) return typeLiteralIn(node.type);
  if (ts.isUnionTypeNode(node)) return node.types.map(typeLiteralIn).find(Boolean);
  return undefined;
}

function compact(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function entryOf(member, source) {
  const literal = typeLiteralIn(member.type);
  const fields = literal ? fieldsOf(literal, source) : [];
  let type = member.type ? member.type.getText(source) : 'unknown';
  if (literal && fields.length) type = type.replace(literal.getText(source), 'object');
  return {
    name: nameOf(member, source),
    optional: !!member.questionToken,
    type: compact(type),
    description: jsdocTag(member, 'description'),
    default: jsdocTag(member, 'default'),
    example: jsdocTag(member, 'example'),
    deprecated: deprecationOf(member),
    ...(fields.length ? { fields } : {}),
  };
}

function fieldsOf(typeLiteral, source) {
  return typeLiteral.members
    .filter((member) => ts.isPropertySignature(member) && member.name)
    .map((member) => entryOf(member, source));
}

function parseOptions() {
  if (!existsSync(OPTIONS_FILE)) return null;
  const source = sourceOf(OPTIONS_FILE);
  const groups = {};

  source.forEachChild((node) => {
    if (!ts.isInterfaceDeclaration(node)) return;
    const group = INTERFACE_TO_GROUP[node.name.text];
    if (!group) return;
    const options = node.members
      .filter((member) => ts.isPropertySignature(member) && member.name)
      .map((member) => entryOf(member, source));
    groups[group] = { interface: node.name.text, description: jsdocTag(node, 'description'), options };
  });

  return groups;
}

function parseEventDataTypes() {
  if (!existsSync(TYPES_FILE)) return {};
  const source = sourceOf(TYPES_FILE);
  const map = {};

  source.forEachChild((node) => {
    if (!ts.isTypeAliasDeclaration(node)) return;
    const name = node.name.text;
    if (!name.endsWith('EventData')) return;
    map[name] = ts.isTypeLiteralNode(node.type) ? fieldsOf(node.type, source) : [];
  });

  return map;
}

function parseEvents() {
  if (!existsSync(EMITTER_FILE)) return null;
  const source = sourceOf(EMITTER_FILE);
  const dataTypes = parseEventDataTypes();
  let events = null;

  source.forEachChild((node) => {
    if (!ts.isInterfaceDeclaration(node) || node.name.text !== 'TimepickerEventMap') return;
    events = node.members
      .filter((member) => ts.isPropertySignature(member) && member.name)
      .map((member) => {
        const name = nameOf(member, source);
        const data = member.type ? compact(member.type.getText(source)) : 'unknown';
        const internal = tagsOf(member, 'internal').length > 0 || INTERNAL_EVENTS.has(name);
        return {
          name,
          data,
          fields: dataTypes[data] ?? [],
          description: jsdocTag(member, 'internal') ?? jsdocTag(member, 'description'),
          deprecated: deprecationOf(member) ?? DEPRECATED_EVENTS[name],
          ...(internal ? { internal: true } : {}),
        };
      });
  });

  return events;
}

function parseThemeVars(file) {
  const text = readFileSync(file, 'utf8');
  const vars = [];
  const re = /(--tp-[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = re.exec(text)) !== null) {
    vars.push({ name: match[1], value: match[2].trim() });
  }
  return vars;
}

function parseThemes() {
  if (!existsSync(THEMES_DIR)) return null;
  const themes = {};
  for (const file of readdirSync(THEMES_DIR)) {
    if (!file.startsWith('theme-') || !file.endsWith('.scss')) continue;
    themes[file.replace(/^theme-/, '').replace(/\.scss$/, '')] = parseThemeVars(resolve(THEMES_DIR, file));
  }
  return themes;
}

function loadCssReference() {
  if (!existsSync(CSS_REFERENCE_FILE)) return null;
  return JSON.parse(readFileSync(CSS_REFERENCE_FILE, 'utf8'));
}

function buildCssVars(reference, themes) {
  if (!reference) return null;
  const themed = new Set(Object.values(themes ?? {}).flatMap((vars) => vars.map((v) => v.name)));
  return reference.variables.map((v) => {
    const outside = v.read && v.usedBy.length > 0 && v.usedBy.every((cls) => OUTSIDE_WRAPPER.has(cls));
    return {
      name: v.name,
      group: v.group,
      default: v.default ?? null,
      read: v.read,
      commonlyThemed: themed.has(v.name),
      ...(outside ? { readOutsideWrapper: v.usedBy } : {}),
    };
  });
}

function templateClasses() {
  if (!existsSync(TEMPLATE_DIR)) return [];
  const classes = new Set();
  for (const file of readdirSync(TEMPLATE_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const text = readFileSync(resolve(TEMPLATE_DIR, file), 'utf8');
    for (const match of text.matchAll(/tp-ui-[a-z0-9-]+/gi)) classes.add(match[0]);
  }
  return classes;
}

function buildCssClasses(reference) {
  if (!reference) return null;
  const examples = new Map(reference.classes.map((c) => [c.name, c.example]));
  const names = new Set([...examples.keys(), ...templateClasses()]);
  return {
    classes: [...names].sort().map((name) => ({ name, ...(examples.get(name) ? { example: examples.get(name) } : {}) })),
    modifiers: reference.modifiers,
  };
}

const JSX_PRELUDE = `
const Fragment = Symbol('fragment');
const Link = Symbol('link');
const textOf = (children) => children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false).map(String).join('');
function h(type, props, ...children) {
  const text = textOf(children);
  if (type === 'code') return '\`' + text + '\`';
  if (type === Link || type === 'a') return '[' + text + '](' + (props && props.href) + ')';
  return text;
}
`;

function transpile(file, text) {
  return ts.transpileModule(text, {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.React,
      jsxFactory: 'h',
      jsxFragmentFactory: 'Fragment',
    },
  }).outputText;
}

async function importDocsModule(file) {
  if (!existsSync(file)) return null;
  const dir = mkdtempSync(join(tmpdir(), 'tp-mcp-'));
  try {
    writeFileSync(join(dir, 'slugify.mjs'), transpile(SLUGIFY_FILE, readFileSync(SLUGIFY_FILE, 'utf8')));
    const text = readFileSync(file, 'utf8')
      .replace(/^import Link from ["']next\/link["'];?\s*$/m, '')
      .replace(/["']@\/lib\/slugify["']/, "'./slugify.mjs'");
    writeFileSync(join(dir, 'module.mjs'), `${JSX_PRELUDE}\n${transpile(file, text)}`);
    return await import(pathToFileURL(join(dir, 'module.mjs')).href);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function absoluteLinks(text, pagePath) {
  return text
    .replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`)
    .replace(/\]\(#/g, `](${SITE_URL}${pagePath}#`);
}

async function parseTroubleshooting() {
  const mod = await importDocsModule(TROUBLESHOOTING_FILE);
  if (!mod?.PROBLEMS) return null;
  const page = '/docs/guides/troubleshooting';
  return mod.PROBLEMS.map((problem) => ({
    group: problem.group,
    symptom: problem.symptom,
    fix: problem.fix.map((step) => ({
      text: absoluteLinks(step.text, page),
      ...(step.code ? { code: step.code } : {}),
    })),
    ...(problem.why ? { why: absoluteLinks(problem.why, page) } : {}),
    docs: `${SITE_URL}${page}#${problem.anchor}`,
  }));
}

async function parseMigrationV5() {
  const renamed = await importDocsModule(RENAMED_FILE);
  const removed = await importDocsModule(REMOVED_FILE);
  if (!renamed?.renamedOptions || !removed?.removedItems) return null;
  const page = '/docs/migration-guide-v5';
  return {
    renamed: renamed.renamedOptions.map((row) => ({
      from: row.from,
      to: row.to,
      ...(row.note ? { note: absoluteLinks(String(row.note), page) } : {}),
    })),
    removed: removed.removedItems.map((item) => ({
      name: absoluteLinks(String(item.name), page),
      action: absoluteLinks(String(item.action), page),
    })),
  };
}

function parseMeta(reference) {
  if (!existsSync(ROOT_PACKAGE)) return null;
  return {
    library: JSON.parse(readFileSync(ROOT_PACKAGE, 'utf8')).version,
    cssReference: reference?.version ?? null,
    siteUrl: SITE_URL,
  };
}

function write(name, data) {
  if (data === null) {
    console.warn(`[generate] skipped ${name} (source not found, keeping existing)`);
    return;
  }
  writeFileSync(resolve(outDir, name), `${JSON.stringify(data, null, 2)}\n`.replace(/\n/g, '\r\n'), 'utf8');
  console.log(`[generate] wrote src/generated/${name}`);
}

mkdirSync(outDir, { recursive: true });
const themes = parseThemes();
const reference = loadCssReference();
write('meta.json', parseMeta(reference));
write('options.json', parseOptions());
write('events.json', parseEvents());
write('themes.json', themes);
write('css-variables.json', buildCssVars(reference, themes));
write('css-classes.json', buildCssClasses(reference));
write('troubleshooting.json', await parseTroubleshooting());
write('migration-v5.json', await parseMigrationV5());
