import ts from 'typescript';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const appSrc = resolve(repoRoot, 'app', 'src');
const outDir = resolve(here, '..', 'src', 'generated');

const OPTIONS_FILE = resolve(appSrc, 'types', 'options.d.ts');
const TYPES_FILE = resolve(appSrc, 'types', 'types.d.ts');
const EMITTER_FILE = resolve(appSrc, 'utils', 'EventEmitter.ts');
const VARIABLES_FILE = resolve(appSrc, 'styles', 'variables.scss');
const THEMES_DIR = resolve(appSrc, 'styles', 'themes');
const TEMPLATE_DIR = resolve(appSrc, 'utils', 'template');

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

function sourceOf(file) {
  return ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
}

function jsdocTag(node, tagName) {
  const tags = ts.getJSDocTags(node) ?? [];
  for (const tag of tags) {
    if (tag.tagName?.text === tagName) {
      const comment =
        typeof tag.comment === 'string'
          ? tag.comment
          : Array.isArray(tag.comment)
            ? tag.comment.map((c) => c.text).join('')
            : undefined;
      return comment?.trim();
    }
  }
  return undefined;
}

function membersOf(typeLiteral, source) {
  const fields = [];
  for (const member of typeLiteral.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    fields.push({
      name: member.name.getText(source),
      optional: !!member.questionToken,
      type: member.type ? member.type.getText(source).replace(/\s+/g, ' ').trim() : 'unknown',
      description: jsdocTag(member, 'description'),
    });
  }
  return fields;
}

function parseOptions() {
  if (!existsSync(OPTIONS_FILE)) return null;
  const source = sourceOf(OPTIONS_FILE);
  const groups = {};

  source.forEachChild((node) => {
    if (!ts.isInterfaceDeclaration(node)) return;
    const group = INTERFACE_TO_GROUP[node.name.text];
    if (!group) return;

    const options = [];
    for (const member of node.members) {
      if (!ts.isPropertySignature(member) || !member.name) continue;
      options.push({
        name: member.name.getText(source),
        optional: !!member.questionToken,
        type: member.type ? member.type.getText(source).replace(/\s+/g, ' ').trim() : 'unknown',
        description: jsdocTag(member, 'description'),
        default: jsdocTag(member, 'default'),
        example: jsdocTag(member, 'example'),
      });
    }

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
    if (ts.isTypeLiteralNode(node.type)) {
      map[name] = membersOf(node.type, source);
    } else {
      map[name] = [];
    }
  });

  return map;
}

function parseEvents() {
  if (!existsSync(EMITTER_FILE)) return null;
  const text = readFileSync(EMITTER_FILE, 'utf8');
  const block = text.match(/interface TimepickerEventMap\s*{([\s\S]*?)}/);
  if (!block) return null;

  const dataTypes = parseEventDataTypes();
  const events = [];
  const lineRe = /^\s*(?:'([^']+)'|([A-Za-z:]+))\s*:\s*([^;]+);/gm;
  let match;
  while ((match = lineRe.exec(block[1])) !== null) {
    const name = match[1] ?? match[2];
    const data = match[3].trim();
    if (name.startsWith('[')) continue;
    events.push({ name, data, fields: dataTypes[data] ?? [] });
  }
  return events;
}

function parseCssVars(file) {
  if (!existsSync(file)) return [];
  const text = readFileSync(file, 'utf8');
  const vars = [];
  const re = /(--tp-[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match;
  while ((match = re.exec(text)) !== null) {
    vars.push({ name: match[1], value: match[2].trim() });
  }
  return vars;
}

function themeFiles() {
  if (!existsSync(THEMES_DIR)) return [];
  return readdirSync(THEMES_DIR)
    .filter((f) => f.startsWith('theme-') && f.endsWith('.scss'))
    .map((f) => ({ name: f.replace(/^theme-/, '').replace(/\.scss$/, ''), file: resolve(THEMES_DIR, f) }));
}

function parseThemes() {
  const themes = {};
  for (const { name, file } of themeFiles()) {
    themes[name] = parseCssVars(file);
  }
  return themes;
}

function buildCssVars(themes) {
  const base = parseCssVars(VARIABLES_FILE);
  const themed = new Set();
  for (const vars of Object.values(themes)) {
    for (const v of vars) themed.add(v.name);
  }
  return base.map((v) => ({ ...v, commonlyThemed: themed.has(v.name) }));
}

function parseCssClasses() {
  if (!existsSync(TEMPLATE_DIR)) return [];
  const classes = new Set();
  for (const file of readdirSync(TEMPLATE_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const text = readFileSync(resolve(TEMPLATE_DIR, file), 'utf8');
    const re = /tp-ui-[a-z0-9-]+/gi;
    let match;
    while ((match = re.exec(text)) !== null) classes.add(match[0]);
  }
  return [...classes].sort();
}

function write(name, data) {
  if (data === null) {
    console.warn(`[generate] skipped ${name} (source not found, keeping existing)`);
    return;
  }
  writeFileSync(resolve(outDir, name), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`[generate] wrote src/generated/${name}`);
}

mkdirSync(outDir, { recursive: true });
const themes = parseThemes();
write('options.json', parseOptions());
write('events.json', parseEvents());
write('themes.json', themes);
write('css-variables.json', buildCssVars(themes));
write('css-classes.json', parseCssClasses());
