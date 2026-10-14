/**
 * @jest-environment node
 */
import { join, relative } from 'path';
import { parse } from 'postcss';
import type { AtRule, Declaration, Rule } from 'postcss';
import { Logger, compile } from 'sass';
import {
  STYLES_DIR,
  VARIABLES_PATH,
  escapeRegExp,
  loadThemes,
  readScss,
  resolveValue,
  themeFiles,
} from './style-test-helpers';
import type { Scope } from './style-test-helpers';

type CssDeclaration = { prop: string; value: string; important: boolean };
type CssRule = { selectors: string[]; declarations: CssDeclaration[]; atRules: string[] };
type Specificity = [number, number, number];
type Candidate = { value: string; important: boolean; specificity: Specificity };
type Target = {
  tag: string;
  classes: string[];
  attributes: Record<string, string>;
  states: string[];
  children?: Target[];
};
type Box = Omit<Target, 'children'> & { children: Box[]; parent?: Box };
type Viewport = { name: string; width: number; height: number; hover: boolean };
type Declared = CssDeclaration & { specificity: Specificity; order: number };
type PickValue = (value: string) => string | undefined;
type Style = (longhand: string) => string | undefined;
type Measured = { label: string; width: number; inFlow: boolean; parts: Measured[] };
type HeaderView = 'clock' | 'keyboard';

