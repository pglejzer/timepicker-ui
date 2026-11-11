/**
 * @jest-environment node
 */
import { join } from 'path';
import { parse } from 'postcss';
import type { AtRule, Declaration, Rule } from 'postcss';
import { Logger, compile } from 'sass';
import { STYLES_DIR } from './style-test-helpers';

type Viewport = { width: number; height: number };
type Node = { classes: string[]; attributes: Record<string, string>; parent?: Node };
type CssRule = { selectors: string[]; declarations: Array<{ prop: string; value: string }>; media: string[] };

const SIMPLE_SELECTOR = /\.[\w-]+|\[[^\]]*\]|::?[\w-]+(?:\((?:[^()]|\([^()]*\))*\))?|\*|[a-z][\w-]*/gi;
const ATTRIBUTE = /^\[\s*([\w-]+)\s*(?:=\s*['"]?([^'"\]]*)['"]?\s*)?\]$/;
const MEDIA_FEATURE = /\(\s*([\w-]+)\s*:\s*([^)]+?)\s*\)/g;
const DIALOG_CAP = 'calc(100dvh - 2 * var(--tp-spacing-lg))';
const POPOVER_TRY_BLOCK = 'calc(100% - 2 * var(--tp-popover-gap))';

const DESKTOP: Viewport = { width: 1280, height: 800 };
const PHONE_PORTRAIT: Viewport = { width: 390, height: 844 };
const SHORT_LANDSCAPE: Viewport = { width: 800, height: 400 };

const mediaOf = (rule: Rule): string[] => {
  const chain: string[] = [];
  let parent = rule.parent as AtRule | undefined;
  while (parent?.type === 'atrule') {
    chain.unshift(`@${parent.name} ${parent.params}`);
    parent = parent.parent as AtRule | undefined;
  }
  return chain;
};

const css = compile(join(STYLES_DIR, 'main.scss'), { style: 'expanded', logger: Logger.silent }).css;
const root = parse(css);

const rules: CssRule[] = [];
root.walkRules((rule) => {
  const media = mediaOf(rule);
  if (media.some((entry) => /^@[\w-]*keyframes\b/.test(entry))) return;
  rules.push({
    selectors: rule.selectors.map((selector) => selector.trim()),
    declarations: rule.nodes
      .filter((node): node is Declaration => node.type === 'decl')
      .map(({ prop, value }) => ({ prop, value: value.trim() })),
    media,
  });
});

const positionTry = new Map<string, Map<string, string>>();
root.walkAtRules('position-try', (atRule) => {
  const declarations = new Map<string, string>();
  atRule.walkDecls((decl) => declarations.set(decl.prop, decl.value.trim()));
  positionTry.set(atRule.params.trim(), declarations);
});

const mediaQueryMatches = (query: string, { width, height }: Viewport): boolean => {
  let text = query.trim().toLowerCase();
  const negated = /^not\s+/.test(text);
  text = text.replace(/^not\s+/, '').replace(/^only\s+/, '');
  const type = text.match(/^(screen|all|print)\b/)?.[1] ?? 'all';
  const features = [...text.matchAll(MEDIA_FEATURE)].every(([, feature, value]) => {
    if (feature === 'orientation') return value === (height >= width ? 'portrait' : 'landscape');
    if (feature === 'max-height') return height <= parseFloat(value);
    if (feature === 'min-height') return height >= parseFloat(value);
    if (feature === 'max-width') return width <= parseFloat(value);
    if (feature === 'min-width') return width >= parseFloat(value);
    return false;
  });
  const result = (type === 'screen' || type === 'all') && features;
  return negated ? !result : result;
};

const splitDepthZero = (value: string, separator: RegExp): string[] => {
  const parts = [''];
  let depth = 0;
  [...value].forEach((char) => {
    if (char === '(' || char === '[') depth += 1;
    if (char === ')' || char === ']') depth -= 1;
    if (depth === 0 && separator.test(char)) parts.push('');
    else parts[parts.length - 1] += char;
  });
  return parts.map((part) => part.trim()).filter(Boolean);
};

