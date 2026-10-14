import { readdirSync } from 'fs';
import { join, relative } from 'path';
import { STYLES_DIR, escapeRegExp, readScss, rootTokens } from './style-test-helpers';

type Block = { start: number; end: number; body: string };

const RIPPLE_PATH = join(STYLES_DIR, 'partials', '_ripple.scss');

const HOVER_MEDIA = /@media[^{]*\(\s*hover\s*:\s*hover\s*\)[^{]*/g;
const REDUCED_MOTION_MEDIA = /@media[^{]*prefers-reduced-motion\s*:\s*reduce[^{]*/g;

const scssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return scssFiles(path);
    return entry.name.endsWith('.scss') ? [path] : [];
  });

const blocks = (source: string, header: RegExp): Block[] =>
  [...source.matchAll(header)].map((match) => {
    const start = match.index ?? 0;
    const open = source.indexOf('{', start + match[0].length);
    let depth = 0;
    let end = open;
    do {
      if (source[end] === '{') depth += 1;
      if (source[end] === '}') depth -= 1;
      end += 1;
    } while (depth > 0 && end < source.length);
    return { start, end, body: source.slice(open + 1, end - 1) };
  });

const withoutBlocks = (source: string, cut: Block[]): string =>
  cut.reduceRight((rest, { start, end }) => rest.slice(0, start) + rest.slice(end), source);

const varReference = (token: string): RegExp => new RegExp(`var\\(\\s*${escapeRegExp(token)}\\s*[,)]`);

describe('ripple styles', () => {
  const ripple = readScss(RIPPLE_PATH);

  describe('_ripple.scss', () => {
    it('should paint the wave and the state layer with currentColor', () => {
      expect(ripple).toMatch(/currentcolor/i);
    });

    it('should not take the wave colour from --tp-primary', () => {
      expect(ripple).not.toMatch(/var\(\s*--tp-primary\s*[,)]/);
    });

    it('should isolate the host so the wave stays under its label', () => {
      expect(ripple).toMatch(/isolation\s*:\s*isolate/);
    });

    it('should draw the wave below the label with z-index: -1', () => {
      expect(ripple).toMatch(/z-index\s*:\s*-1\s*[;}]/);
    });

    it.each(['tp-ripple-expand', 'tp-ripple-fade'])('should define the %s keyframes', (name) => {
      expect(ripple).toMatch(new RegExp(`@keyframes\\s+${escapeRegExp(name)}\\s*\\{`));
    });

    it.each(['--tp-duration-ripple', '--tp-duration-ripple-fade'])(
      'should time the wave with var(%s)',
      (token) => {
        expect(ripple).toMatch(varReference(token));
      },
    );

    it.each([
      '--tp-state-hover-opacity',
      '--tp-state-focus-opacity',
      '--tp-state-pressed-opacity',
      '--tp-ripple-opacity',
    ])('should read the %s token', (token) => {
      expect(ripple).toMatch(varReference(token));
    });

    it.each(['[data-md3-ripple]', '.is-pressed', '.is-rippling'])(
      'should style %s, the hook the ripple script sets',
      (selector) => {
        expect(ripple).toContain(selector);
      },
    );

    it('should not style the retired ripple-hold class', () => {
      expect(ripple).not.toContain('ripple-hold');
    });

    it('should apply hover state layers only inside @media (hover: hover)', () => {
      const hoverBlocks = blocks(ripple, HOVER_MEDIA);

      expect(hoverBlocks.some(({ body }) => body.includes(':hover'))).toBe(true);
      expect(withoutBlocks(ripple, hoverBlocks)).not.toContain(':hover');
    });

    it('should drop the expand animation under prefers-reduced-motion: reduce', () => {
      const reducedBlocks = blocks(ripple, REDUCED_MOTION_MEDIA);

      expect(reducedBlocks.length).toBeGreaterThan(0);
      reducedBlocks.forEach(({ body }) => {
        expect(body.trim()).not.toBe('');
        expect(body).not.toContain('tp-ripple-expand');
      });
    });
  });

  describe('variables.scss', () => {
    const tokens = rootTokens();

    it.each<[string, number]>([
      ['--tp-state-hover-opacity', 0.08],
      ['--tp-state-focus-opacity', 0.1],
      ['--tp-state-pressed-opacity', 0.1],
    ])('should define %s as %s in :root', (token, value) => {
      expect(tokens.has(token)).toBe(true);
      expect(Number(tokens.get(token))).toBe(value);
    });

    it.each(['--tp-duration-ripple', '--tp-duration-ripple-fade'])('should define %s in :root', (token) => {
      expect(tokens.has(token)).toBe(true);
    });
  });

  describe('legacy ripple system', () => {
    const sources = scssFiles(STYLES_DIR).map((path) => ({
      file: relative(STYLES_DIR, path).replace(/\\/g, '/'),
      source: readScss(path),
    }));

    it.each<[string, RegExp]>([
      ['tp-ui-ripple-effect', /tp-ui-ripple-effect/],
      ['.tp-ui-ripple selector', /\.tp-ui-ripple\b/],
      ['unprefixed ripple keyframes', /@keyframes\s+ripple/],
    ])('should leave no %s under src/styles', (_name, pattern) => {
      const offenders = sources.filter(({ source }) => pattern.test(source)).map(({ file }) => file);

      expect(offenders).toEqual([]);
    });
  });
});