const SIMPLE_SELECTOR = /#[\w-]+|\.[\w-]+|\[[^\]]*\]|::?[\w-]+(?:\((?:[^()]|\([^()]*\))*\))?|\*|[a-z][\w-]*/gi;
const ATTRIBUTE = /^\[\s*([\w-]+)\s*(?:=\s*['"]?([^'"\]]*)['"]?\s*)?\]$/;
const NESTED_GROUP = /:(?:not|has)\((?:[^()]|\([^()]*\))*\)/g;
const COMBINATOR = /[\s>+~]/;
const KEYFRAMES = /^@[\w-]*keyframes\b/;
const FOCUS_RING = /var\(\s*--tp-focus-ring\s*,/;
const SELECTION_RING_TOKEN = /--tp-selection-ring(?![\w-])/;
const OUTLINE_REMOVED = /^(none|0[a-z%]*)$/i;
const FOCUS_VISIBLE_RESET = /:not\(\s*:focus-visible\s*\)/;
const UNRENDERED_BTN_MOBILE = /\.btn-mobile(?![\w-])/;
const FOCUS_RING_TOKEN = /--tp-focus-ring(?![\w-])/;
const INSET = /\binset\b/;
const LENGTH_TOKEN = /\d*\.?\d+(?:px)?|[-+*/()]/g;
const FIRST_LENGTH = /-?\d*\.?\d+px/;

const ZERO: Specificity = [0, 0, 0];
const PAINT = ['color', 'fill', 'stroke', 'background', 'background-color', 'background-image'];
const OUTLINE = ['outline', 'outline-style', 'outline-width'];
const AM_PM = ['tp-ui-am', 'tp-ui-pm', 'tp-ui-type-mode'];
const SWITCH_ICON = ['tp-ui-keyboard-icon', 'tp-ui-keyboard-icon-wrapper', 'tp-ui-keyboard-icon-mobile'];
const FOOTER_BUTTONS = ['tp-ui-ok-btn', 'tp-ui-cancel-btn', 'tp-ui-clear-btn', 'tp-ui-ok'];
const TIME_INPUTS = ['tp-ui-hour', 'tp-ui-minutes'];
const FOCUSED = ['focus', 'focus-visible'];
const POPOVER_WRAPPER = '.tp-ui-modal.tp-ui-popover .tp-ui-wrapper';
const INLINE_WRAPPERS = ['.tp-ui--inline .tp-ui-wrapper', '.tp-ui--inline .tp-ui-wrapper.mobile'];
const SECONDS_INPUT = 'tp-ui-seconds';
const OUTLINE_PROPS = ['outline', 'outline-width', 'outline-offset', 'outline-color'];
const PREFERS_CONTRAST = /prefers-contrast:\s*more/;
const PREFERS_CONTRAST_HIGH = /prefers-contrast\s*:\s*high/;
const FORCED_COLORS = /forced-colors:\s*active/;
const FOCUS_RING_HALO = /--tp-focus-ring-halo(?![\w-])/;
const FOCUS_RING_HALO_DECLARATION = /--tp-focus-ring-halo\s*:/;
const BG_TOKEN = /--tp-bg(?![\w-])/;
const SINGLE_RING_SHADOW = 'var(--tp-shadow-focus-ring, none)';
const SHARED_FOCUS_CONTROLS = [
  'tp-ui-hour',
  'tp-ui-minutes',
  'tp-ui-seconds',
  'tp-ui-am',
  'tp-ui-pm',
  'tp-ui-cancel-btn',
  'tp-ui-ok-btn',
  'tp-ui-clear-btn',
  'tp-ui-keyboard-icon',
  'tp-ui-range-tab',
  'tp-ui-timezone-dropdown',
  'tp-ui-wheel-column',
];
const PERIOD_SEGMENTS = ['tp-ui-am', 'tp-ui-pm'];
const WHITE = /^(?:white|#fff|#ffffff|rgba?\(\s*255\s*,\s*255\s*,\s*255\s*(?:,\s*1\s*)?\))$/i;
const LANDSCAPE_SIZE_TOKENS: Record<string, string> = {
  '--tp-mobile-landscape-width': '328px',
  '--tp-mobile-landscape-height': '258px',
  '--tp-mobile-landscape-height-range': '287px',
  '--tp-mobile-landscape-height-timezone': '326px',
};
const MEDIA_FEATURE = /\(\s*([\w-]+)\s*(?::\s*([^)]+?)\s*)?\)/g;
const MEDIA_TYPE = /^(?:only\s+)?([a-z]+)\b/;
const MEDIA_PIXELS = /^\d*\.?\d+px$/;
const GLOBAL_KEYWORD = /^(?:inherit|initial|unset|revert|revert-layer)$/;
const NOT_A_LENGTH = /^(?:auto|none|normal|fit-content|max-content|min-content)$/;
const PIXEL_EXPRESSION = /^[\s\d.+\-*/()]+$/;
const BORDER_STYLE = /^(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/;
const LENGTH_WORD = /^(?:-?\d|\.\d|calc\()/;
const NUMBER_WORD = /^-?\d*\.?\d+$/;
const BORDER_KEYWORD_WIDTHS = new Map([
  ['thin', 1],
  ['medium', 3],
  ['thick', 5],
]);
const DEFAULT_DISPLAY = new Map([
  ['input', 'inline-block'],
  ['span', 'inline'],
]);

const atRulesOf = (rule: Rule): string[] => {
  const chain: string[] = [];
  let parent = rule.parent as AtRule | undefined;
  while (parent?.type === 'atrule') {
    chain.unshift(`@${parent.name} ${parent.params}`);
    parent = parent.parent as AtRule | undefined;
  }
  return chain;
};

const compileCss = (entry: string): string =>
  compile(join(STYLES_DIR, entry), { style: 'expanded', logger: Logger.silent }).css;

const rulesOf = (css: string): CssRule[] => {
  const rules: CssRule[] = [];
  parse(css).walkRules((rule) => {
    const atRules = atRulesOf(rule);
    if (atRules.some((atRule) => KEYFRAMES.test(atRule))) return;
    rules.push({
      selectors: rule.selectors.map((selector) => selector.trim()),
      declarations: rule.nodes
        .filter((node): node is Declaration => node.type === 'decl')
        .map(({ prop, value, important }) => ({ prop, value: value.trim(), important: Boolean(important) })),
      atRules,
    });
  });
  return rules;
};

const compileRules = (entry: string): CssRule[] => rulesOf(compileCss(entry));

const compounds = (selector: string): string[] => {
  const parts = [''];
  let depth = 0;
  [...selector.trim()].forEach((char) => {
    if (char === '(' || char === '[') depth += 1;
    if (char === ')' || char === ']') depth -= 1;
    if (depth === 0 && COMBINATOR.test(char)) parts.push('');
    else parts[parts.length - 1] += char;
  });
  return parts.filter(Boolean);
};

const subjectOf = (selector: string): string => compounds(selector).pop() ?? '';

const simpleSelectors = (compound: string): string[] => compound.match(SIMPLE_SELECTOR) ?? [];

const pseudoArguments = (simple: string): string[] =>
  simple
    .slice(simple.indexOf('(') + 1, -1)
    .split(',')
    .map((inner) => inner.trim());

const withoutNested = (selector: string): string => selector.replace(NESTED_GROUP, '');

const classesOf = (compound: string): string[] =>
  simpleSelectors(withoutNested(compound))
    .filter((simple) => simple.startsWith('.'))
    .map((simple) => simple.slice(1));

const hasPseudoClass = (selector: string, name: string): boolean =>
  new RegExp(`:${escapeRegExp(name)}(?![\\w-])`).test(withoutNested(selector));

const descendantsOf = (target: Target): Target[] =>
  (target.children ?? []).flatMap((child) => [child, ...descendantsOf(child)]);

const matchesCompound = (compound: string, target: Target): boolean =>
  simpleSelectors(compound).every((simple) => matchesSimple(simple, target));

const matchesRelative = (relative: string, target: Target): boolean => {
  if (relative.startsWith('+') || relative.startsWith('~')) return false;
  const candidates = relative.startsWith('>') ? (target.children ?? []) : descendantsOf(target);
  const subject = subjectOf(relative.replace(/^>\s*/, ''));
  return candidates.some((candidate) => matchesCompound(subject, candidate));
};

const matchesSimple = (simple: string, target: Target): boolean => {
  if (simple.startsWith(':not(')) {
    return !pseudoArguments(simple).some((inner) => matchesCompound(inner, target));
  }
  if (simple.startsWith(':has(')) {
    return pseudoArguments(simple).some((relative) => matchesRelative(relative, target));
  }
  if (simple.startsWith('::') || simple.startsWith('#')) return false;
  if (simple.startsWith(':')) return target.states.includes(simple.slice(1));
  if (simple.startsWith('.')) return target.classes.includes(simple.slice(1));
  if (simple.startsWith('[')) {
    const [, name, value] = simple.match(ATTRIBUTE) ?? [];
    if (name === undefined || !(name in target.attributes)) return false;
    return value === undefined || target.attributes[name] === value;
  }
  return simple === '*' || simple.toLowerCase() === target.tag;
};

const compareSpecificity = (a: Specificity, b: Specificity): number => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

const highest = (list: Specificity[]): Specificity => [...list].sort(compareSpecificity).pop() ?? ZERO;

const simpleSpecificity = (simple: string): Specificity => {
  if (simple.startsWith(':not(') || simple.startsWith(':has(')) {
    return highest(pseudoArguments(simple).map((inner) => specificityOf(inner)));
  }
  if (simple.startsWith('#')) return [1, 0, 0];
  if (simple.startsWith('::')) return [0, 0, 1];
  if (simple.startsWith('.') || simple.startsWith('[') || simple.startsWith(':')) return [0, 1, 0];
  return simple === '*' ? ZERO : [0, 0, 1];
};

const specificityOf = (selector: string): Specificity =>
  compounds(selector)
    .flatMap((compound) => simpleSelectors(compound))
    .map((simple) => simpleSpecificity(simple))
    .reduce<Specificity>((sum, part) => [sum[0] + part[0], sum[1] + part[1], sum[2] + part[2]], ZERO);

const winsOver = (candidate: Candidate, current: Candidate | undefined): boolean => {
  if (!current) return true;
  if (candidate.important !== current.important) return candidate.important;
  return compareSpecificity(candidate.specificity, current.specificity) >= 0;
};

const topLevel = (rules: CssRule[]): CssRule[] => rules.filter(({ atRules }) => atRules.length === 0);

const cascadedValue = (rules: CssRule[], target: Target, prop: string): string | undefined =>
  rules.reduce<Candidate | undefined>((winner, { selectors, declarations }) => {
    const matching = selectors.filter((selector) => matchesCompound(subjectOf(selector), target));
    if (matching.length === 0) return winner;
    const specificity = highest(matching.map((selector) => specificityOf(selector)));
    return declarations
      .filter((declaration) => declaration.prop === prop || declaration.prop === 'all')
      .reduce<Candidate | undefined>((best, { value, important }) => {
        const candidate = { value, important, specificity };
        return winsOver(candidate, best) ? candidate : best;
      }, winner);
  }, undefined)?.value;

const computedValue = (rules: CssRule[], target: Target, prop: string): string | undefined =>
  cascadedValue(topLevel(rules), target, prop);

const focusRing = (rules: CssRule[], target: Target): Record<string, string | undefined> =>
  Object.fromEntries(
    ['outline', 'outline-offset', 'box-shadow'].map((prop) => [prop, computedValue(rules, target, prop)]),
  );

const offenders = (
  rules: CssRule[],
  targets: (selector: string) => boolean,
  flags: (declaration: CssDeclaration) => boolean,
): string[] =>
  rules.flatMap(({ selectors, declarations }) =>
    selectors
      .filter(targets)
      .flatMap((selector) =>
        declarations.filter(flags).map(({ prop, value }) => `${selector} { ${prop}: ${value} }`),
      ),
  );

const paints = ({ prop }: CssDeclaration): boolean => PAINT.includes(prop);

const removesOutline = ({ prop, value }: CssDeclaration): boolean =>
  OUTLINE.includes(prop) && OUTLINE_REMOVED.test(value);

const subjectHasClass = (selector: string, names: string[]): boolean =>
  classesOf(subjectOf(selector)).some((name) => names.includes(name));

const substituteVars = (scope: Scope, value: string): string => {
  const start = value.indexOf('var(');
  if (start < 0) return value;
  let depth = 0;
  let end = start + 'var'.length;
  do {
    if (value[end] === '(') depth += 1;
    if (value[end] === ')') depth -= 1;
    end += 1;
  } while (depth > 0 && end < value.length);
  const reference = value.slice(start, end);
  const resolved = resolveValue(scope, reference);
  if (resolved === reference) return value;
  return substituteVars(scope, value.slice(0, start) + resolved + value.slice(end));
};

const pixels = (expression: string): number => {
  const tokens = expression.replace(/calc/g, '').match(LENGTH_TOKEN) ?? [];
  let index = 0;
  const next = (): string | undefined => {
    index += 1;
    return tokens[index - 1];
  };
  const primary = (): number => {
    const token = next();
    if (token === '-') return -primary();
    if (token !== '(') return parseFloat(token ?? '0');
    const value = sum();
    next();
    return value;
  };
  const product = (): number => {
    let value = primary();
    while (tokens[index] === '*' || tokens[index] === '/') {
      const operator = next();
      const right = primary();
      value = operator === '*' ? value * right : value / right;
    }
    return value;
  };
  const sum = (): number => {
    let value = product();
    while (tokens[index] === '+' || tokens[index] === '-') {
      const operator = next();
      const right = product();
      value = operator === '+' ? value + right : value - right;
    }
    return value;
  };
  return tokens.length === 0 ? 0 : sum();
};

const footerButton = (className: string, mobile: boolean): Target => ({
  tag: 'div',
  classes: mobile ? [className, 'mobile'] : [className],
  attributes: { 'data-md3-ripple': '', tabindex: '0', role: 'button' },
  states: FOCUSED,
});

const TIMEZONE_DROPDOWN: Target = {
  tag: 'div',
  classes: ['tp-ui-timezone-dropdown'],
  attributes: { role: 'combobox', tabindex: '0', 'aria-expanded': 'false', 'aria-haspopup': 'listbox' },
  states: FOCUSED,
};

const SWITCH_BUTTON: Target = {
  tag: 'button',
  classes: ['tp-ui-keyboard-icon'],
  attributes: { type: 'button', 'aria-label': '' },
  states: FOCUSED,
};

const switchWrapper = (mobile: boolean): Target => ({
  tag: 'div',
  classes: mobile ? ['tp-ui-keyboard-icon-wrapper', 'mobile'] : ['tp-ui-keyboard-icon-wrapper'],
  attributes: { 'data-md3-ripple': '', 'data-view': 'desktop' },
  states: [],
  children: [SWITCH_BUTTON],
});

const timeInput = (className: string, mobile: boolean): Target => ({
  tag: 'input',
  classes: mobile ? [className, 'mobile'] : [className],
  attributes: { type: 'number', tabindex: '0', role: 'spinbutton' },
  states: FOCUSED,
});

const activeTimeInput = (className: string, mobile: boolean): Target => {
  const target = timeInput(className, mobile);
  return { ...target, classes: [...target.classes, 'active'] };
};

const focusedControl = (className: string): Target => ({
  tag: 'div',
  classes: [className],
  attributes: { tabindex: '0' },
  states: FOCUSED,
});

const periodSegment = (className: string, selected: boolean): Target => ({
  tag: 'div',
  classes: selected ? ['tp-ui-type-mode', className, 'active'] : ['tp-ui-type-mode', className],
  attributes: { 'data-md3-ripple': '', tabindex: '0', role: 'button' },
  states: FOCUSED,
});

const activeUnder = (rules: CssRule[], feature?: RegExp): CssRule[] =>
  rules.filter(
    ({ atRules }) =>
      atRules.length === 0 || (feature !== undefined && atRules.every((atRule) => feature.test(atRule))),
  );

const winningDeclaration = (rules: CssRule[], target: Target, props: string[]): CssDeclaration | undefined =>
  rules.reduce<(CssDeclaration & Candidate) | undefined>((winner, { selectors, declarations }) => {
    const matching = selectors.filter((selector) => matchesCompound(subjectOf(selector), target));
    if (matching.length === 0) return winner;
    const specificity = highest(matching.map((selector) => specificityOf(selector)));
    return declarations
      .filter(({ prop }) => props.includes(prop))
      .reduce<(CssDeclaration & Candidate) | undefined>((best, declaration) => {
        const candidate = { ...declaration, specificity };
        return winsOver(candidate, best) ? candidate : best;
      }, winner);
  }, undefined);

const splitTopLevel = (value: string, separator: RegExp): string[] => {
  const parts = [''];
  let depth = 0;
  [...value].forEach((char) => {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (depth === 0 && separator.test(char)) parts.push('');
    else parts[parts.length - 1] += char;
  });
  return parts.map((part) => part.trim()).filter(Boolean);
};

const words = (value: string): string[] => splitTopLevel(value, /\s/);

const mediaPixels = (feature: string, value: string | undefined): number => {
  if (value === undefined || !MEDIA_PIXELS.test(value)) {
    throw new Error(`unsupported media value (${feature}: ${value})`);
  }
  return parseFloat(value);
};

const MEDIA_FEATURES: Record<string, (value: string | undefined, viewport: Viewport) => boolean> = {
  'min-width': (value, { width }) => width >= mediaPixels('min-width', value),
  'max-width': (value, { width }) => width <= mediaPixels('max-width', value),
  'min-height': (value, { height }) => height >= mediaPixels('min-height', value),
  'max-height': (value, { height }) => height <= mediaPixels('max-height', value),
  orientation: (value, { width, height }) => value === (height >= width ? 'portrait' : 'landscape'),
  hover: (value, { hover }) => (value ?? 'hover') === (hover ? 'hover' : 'none'),
  pointer: (value, { hover }) => value === undefined || value === (hover ? 'fine' : 'coarse'),
  'prefers-contrast': (value) => value === 'no-preference',
  'forced-colors': (value) => value === 'none',
  'prefers-reduced-motion': (value) => value === 'no-preference',
  'prefers-color-scheme': (value) => value === 'light',
};

const mediaQueryMatches = (query: string, viewport: Viewport): boolean => {
  const normalized = query.trim().toLowerCase();
  if (/\b(?:not|or)\b/.test(normalized)) throw new Error(`unsupported media query "${query}"`);
  const mediaType = normalized.match(MEDIA_TYPE)?.[1];
  if (mediaType !== undefined && mediaType !== 'screen' && mediaType !== 'all') return false;
  return [...normalized.matchAll(MEDIA_FEATURE)].every(([, feature, value]) => {
    const matches = MEDIA_FEATURES[feature];
    if (!matches) throw new Error(`unsupported media feature "${feature}"`);
    return matches(value?.trim(), viewport);
  });
};

const atRuleMatches = (atRule: string, viewport: Viewport): boolean => {
  const media = /^@media\s+([\s\S]+)$/.exec(atRule)?.[1];
  if (media === undefined) throw new Error(`unsupported at-rule "${atRule}"`);
  return splitTopLevel(media, /,/).some((query) => mediaQueryMatches(query, viewport));
};

const complexSelector = (selector: string): { parts: string[]; combinators: string[] } => {
  const parts: string[] = [];
  const combinators: string[] = [];
  let current = '';
  let pending = '';
  let depth = 0;
  [...selector.trim()].forEach((char) => {
    if (char === '(' || char === '[') depth += 1;
    if (char === ')' || char === ']') depth -= 1;
    if (depth === 0 && COMBINATOR.test(char)) {
      if (current) {
        parts.push(current);
        current = '';
        pending = ' ';
      }
      if (!/\s/.test(char)) pending = char;
      return;
    }
    if (current === '' && pending) {
      combinators.push(pending);
      pending = '';
    }
    current += char;
  });
  if (current) parts.push(current);
  return { parts, combinators };
};

const previousSiblings = (box: Box): Box[] => {
  const siblings = box.parent?.children ?? [];
  return siblings.slice(0, siblings.indexOf(box));
};

const matchesFrom = (selector: ReturnType<typeof complexSelector>, index: number, box: Box): boolean => {
  if (!matchesCompound(selector.parts[index], box)) return false;
  if (index === 0) return true;
  const combinator = selector.combinators[index - 1];
  if (combinator === '>') return box.parent !== undefined && matchesFrom(selector, index - 1, box.parent);
  if (combinator === '+') {
    const previous = previousSiblings(box).pop();
    return previous !== undefined && matchesFrom(selector, index - 1, previous);
  }
  if (combinator === '~') {
    return previousSiblings(box).some((sibling) => matchesFrom(selector, index - 1, sibling));
  }
  for (let ancestor = box.parent; ancestor; ancestor = ancestor.parent) {
    if (matchesFrom(selector, index - 1, ancestor)) return true;
  }
  return false;
};

const matchesComplex = (selector: string, box: Box): boolean => {
  const complex = complexSelector(selector);
  return complex.parts.length > 0 && matchesFrom(complex, complex.parts.length - 1, box);
};

const declaredFor = (rules: CssRule[], box: Box, viewport: Viewport): Declared[] =>
  rules.flatMap(({ selectors, declarations, atRules }, ruleIndex) => {
    const matching = selectors.filter((selector) => matchesComplex(selector, box));
    if (matching.length === 0 || !atRules.every((atRule) => atRuleMatches(atRule, viewport))) return [];
    const specificity = highest(matching.map((selector) => specificityOf(selector)));
    return declarations.map((declaration, index) => ({
      ...declaration,
      specificity,
      order: ruleIndex * 1000 + index,
    }));
  });

const outranks = (candidate: Declared, current: Declared | undefined): boolean => {
  if (!current) return true;
  if (candidate.important !== current.important) return candidate.important;
  const bySpecificity = compareSpecificity(candidate.specificity, current.specificity);
  return bySpecificity > 0 || (bySpecificity === 0 && candidate.order > current.order);
};

const scopeOf = (declared: Declared[], parent?: Scope): Scope => {
  const winners = new Map<string, Declared>();
  declared
    .filter(({ prop }) => prop.startsWith('--'))
    .forEach((declaration) => {
      if (outranks(declaration, winners.get(declaration.prop))) winners.set(declaration.prop, declaration);
    });
  const tokens = new Map([...winners].map(([prop, { value }]): [string, string] => [prop, value]));
  return { tokens, parent };
};

const same: PickValue = (value) => value;

const boxSide =
  (index: number): PickValue =>
  (value) => {
    const [top, right = top, bottom = top, left = right] = words(value);
    return [top, right, bottom, left][index];
  };

const inlineSide =
  (index: number): PickValue =>
  (value) => {
    const [start, end = start] = words(value);
    return index === 0 ? start : end;
  };

const keywordOf =
  (pattern: RegExp): PickValue =>
  (value) =>
    words(value).find((word) => pattern.test(word));

const borderWidthOf: PickValue = (value) =>
  words(value).find((word) => BORDER_KEYWORD_WIDTHS.has(word) || LENGTH_WORD.test(word)) ?? 'medium';

const borderStyleOf: PickValue = (value) => words(value).find((word) => BORDER_STYLE.test(word)) ?? 'none';

const flexBasisOf: PickValue = (value) => {
  const [first, second, third] = words(value);
  if (third !== undefined) return third;
  if (second !== undefined) return NUMBER_WORD.test(second) ? '0px' : second;
  if (first === 'none' || first === 'auto') return 'auto';
  return NUMBER_WORD.test(first) ? '0px' : first;
};

const columnGapOf: PickValue = (value) => {
  const [row, column = row] = words(value);
  return column;
};

const edgeSources = (edge: 'margin' | 'padding', side: 'left' | 'right'): Array<[string, PickValue]> => [
  [edge, boxSide(side === 'left' ? 3 : 1)],
  [`${edge}-inline`, inlineSide(side === 'left' ? 0 : 1)],
  [`${edge}-inline-${side === 'left' ? 'start' : 'end'}`, same],
  [`${edge}-${side}`, same],
];

const borderSources = (side: 'left' | 'right', aspect: 'width' | 'style'): Array<[string, PickValue]> => {
  const logical = side === 'left' ? 'start' : 'end';
  const whole = aspect === 'width' ? borderWidthOf : borderStyleOf;
  return [
    ['border', whole],
    [`border-${side}`, whole],
    ['border-inline', whole],
    [`border-inline-${logical}`, whole],
    [`border-${aspect}`, boxSide(side === 'left' ? 3 : 1)],
    [`border-inline-${aspect}`, inlineSide(side === 'left' ? 0 : 1)],
    [`border-${side}-${aspect}`, same],
    [`border-inline-${logical}-${aspect}`, same],
  ];
};

const LONGHAND_SOURCES: Record<string, Array<[string, PickValue]>> = {
  display: [['display', same]],
  position: [['position', same]],
  'box-sizing': [['box-sizing', same]],
  width: [['width', same]],
  'min-width': [['min-width', same]],
  'max-width': [['max-width', same]],
  'flex-basis': [
    ['flex-basis', same],
    ['flex', flexBasisOf],
  ],
  'flex-direction': [
    ['flex-direction', same],
    ['flex-flow', keywordOf(/^(?:row|row-reverse|column|column-reverse)$/)],
  ],
  'flex-wrap': [
    ['flex-wrap', same],
    ['flex-flow', keywordOf(/^(?:nowrap|wrap|wrap-reverse)$/)],
  ],
  'column-gap': [
    ['column-gap', same],
    ['gap', columnGapOf],
  ],
  'margin-left': edgeSources('margin', 'left'),
  'margin-right': edgeSources('margin', 'right'),
  'padding-left': edgeSources('padding', 'left'),
  'padding-right': edgeSources('padding', 'right'),
  'border-left-width': borderSources('left', 'width'),
  'border-right-width': borderSources('right', 'width'),
  'border-left-style': borderSources('left', 'style'),
  'border-right-style': borderSources('right', 'style'),
};

const RESET_ALL: [string, PickValue] = ['all', () => undefined];

const styleOf = (
  rules: CssRule[],
  box: Box,
  viewport: Viewport,
  parent?: Scope,
): { style: Style; scope: Scope } => {
  const declared = declaredFor(rules, box, viewport);
  const scope = scopeOf(declared, parent);
  const style: Style = (longhand) => {
    const sources = [...LONGHAND_SOURCES[longhand], RESET_ALL];
    type Winner = { declaration: Declared; pick: PickValue };
    const winner = declared.reduce<Winner | undefined>((best, declaration) => {
      const source = sources.find(([prop]) => prop === declaration.prop);
      return source && outranks(declaration, best?.declaration) ? { declaration, pick: source[1] } : best;
    }, undefined);
    if (!winner) return undefined;
    const value = substituteVars(scope, winner.declaration.value).trim();
    return GLOBAL_KEYWORD.test(value) ? undefined : winner.pick(value);
  };
  return { style, scope };
};

const scopeFor = (rules: CssRule[], box: Box | undefined, viewport: Viewport): Scope | undefined =>
  box === undefined ? undefined : styleOf(rules, box, viewport, scopeFor(rules, box.parent, viewport)).scope;

const toPixels = (value: string | undefined): number | null => {
  if (value === undefined) return null;
  const trimmed = value.trim();
  if (NOT_A_LENGTH.test(trimmed) || trimmed.includes('%')) return null;
  const keyword = BORDER_KEYWORD_WIDTHS.get(trimmed);
  if (keyword !== undefined) return keyword;
  if (!PIXEL_EXPRESSION.test(trimmed.replace(/calc/g, '').replace(/(\d)px\b/g, '$1'))) {
    throw new Error(`cannot evaluate "${value}" in px`);
  }
  return pixels(trimmed);
};

const usedBorderWidth = (style: Style, side: 'left' | 'right'): number => {
  const borderStyle = style(`border-${side}-style`) ?? 'none';
  if (borderStyle === 'none' || borderStyle === 'hidden') return 0;
  return toPixels(style(`border-${side}-width`) ?? 'medium') ?? 0;
};

const labelOf = (box: Box): string =>
  box.tag +
  box.classes
    .filter((name) => name !== 'expanded' && name !== 'mobile')
    .map((name) => `.${name}`)
    .join('');

const measureContent = (
  rules: CssRule[],
  box: Box,
  viewport: Viewport,
  scope: Scope,
  style: Style,
  display: string,
): { width: number; parts: Measured[] } => {
  const flex = display === 'flex' || display === 'inline-flex';
  const row = flex && !(style('flex-direction') ?? 'row').startsWith('column');
  const parts = box.children
    .map((child) => measure(rules, child, viewport, scope, row))
    .filter(({ inFlow }) => inFlow);
  const widths = parts.map(({ width }) => width);
  if (!row || (style('flex-wrap') ?? 'nowrap') !== 'nowrap') return { width: Math.max(0, ...widths), parts };
  const gaps = (toPixels(style('column-gap')) ?? 0) * Math.max(0, widths.length - 1);
  return { width: widths.reduce((sum, width) => sum + width, 0) + gaps, parts };
};

const measure = (
  rules: CssRule[],
  box: Box,
  viewport: Viewport,
  parent: Scope | undefined,
  flexRowItem: boolean,
): Measured => {
  const { style, scope } = styleOf(rules, box, viewport, parent);
  const label = labelOf(box);
  const display = style('display') ?? DEFAULT_DISPLAY.get(box.tag) ?? 'block';
  if (display === 'none') return { label, width: 0, inFlow: false, parts: [] };
  const position = style('position') ?? 'static';
  const edges =
    (toPixels(style('padding-left')) ?? 0) +
    (toPixels(style('padding-right')) ?? 0) +
    usedBorderWidth(style, 'left') +
    usedBorderWidth(style, 'right');
  const toContentBox = (size: number): number => (style('box-sizing') === 'border-box' ? size - edges : size);
  const basis = flexRowItem ? toPixels(style('flex-basis')) : null;
  const specified = basis !== null && basis > 0 ? basis : toPixels(style('width'));
  const content =
    specified === null
      ? measureContent(rules, box, viewport, scope, style, display)
      : { width: toContentBox(specified), parts: [] };
  const max = toPixels(style('max-width'));
  const min = toPixels(style('min-width'));
  const clamped = Math.max(
    min === null ? 0 : toContentBox(min),
    Math.min(max === null ? Infinity : toContentBox(max), content.width),
  );
  const margins = (toPixels(style('margin-left')) ?? 0) + (toPixels(style('margin-right')) ?? 0);
  return {
    label,
    width: clamped + edges + margins,
    inFlow: position !== 'absolute' && position !== 'fixed',
    parts: content.parts,
  };
};

const headerContent = (rules: CssRule[], header: Box, viewport: Viewport): Measured => {
  const { style, scope } = styleOf(rules, header, viewport, scopeFor(rules, header.parent, viewport));
  const content = measureContent(rules, header, viewport, scope, style, style('display') ?? 'block');
  return { label: labelOf(header), inFlow: true, ...content };
};

const makeBox = (
  tag: string,
  classes: string[],
  children: Box[] = [],
  attributes: Record<string, string> = {},
): Box => {
  const node: Box = { tag, classes, attributes, states: [], children };
  children.forEach((child) => {
    child.parent = node;
  });
  return node;
};

const secondsHeader = (clockType: '12h' | '24h', view: HeaderView): Box => {
  const state = view === 'clock' ? 'expanded' : 'mobile';
  const classes = (...names: string[]): string[] => [...names, state];
  const field = (input: string, caption: string): Box =>
    makeBox('div', classes('tp-ui-input-wrapper'), [
      makeBox(
        'div',
        classes('tp-ui-input-ripple-wrapper'),
        [makeBox('input', classes(input), [], { type: 'number', tabindex: '0', role: 'spinbutton' })],
        { 'data-md3-ripple': '' },
      ),
      makeBox('div', classes(caption)),
    ]);
  const colon = (): Box =>
    makeBox('div', classes('tp-ui-dots'), [makeBox('span', classes()), makeBox('span', classes())], {
      'aria-hidden': 'true',
    });
  const period = (type: 'am' | 'pm'): Box =>
    makeBox('div', classes('tp-ui-type-mode', `tp-ui-${type}`), [], {
      'data-md3-ripple': '',
      tabindex: '0',
      role: 'button',
      'data-type': type.toUpperCase(),
    });
  const timeClasses =
    clockType === '24h'
      ? classes('tp-ui-wrapper-time', 'tp-ui-wrapper-time-24h')
      : classes('tp-ui-wrapper-time');
  const time = makeBox(
    'div',
    timeClasses,
    [
      field('tp-ui-hour', 'tp-ui-hour-text'),
      colon(),
      field('tp-ui-minutes', 'tp-ui-minute-text'),
      colon(),
      field(SECONDS_INPUT, 'tp-ui-second-text'),
    ],
    { role: 'group' },
  );
  const period12h = makeBox('div', classes('tp-ui-wrapper-type-time'), [period('am'), period('pm')], {
    role: 'group',
  });
  const header = makeBox('div', classes('tp-ui-header'), clockType === '12h' ? [time, period12h] : [time]);
  const modalClasses = ['tp-ui-modal', 'normalize', 'tp-ui-has-seconds'];
  if (view === 'keyboard') modalClasses.push('mobile');
  const wrapper = makeBox('div', ['tp-ui-wrapper', state], [header], { tabindex: '0' });
  const modal = makeBox('div', modalClasses, [wrapper], { 'data-theme': 'basic', role: 'dialog' });
  const root = makeBox('html', [], [makeBox('body', [], [modal])]);
  root.states.push('root');
  return header;
};

describe('compiled main.scss states', () => {
  const rules = compileRules('main.scss');
  const themes = loadThemes();
  const basic = themes.get('basic') as Scope;

  it('no theme declares --tp-selection-ring and no compiled rule declares or reads it (the crane selection ring is removed)', () => {
    const declaringThemes = [...themes]
      .filter(([, { tokens }]) => tokens.has('--tp-selection-ring'))
      .map(([name]) => name);
    const compiledUses = offenders(
      rules,
      () => true,
      ({ prop, value }) => SELECTION_RING_TOKEN.test(prop) || SELECTION_RING_TOKEN.test(value),
    );

    expect(declaringThemes).toEqual([]);
    expect(compiledUses).toEqual([]);
  });

  describe('hover is a state layer only', () => {
    it('AM/PM :hover paints no background or colour, leaving [data-md3-ripple] as the only cue (drop the hover fill from _am-pm.scss)', () => {
      const amPmHover = (selector: string): boolean => {
        const subject = subjectOf(selector);
        const classes = classesOf(subject);
        return (
          classes.some((name) => AM_PM.includes(name)) &&
          !classes.includes('active') &&
          hasPseudoClass(subject, 'hover')
        );
      };

      expect(offenders(rules, amPmHover, paints)).toEqual([]);
    });

    it('the switch icon keeps --tp-text-icon on :hover: no hover rule repaints it or its wrapper (drop the --tp-primary fill from _keyboard-icon.scss)', () => {
      const switchIconHover = (selector: string): boolean =>
        hasPseudoClass(selector, 'hover') &&
        compounds(selector).some((compound) => classesOf(compound).some((name) => SWITCH_ICON.includes(name)));

      expect(offenders(rules, switchIconHover, paints)).toEqual([]);
    });
  });

  describe('focus rings are never removed', () => {
    const footerButtons: [string, Target][] = [
      ['OK', footerButton('tp-ui-ok-btn', false)],
      ['mobile OK', footerButton('tp-ui-ok-btn', true)],
      ['Cancel', footerButton('tp-ui-cancel-btn', false)],
      ['mobile Cancel', footerButton('tp-ui-cancel-btn', true)],
      ['Clear', footerButton('tp-ui-clear-btn', false)],
      ['mobile Clear', footerButton('tp-ui-clear-btn', true)],
    ];

    it('no :focus-visible rule on the footer buttons sets outline none or 0 (remove the reset from _buttons.scss)', () => {
      const footerFocusVisible = (selector: string): boolean =>
        subjectHasClass(selector, FOOTER_BUTTONS) && hasPseudoClass(subjectOf(selector), 'focus-visible');

      expect(offenders(rules, footerFocusVisible, removesOutline)).toEqual([]);
    });

    it('no selector targets .btn-mobile, a class no template renders (fix the &-ok.btn-mobile typo to &-ok-btn.mobile)', () => {
      const dead = rules
        .flatMap(({ selectors }) => selectors)
        .filter((selector) => UNRENDERED_BTN_MOBILE.test(selector));

      expect(dead).toEqual([]);
    });

    it('mobile OK resolves the same :focus-visible ring as mobile Cancel', () => {
      expect(focusRing(rules, footerButton('tp-ui-ok-btn', true))).toEqual(
        focusRing(rules, footerButton('tp-ui-cancel-btn', true)),
      );
    });

    it.each<[string, Target]>([...footerButtons, ['timezone dropdown', TIMEZONE_DROPDOWN]])(
      '%s resolves its :focus-visible outline to the shared --tp-focus-ring',
      (_name, target) => {
        expect(computedValue(rules, target, 'outline') ?? '').toMatch(FOCUS_RING);
      },
    );

    it('timezone dropdown: no plain :focus rule after the focus ring sets outline none (scope the reset to :focus:not(:focus-visible))', () => {
      const dropdown = ['tp-ui-timezone-dropdown'];
      const ringIndex = rules.findIndex(
        ({ selectors, declarations }) =>
          selectors.some(
            (selector) =>
              subjectHasClass(selector, dropdown) && hasPseudoClass(subjectOf(selector), 'focus-visible'),
          ) && declarations.some(({ prop, value }) => prop === 'outline' && FOCUS_RING.test(value)),
      );
      const plainFocus = (selector: string): boolean => {
        const subject = subjectOf(selector);
        return (
          subjectHasClass(selector, dropdown) &&
          hasPseudoClass(subject, 'focus') &&
          !FOCUS_VISIBLE_RESET.test(subject)
        );
      };

      expect(ringIndex).toBeGreaterThanOrEqual(0);
      expect(offenders(rules.slice(ringIndex + 1), plainFocus, removesOutline)).toEqual([]);
    });

    it.each<[string, boolean]>([
      ['desktop', false],
      ['mobile', true],
    ])(
      'a keyboard-focused %s view switch button shows the shared --tp-focus-ring outline on itself or on its wrapper via :has()',
      (_view, mobile) => {
        const outlines = [
          computedValue(rules, SWITCH_BUTTON, 'outline'),
          computedValue(rules, switchWrapper(mobile), 'outline'),
        ];

        expect(outlines).toEqual(expect.arrayContaining([expect.stringMatching(FOCUS_RING)]));
      },
    );

    it('no selector puts :focus-visible on the non-focusable .tp-ui-keyboard-icon-wrapper (drop it from the focus lists in _accessibility.scss)', () => {
      const wrapperFocusVisible = rules
        .flatMap(({ selectors }) => selectors)
        .filter((selector) =>
          compounds(selector).some(
            (compound) =>
              classesOf(compound).includes('tp-ui-keyboard-icon-wrapper') && hasPseudoClass(compound, 'focus-visible'),
          ),
        );

      expect(wrapperFocusVisible).toEqual([]);
    });
  });

  describe('hour/minute input focus ring inside the overflow clip', () => {
    const inputs = [false, true].flatMap((mobile) =>
      TIME_INPUTS.map((className): [string, Target] => [
        `${mobile ? 'mobile ' : ''}.${className}`,
        timeInput(className, mobile),
      ]),
    );

    const lengthOf = (value: string): number => pixels(substituteVars(basic, value));

    it('no :focus-visible rule on the hour/minute inputs sets outline none or 0 (remove the reset from _time-inputs.scss)', () => {
      const inputFocusVisible = (selector: string): boolean =>
        subjectHasClass(selector, TIME_INPUTS) && hasPseudoClass(subjectOf(selector), 'focus-visible');

      expect(offenders(rules, inputFocusVisible, removesOutline)).toEqual([]);
    });

    it.each(inputs)(
      'a keyboard-focused %s input draws the shared --tp-focus-ring inside the clip (outline-offset of at least minus the outline width, or an inset ring)',
      (_name, target) => {
        const [outline, offset, shadow] = ['outline', 'outline-offset', 'box-shadow'].map(
          (prop) => computedValue(rules, target, prop) ?? '',
        );
        const outlineWidth = lengthOf(substituteVars(basic, outline).match(FIRST_LENGTH)?.[0] ?? '0');
        const outlineInside = FOCUS_RING.test(outline) && lengthOf(offset) <= -outlineWidth;
        const insetRing = INSET.test(shadow) && FOCUS_RING_TOKEN.test(shadow);

        expect({ outline, offset, shadow, insideClip: outlineInside || insetRing }).toMatchObject({
          insideClip: true,
        });
      },
    );
  });

  describe('theme radius reaches the use site', () => {
    const radiusAt = (selector: string): string | undefined =>
      topLevel(rules)
        .filter(({ selectors }) => selectors.includes(selector))
        .flatMap(({ declarations }) => declarations)
        .filter(({ prop }) => prop === 'border-radius')
        .map(({ value }) => value)
        .pop();

    const normalizeLength = (value: string): string => value.replace(/^0[a-z%]*$/i, '0');

    it.each([
      {
        theme: 'crane-straight',
        part: 'wheel selection highlight',
        selector: '.tp-ui-wheel-highlight',
        token: '--tp-radius-md',
      },
      { theme: 'crane-straight', part: 'popover', selector: POPOVER_WRAPPER, token: '--tp-border-radius' },
      { theme: 'm2', part: 'popover', selector: POPOVER_WRAPPER, token: '--tp-border-radius' },
    ])(
      '$theme: the $part radius follows the theme $token (stop composing it once on :root)',
      ({ theme, selector, token }) => {
        const scope = themes.get(theme) as Scope;
        const useSite = radiusAt(selector);

        expect(scope.tokens.has(token)).toBe(true);
        expect(useSite).toBeDefined();
        expect(normalizeLength(resolveValue(scope, useSite as string))).toBe(
          normalizeLength(resolveValue(scope, `var(${token})`)),
        );
      },
    );

    it.each([
      { theme: 'crane-straight', expected: '0' },
      { theme: 'basic', expected: '8px' },
    ])(
      '$theme: the inline wrapper radius resolves to $expected through the theme radius token',
      ({ theme, expected }) => {
        const useSite = radiusAt(INLINE_WRAPPERS[0]);

        expect(useSite).toBeDefined();
        expect(normalizeLength(resolveValue(themes.get(theme) as Scope, useSite as string))).toBe(expected);
      },
    );

    it('the inline wrapper border-radius reads a theme token, not a literal (replace border-radius: 8px !important in _inline.scss)', () => {
      const literals = offenders(
        rules,
        (selector) => INLINE_WRAPPERS.includes(selector),
        ({ prop, value }) => prop === 'border-radius' && !value.includes('var('),
      );

      expect(literals).toEqual([]);
    });
  });

  describe('the seconds input shares the hour/minute input states', () => {
    const views: Array<[string, boolean]> = [
      ['desktop', false],
      ['mobile', true],
    ];

    it.each(views)(
      'a keyboard-focused %s .tp-ui-seconds resolves the same :focus-visible ring as .tp-ui-hour, inset inside the clip',
      (_view, mobile) => {
        const hour = focusRing(rules, timeInput('tp-ui-hour', mobile));
        const seconds = focusRing(rules, timeInput(SECONDS_INPUT, mobile));

        expect(hour.outline ?? '').toMatch(FOCUS_RING);
        expect(seconds).toEqual(hour);
        expect(pixels(substituteVars(basic, seconds['outline-offset'] ?? '0'))).toBeLessThan(0);
      },
    );

    it.each(views)(
      'an active keyboard-focused %s .tp-ui-seconds rings in --tp-on-primary-container like .tp-ui-hour',
      (_view, mobile) => {
        const ringColor = (className: string): string | undefined =>
          computedValue(rules, activeTimeInput(className, mobile), 'outline-color');

        expect(ringColor(SECONDS_INPUT)).toBe('var(--tp-on-primary-container)');
        expect(ringColor(SECONDS_INPUT)).toBe(ringColor('tp-ui-hour'));
      },
    );

    const MEDIA_GROUPS = [
      { group: 'prefers-contrast', feature: PREFERS_CONTRAST },
      { group: 'forced-colors', feature: FORCED_COLORS },
    ].flatMap((media) =>
      views.flatMap(([view, mobile]) =>
        [false, true].map((active) => ({
          ...media,
          view,
          mobile,
          active,
          state: active ? 'active' : 'idle',
        })),
      ),
    );

    it.each(MEDIA_GROUPS)(
      'a keyboard-focused $state $view .tp-ui-seconds gets the same $group outline as .tp-ui-hour',
      ({ feature, mobile, active }) => {
        const group = rules.filter(({ atRules }) => atRules.some((atRule) => feature.test(atRule)));
        const outlineOf = (className: string): Record<string, string | undefined> => {
          const target = active ? activeTimeInput(className, mobile) : timeInput(className, mobile);
          return Object.fromEntries(OUTLINE_PROPS.map((prop) => [prop, cascadedValue(group, target, prop)]));
        };
        const hour = outlineOf('tp-ui-hour');

        expect(Object.values(hour).some((value) => value !== undefined)).toBe(true);
        expect(outlineOf(SECONDS_INPUT)).toEqual(hour);
      },
    );
  });

  describe('the header with seconds fits the wrapper content box', () => {
    const DESKTOP: Viewport = { name: 'desktop 1280x800', width: 1280, height: 800, hover: true };
    const PHONE: Viewport = { name: 'phone 390x844', width: 390, height: 844, hover: false };
    const SMALL_PHONE: Viewport = { name: 'phone 320x568', width: 320, height: 568, hover: false };
    const CONTENT_BOX = 280;
    const SMALL_PHONE_CONTENT_BOX = 267;

    type HeaderCase = { clockType: '12h' | '24h'; view: HeaderView; viewport: Viewport; limit: number };

    const HEADER_CASES: HeaderCase[] = [
      { clockType: '12h', view: 'clock', viewport: DESKTOP, limit: CONTENT_BOX },
      { clockType: '12h', view: 'clock', viewport: SMALL_PHONE, limit: SMALL_PHONE_CONTENT_BOX },
      { clockType: '12h', view: 'keyboard', viewport: PHONE, limit: CONTENT_BOX },
      { clockType: '12h', view: 'keyboard', viewport: SMALL_PHONE, limit: SMALL_PHONE_CONTENT_BOX },
      { clockType: '24h', view: 'clock', viewport: DESKTOP, limit: CONTENT_BOX },
      { clockType: '24h', view: 'keyboard', viewport: PHONE, limit: CONTENT_BOX },
    ];

    it.each(HEADER_CASES)(
      'the $clockType $view-view header (three fields, two colons, period column, margins) needs at most $limit px on $viewport.name',
      ({ clockType, view, viewport, limit }) => {
        const layout = headerContent(rules, secondsHeader(clockType, view), viewport);

        expect({ fits: layout.width <= limit, width: layout.width, items: layout.parts }).toMatchObject({
          fits: true,
        });
      },
    );
  });

  describe('landscape keyboard-view size tokens', () => {
    it('declares the collapse width and the plain/range/timezone heights on :root with the built-in sizes', () => {
      const declared = new Map(
        topLevel(rules)
          .filter(({ selectors }) => selectors.includes(':root'))
          .flatMap(({ declarations }) => declarations)
          .map(({ prop, value }): [string, string] => [prop, value]),
      );
      const tokens = Object.fromEntries(
        Object.keys(LANDSCAPE_SIZE_TOKENS).map((token) => [token, declared.get(token)]),
      );

      expect(tokens).toEqual(LANDSCAPE_SIZE_TOKENS);
    });
  });

  describe('a single focus ring on the shared controls', () => {
    const sharedFocusVisible = (selector: string): boolean =>
      subjectHasClass(selector, SHARED_FOCUS_CONTROLS) && hasPseudoClass(subjectOf(selector), 'focus-visible');

    it('no :focus-visible box-shadow on the shared controls adds a --tp-focus-ring-halo layer or a --tp-bg gap', () => {
      const secondRing = offenders(
        rules,
        sharedFocusVisible,
        ({ prop, value }) => prop === 'box-shadow' && (FOCUS_RING_HALO.test(value) || BG_TOKEN.test(value)),
      );

      expect(secondRing).toEqual([]);
    });

    it.each(SHARED_FOCUS_CONTROLS)(
      'a keyboard-focused .%s resolves its box-shadow to var(--tp-shadow-focus-ring, none)',
      (className) => {
        expect(computedValue(rules, focusedControl(className), 'box-shadow')).toBe(SINGLE_RING_SHADOW);
      },
    );

    it('no built-in theme sets --tp-shadow-focus-ring, so the shared focus box-shadow stays none', () => {
      const themed = [...themes]
        .filter(([, scope]) => resolveValue(scope, SINGLE_RING_SHADOW) !== 'none')
        .map(([name]) => name);

      expect(themed).toEqual([]);
    });

    it('--tp-focus-ring-halo is declared nowhere (variables.scss or any theme file) and no compiled rule reads it', () => {
      const declaring = [VARIABLES_PATH, ...themeFiles.map((file) => join(STYLES_DIR, 'themes', file))]
        .filter((path) => FOCUS_RING_HALO_DECLARATION.test(readScss(path)))
        .map((path) => relative(STYLES_DIR, path));
      const compiledUses = offenders(
        rules,
        () => true,
        ({ prop, value }) => FOCUS_RING_HALO.test(prop) || FOCUS_RING_HALO.test(value),
      );

      expect(declaring).toEqual([]);
      expect(compiledUses).toEqual([]);
    });

    it.each(['crane', 'crane-straight'])(
      '%s resolves the focus ring to its own --tp-outline, not white',
      (theme) => {
        const scope = themes.get(theme) as Scope;
        const ring = resolveValue(scope, 'var(--tp-focus-ring, var(--tp-primary))');

        expect(scope.tokens.has('--tp-outline')).toBe(true);
        expect(ring).toBe(resolveValue(scope, 'var(--tp-outline)'));
        expect(ring).not.toMatch(WHITE);
      },
    );
  });

  describe('the wheel columns and range tabs draw the shared focus ring', () => {
    const WHEEL_COLUMN: Target = {
      tag: 'div',
      classes: ['tp-ui-wheel-column', 'tp-ui-wheel-hours'],
      attributes: { role: 'listbox', tabindex: '0', 'aria-activedescendant': '' },
      states: FOCUSED,
    };
    const RANGE_TAB: Target = {
      tag: 'button',
      classes: ['tp-ui-range-tab', 'tp-ui-range-from', 'active'],
      attributes: {
        type: 'button',
        role: 'tab',
        tabindex: '0',
        'aria-selected': 'true',
        'data-md3-ripple': '',
      },
      states: FOCUSED,
    };
    const CONTROLS: Array<[string, Target]> = [
      ['.tp-ui-wheel-column', WHEEL_COLUMN],
      ['.tp-ui-range-tab', RANGE_TAB],
    ];

    it.each(CONTROLS)(
      'a keyboard-focused %s resolves its outline to --tp-focus-ring at --tp-outline-width-thick',
      (_name, target) => {
        const outline = winningDeclaration(topLevel(rules), target, ['outline', 'outline-width']);
        const [width, style, color] = words(outline?.value ?? '');

        expect(outline?.prop).toBe('outline');
        expect({ width, style }).toEqual({ width: 'var(--tp-outline-width-thick)', style: 'solid' });
        expect(color).toMatch(FOCUS_RING);
      },
    );

    it.each(CONTROLS)(
      'prefers-contrast: more: a keyboard-focused %s keeps the --tp-focus-ring outline at --tp-outline-width-contrast',
      (_name, target) => {
        const contrast = activeUnder(rules, PREFERS_CONTRAST);
        const ring = winningDeclaration(contrast, target, ['outline', 'outline-color']);

        expect(winningDeclaration(contrast, target, ['outline', 'outline-width'])).toMatchObject({
          prop: 'outline-width',
          value: 'var(--tp-outline-width-contrast)',
        });
        expect(ring?.value ?? '').toMatch(FOCUS_RING);
      },
    );
  });

  describe('the AM/PM focus ring is drawn inside the segment', () => {
    const MEDIA = [
      { media: 'no media query', feature: undefined },
      { media: 'prefers-contrast: more', feature: PREFERS_CONTRAST },
      { media: 'forced-colors: active', feature: FORCED_COLORS },
    ];
    const INSET_CASES = MEDIA.flatMap((media) =>
      PERIOD_SEGMENTS.flatMap((className) =>
        [false, true].map((selected) => ({
          ...media,
          className,
          selected,
          state: selected ? 'selected' : 'unselected',
        })),
      ),
    );

    const lengthOf = (value: string | undefined): number => pixels(substituteVars(basic, value ?? '0'));

    const outlineWidth = (active: CssRule[], target: Target): number => {
      const declaration = winningDeclaration(active, target, ['outline', 'outline-width']);
      if (declaration?.prop !== 'outline') return lengthOf(declaration?.value);
      return lengthOf(substituteVars(basic, declaration.value).match(FIRST_LENGTH)?.[0]);
    };

    it.each(INSET_CASES)(
      '$media: a keyboard-focused $state .$className has an outline-offset of minus its outline width',
      ({ feature, className, selected }) => {
        const active = activeUnder(rules, feature);
        const target = periodSegment(className, selected);
        const width = outlineWidth(active, target);
        const offset = lengthOf(winningDeclaration(active, target, ['outline-offset'])?.value);

        expect(width).toBeGreaterThan(0);
        expect({ width, offset }).toEqual({ width, offset: -width });
      },
    );

    it.each(PERIOD_SEGMENTS)(
      'prefers-contrast: more: a keyboard-focused .%s draws its ring at --tp-outline-width-contrast',
      (className) => {
        const width = outlineWidth(activeUnder(rules, PREFERS_CONTRAST), periodSegment(className, false));

        expect(width).toBe(lengthOf('var(--tp-outline-width-contrast)'));
      },
    );

    it.each(
      [
        { media: 'no media query', feature: undefined, color: 'var(--tp-am-pm-text-selected)' },
        { media: 'forced-colors: active', feature: FORCED_COLORS, color: 'HighlightText' },
      ].flatMap((media) => PERIOD_SEGMENTS.map((className) => ({ ...media, className }))),
    )('$media: a keyboard-focused selected .$className rings in $color', ({ feature, className, color }) => {
      const ring = winningDeclaration(activeUnder(rules, feature), periodSegment(className, true), [
        'outline',
        'outline-color',
      ]);

      expect(ring).toMatchObject({ prop: 'outline-color', value: color });
    });
  });

  describe('forced-colors: active fills the selected AM/PM segment and the active time field with Highlight', () => {
    const forcedColors = activeUnder(rules, FORCED_COLORS);
    const SELECTED_PARTS: Array<[string, Target]> = [
      ...PERIOD_SEGMENTS.map((className): [string, Target] => [
        `selected .${className}`,
        periodSegment(className, true),
      ]),
      ...[...TIME_INPUTS, SECONDS_INPUT].map((className): [string, Target] => [
        `active .${className}`,
        activeTimeInput(className, false),
      ]),
    ];
    const FILL_CASES = SELECTED_PARTS.flatMap(([part, target]) => [
      { part, state: 'idle', target: { ...target, states: [] } },
      { part, state: 'keyboard-focused', target },
    ]);

    it.each(FILL_CASES)(
      'a $state $part keeps its own colours (forced-color-adjust: none) on a Highlight fill with HighlightText text',
      ({ target }) => {
        const valueOf = (props: string[]): string | undefined =>
          winningDeclaration(forcedColors, target, props)?.value;

        expect({
          'forced-color-adjust': valueOf(['forced-color-adjust']),
          background: valueOf(['background', 'background-color']),
          color: valueOf(['color']),
        }).toEqual({
          'forced-color-adjust': 'none',
          background: 'Highlight',
          color: 'HighlightText',
        });
      },
    );

    it.each([...TIME_INPUTS, SECONDS_INPUT])(
      'a keyboard-focused active .%s rings in HighlightText, visible on its Highlight fill',
      (className) => {
        const ring = winningDeclaration(forcedColors, activeTimeInput(className, false), [
          'outline',
          'outline-color',
        ]);

        expect(ring).toMatchObject({ prop: 'outline-color', value: 'HighlightText' });
      },
    );
  });

  describe('the modal box model', () => {
    const DESKTOP: Viewport = { name: 'desktop 1280x800', width: 1280, height: 800, hover: true };

    const modalParts = (): Array<[string, Box]> => {
      const hour = makeBox('input', ['tp-ui-hour'], [], { type: 'number', tabindex: '0', role: 'spinbutton' });
      const unclassed = makeBox('span', []);
      const header = makeBox('div', ['tp-ui-header'], [makeBox('div', ['tp-ui-input-wrapper'], [hour])]);
      const wrapper = makeBox('div', ['tp-ui-wrapper'], [header, unclassed], { tabindex: '0' });
      const modal = makeBox('div', ['tp-ui-modal', 'normalize'], [wrapper], {
        'data-theme': 'basic',
        role: 'dialog',
      });
      makeBox('html', [], [makeBox('body', [], [modal])]).states.push('root');
      return [
        ['the .tp-ui-modal itself', modal],
        ['its .tp-ui-wrapper child', wrapper],
        ['a nested .tp-ui-hour input', hour],
        ['an unclassed descendant', unclassed],
      ];
    };

    it.each(modalParts())('%s uses box-sizing: border-box without a .tp-ui ancestor', (_part, box) => {
      expect(styleOf(rules, box, DESKTOP).style('box-sizing')).toBe('border-box');
    });
  });
});

describe('compiled stylesheet fonts and contrast media', () => {
  const mainCss = compileCss('main.scss');
  const shippedCss = compileCss('index.scss');
  const shippedRules = rulesOf(shippedCss);

  const WRAPPER_FONT = 'var(--tp-font-family, "Roboto", sans-serif)';
  const MODAL_FIELDS = '.tp-ui-modal :is(input,button)';

  const sameQuotes = (value: string): string => value.replace(/'/g, '"');
  const compactSelector = (selector: string): string =>
    selector
      .replace(/\s*([(),])\s*/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  const wrapper = (classes: string[]): Target => ({
    tag: 'div',
    classes: ['tp-ui-wrapper', ...classes],
    attributes: { tabindex: '0' },
    states: [],
  });

  it.each<[string, Target]>([
    ['desktop', wrapper(['expanded'])],
    ['mobile', wrapper(['mobile'])],
  ])(`the %s .tp-ui-wrapper resolves font-family to ${WRAPPER_FONT}`, (_view, target) => {
    expect(sameQuotes(computedValue(shippedRules, target, 'font-family') ?? '')).toBe(WRAPPER_FONT);
  });

  it(`${MODAL_FIELDS} declares font-family: inherit (asserted on the compiled rules: the selector matcher cannot evaluate :is())`, () => {
    const fieldFonts = topLevel(shippedRules)
      .filter(({ selectors }) => selectors.map(compactSelector).includes(MODAL_FIELDS))
      .flatMap(({ declarations }) => declarations)
      .filter(({ prop }) => prop === 'font-family')
      .map(({ value }) => value);

    expect(fieldFonts).toEqual(['inherit']);
  });

  it('no rule sets font-family or the font shorthand on .tp-ui-modal itself', () => {
    const modalFonts = offenders(
      shippedRules,
      (selector) => classesOf(subjectOf(selector)).includes('tp-ui-modal'),
      ({ prop }) => prop === 'font-family' || prop === 'font',
    );

    expect(modalFonts).toEqual([]);
  });

  it('no compiled stylesheet queries prefers-contrast: high, and main.scss queries prefers-contrast: more', () => {
    expect(shippedCss).not.toMatch(PREFERS_CONTRAST_HIGH);
    expect(mainCss).toMatch(PREFERS_CONTRAST);
  });
});