const atRuleActive = (atRule: string, viewport: Viewport): boolean => {
  const media = /^@media\s+([\s\S]+)$/.exec(atRule)?.[1];
  if (media === undefined) return false;
  return splitDepthZero(media, /,/).some((query) => mediaQueryMatches(query, viewport));
};

const simples = (compound: string): string[] => compound.match(SIMPLE_SELECTOR) ?? [];

const notArguments = (simple: string): string[] =>
  splitDepthZero(simple.slice(simple.indexOf('(') + 1, -1), /,/);

const matchesSimple = (simple: string, node: Node): boolean => {
  if (simple.startsWith(':not(')) return !notArguments(simple).some((arg) => matchesCompound(arg, node));
  if (simple.startsWith(':')) return false;
  if (simple.startsWith('.')) return node.classes.includes(simple.slice(1));
  if (simple.startsWith('[')) {
    const [, name, value] = simple.match(ATTRIBUTE) ?? [];
    if (name === undefined || !(name in node.attributes)) return false;
    return value === undefined || node.attributes[name] === value;
  }
  return simple === '*' || simple.toLowerCase() === 'div';
};

const matchesCompound = (compound: string, node: Node): boolean =>
  simples(compound).every((simple) => matchesSimple(simple, node));

const parseComplex = (selector: string): { parts: string[]; combinators: string[] } => {
  const parts: string[] = [];
  const combinators: string[] = [];
  let current = '';
  let pending = '';
  let depth = 0;
  [...selector.trim()].forEach((char) => {
    if (char === '(' || char === '[') depth += 1;
    if (char === ')' || char === ']') depth -= 1;
    if (depth === 0 && /[\s>]/.test(char)) {
      if (current) {
        parts.push(current);
        current = '';
        pending = ' ';
      }
      if (char === '>') pending = '>';
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

const matchesFrom = (complex: ReturnType<typeof parseComplex>, index: number, node: Node): boolean => {
  if (!matchesCompound(complex.parts[index], node)) return false;
  if (index === 0) return true;
  if (complex.combinators[index - 1] === '>') {
    return node.parent !== undefined && matchesFrom(complex, index - 1, node.parent);
  }
  for (let ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
    if (matchesFrom(complex, index - 1, ancestor)) return true;
  }
  return false;
};

const matchesComplex = (selector: string, node: Node): boolean => {
  const complex = parseComplex(selector);
  return complex.parts.length > 0 && matchesFrom(complex, complex.parts.length - 1, node);
};

const compoundSpecificity = (compound: string): number =>
  simples(compound).reduce((sum, simple) => {
    if (simple.startsWith(':not(')) return sum + Math.max(...notArguments(simple).map(compoundSpecificity));
    if (simple.startsWith('::')) return sum + 1;
    if (simple === '*') return sum;
    if (/^[a-z]/i.test(simple)) return sum + 1;
    return sum + 100;
  }, 0);

const specificityOf = (selector: string): number =>
  parseComplex(selector).parts.reduce((sum, compound) => sum + compoundSpecificity(compound), 0);

const computed = (node: Node, prop: string, viewport: Viewport = DESKTOP): string | undefined => {
  let winner: { value: string; specificity: number } | undefined;
  rules.forEach(({ selectors, declarations, media }) => {
    if (!media.every((atRule) => atRuleActive(atRule, viewport))) return;
    const matching = selectors.filter((selector) => matchesComplex(selector, node));
    if (matching.length === 0) return;
    const specificity = Math.max(...matching.map(specificityOf));
    declarations
      .filter((declaration) => declaration.prop === prop)
      .forEach(({ value }) => {
        if (!winner || specificity >= winner.specificity) winner = { value, specificity };
      });
  });
  return winner?.value;
};

const node = (classes: string[], parent?: Node, attributes: Record<string, string> = {}): Node => ({
  classes,
  attributes,
  parent,
});

const modalOf = (...classes: string[]): Node => node(['tp-ui-modal', ...classes]);

const layout = (modal: Node) => {
  const wrapper = node(['tp-ui-wrapper', 'expanded'], modal);
  const rangePanel = node(['tp-ui-range-panel'], wrapper);
  return {
    wrapper,
    clock: node(['tp-ui-mobile-clock-wrapper', 'expanded'], wrapper),
    footer: node(['tp-ui-footer'], wrapper),
    rangeHeader: node(['tp-ui-range-header'], wrapper),
    panelChild: node(['tp-ui-range-header'], rangePanel),
  };
};

describe('compiled main.scss wheel popover and dialog sizing', () => {
  describe('anchored popover', () => {
    const modal = modalOf('tp-ui-compact-wheel-mode', 'tp-ui-popover', 'tp-ui-popover-anchored');
    const parts = layout(modal);

    it('lets the clock wrapper shrink around the selected row while the footer and range header keep their size', () => {
      expect(computed(parts.clock, 'flex-shrink')).toBe('1');
      expect(computed(parts.clock, 'min-height')).toBe('var(--tp-wheel-item-height)');
      expect(computed(parts.footer, 'flex-shrink')).toBe('0');
      expect(computed(parts.rangeHeader, 'flex-shrink')).toBe('0');
      expect(computed(parts.panelChild, 'flex-shrink')).toBe('0');
    });

    it('scrolls the wrapper without a visible scrollbar', () => {
      expect(computed(parts.wrapper, 'overflow-y')).toBe('auto');
      expect(computed(parts.wrapper, 'scrollbar-width')).toBe('none');
      const hidesWebkitScrollbar = rules.some(
        ({ selectors, declarations }) =>
          selectors.some((selector) => /popover-anchored .tp-ui-wrapper::-webkit-scrollbar$/.test(selector)) &&
          declarations.some(({ prop, value }) => prop === 'display' && value === 'none'),
      );
      expect(hidesWebkitScrollbar).toBe(true);
    });

    it('does not take the dialog viewport cap', () => {
      expect(computed(parts.wrapper, 'max-height') ?? 'none').not.toContain('100dvh');
    });
  });

  describe('constrained popover (JS fallback)', () => {
    const modal = modalOf('tp-ui-compact-wheel-mode', 'tp-ui-popover', 'tp-ui-popover-constrained');
    const parts = layout(modal);

    it('shrinks the clock wrapper, hides the scrollbar and caps the wrapper at the measured available height', () => {
      expect(computed(parts.clock, 'flex-shrink')).toBe('1');
      expect(computed(parts.footer, 'flex-shrink')).toBe('0');
      expect(computed(parts.wrapper, 'scrollbar-width')).toBe('none');
      expect(computed(parts.wrapper, 'max-height')).toBe('var(--tp-popover-available-height)');
    });
  });

  describe.each([['wheel mode', 'tp-ui-wheel-mode'], ['compact-wheel mode', 'tp-ui-compact-wheel-mode']])(
    '%s dialog',
    (_name, modeClass) => {
      const dialog = layout(modalOf(modeClass));
      const inline = layout(modalOf(modeClass, 'tp-ui--inline'));
      const popover = layout(modalOf(modeClass, 'tp-ui-popover'));

      it.each([
        ['desktop', DESKTOP],
        ['portrait phone', PHONE_PORTRAIT],
      ])('caps the wrapper at the dynamic viewport height and shrinks the wheel area on a %s', (_v, viewport) => {
        expect(computed(dialog.wrapper, 'max-height', viewport)).toBe(DIALOG_CAP);
        expect(computed(dialog.clock, 'flex-shrink', viewport)).toBe('1');
        expect(computed(dialog.clock, 'min-height', viewport)).toBe('var(--tp-wheel-item-height)');
        expect(computed(dialog.footer, 'flex-shrink', viewport)).toBe('0');
        expect(computed(dialog.rangeHeader, 'flex-shrink', viewport)).toBe('0');
        expect(computed(dialog.panelChild, 'flex-shrink', viewport)).toBe('0');
      });

      it('leaves the short landscape viewport to the landscape layout rules', () => {
        expect(computed(dialog.wrapper, 'max-height', SHORT_LANDSCAPE) ?? '').not.toContain('100dvh');
        expect(computed(dialog.clock, 'min-height', SHORT_LANDSCAPE)).not.toBe('var(--tp-wheel-item-height)');
      });

      it('does not cap or shrink an inline picker', () => {
        expect(computed(inline.wrapper, 'max-height') ?? '').not.toContain('100dvh');
        expect(computed(inline.clock, 'min-height')).not.toBe('var(--tp-wheel-item-height)');
      });

      it('does not give a popover the dialog cap', () => {
        expect(computed(popover.wrapper, 'max-height') ?? '').not.toContain('100dvh');
      });
    },
  );

  describe('anchored popover fallbacks', () => {
    const anchored = (attributes: Record<string, string> = {}): Node =>
      node(
        ['tp-ui-modal', 'tp-ui-compact-wheel-mode', 'tp-ui-popover', 'tp-ui-popover-anchored'],
        undefined,
        attributes,
      );

    it.each([
      ['left-to-right', {}, 'right'],
      ['right-to-left', { 'data-popover-dir': 'rtl' }, 'left'],
    ])('points the %s try tokens at the matching input-aligned @position-try', (_dir, attributes, side) => {
      const modal = anchored(attributes);

      expect(computed(modal, '--tp-popover-try-capped')).toBe(`--tp-ui-popover-capped-${side}`);
      expect(computed(modal, '--tp-popover-try-usable')).toBe(`--tp-ui-popover-usable-${side}`);
      expect(computed(modal, '--tp-popover-try-fit')).toBe(`--tp-ui-popover-fit-${side}`);
    });

    it.each([
      ['no forced side', {}, ['capped']],
      ['a top request', { 'data-popover-request': 'top' }, ['usable', 'fit']],
      ['a bottom request', { 'data-popover-request': 'bottom' }, ['usable', 'fit']],
    ])('lists the input-aligned entry before the centered one with %s', (_case, attributes, names) => {
      const list = computed(anchored(attributes), 'position-try-fallbacks') ?? '';
      const entries = splitDepthZero(list, /,/).map((entry) => entry.split(/\s+/)[0]);

      names.forEach((name) => {
        const aligned = entries.indexOf(`var(--tp-popover-try-${name})`);
        const centered = entries.indexOf(`--tp-ui-popover-${name}`);
        expect(aligned).toBeGreaterThanOrEqual(0);
        expect(centered).toBeGreaterThan(aligned);
      });
    });
  });

  describe('@position-try rules', () => {
    const SIDES = ['right', 'left'] as const;
    const NAMES = ['capped', 'fit', 'usable'] as const;

    it.each(SIDES.flatMap((side) => NAMES.map((name) => [name, side] as const)))(
      'defines --tp-ui-popover-%s-%s aligned to the input start or end and capped to the viewport',
      (name, side) => {
        const declarations = positionTry.get(`--tp-ui-popover-${name}-${side}`);

        expect(declarations).toBeDefined();
        expect(declarations?.get('position-area')).toBe(`bottom span-${side}`);
        expect(declarations?.get('max-height')).toBe(POPOVER_TRY_BLOCK);
        expect(declarations?.has('justify-self')).toBe(false);
      },
    );

    it.each(['right', 'left'])('gives the capped %s variant a min-height from the room beside the anchor', (side) => {
      expect(positionTry.get(`--tp-ui-popover-capped-${side}`)?.get('min-height')).toContain(
        'anchor-size(height)',
      );
    });

    it.each(['right', 'left'])('keeps three wheel items visible in the usable %s variant', (side) => {
      expect(positionTry.get(`--tp-ui-popover-usable-${side}`)?.get('min-height')).toBe(
        'calc(3 * var(--tp-wheel-item-height))',
      );
    });

    it('keeps the centered variants', () => {
      ['capped', 'fit', 'usable'].forEach((name) => {
        expect(positionTry.get(`--tp-ui-popover-${name}`)?.get('position-area')).toBe('block-end span-all');
      });
    });
  });
});
