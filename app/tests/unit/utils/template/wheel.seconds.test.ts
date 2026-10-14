import { getWheelTemplate } from '@/utils/template/wheel';
import { mergeOptions } from '@/utils/options/defaults';

const PAYLOAD = '<img src=x onerror="window.__xss=1">';

const render = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host;
};

const parts = (html: string): string[] =>
  [...render(html).querySelectorAll('.tp-ui-wheel-container > *')].map(
    (el) => el.querySelector('.tp-ui-wheel-column')?.classList[1] ?? el.className,
  );

const secondValues = (host: HTMLElement): Array<string | null> =>
  [...host.querySelectorAll('.tp-ui-wheel-seconds .tp-ui-wheel-item')].map((item) =>
    item.getAttribute('data-value'),
  );

describe('wheel template with seconds', () => {
  it('adds a seconds column between minutes and AM/PM (12h)', () => {
    expect(parts(getWheelTemplate('12h', 1, true, 'tp', {}, { show: true, increment: 1 }))).toEqual([
      'tp-ui-wheel-hours',
      'tp-ui-wheel-separator',
      'tp-ui-wheel-minutes',
      'tp-ui-wheel-separator',
      'tp-ui-wheel-seconds',
      'tp-ui-wheel-ampm',
      'tp-ui-wheel-highlight',
    ]);
  });

  it('adds a seconds column after the minutes (24h)', () => {
    expect(parts(getWheelTemplate('24h', 1, false, 'tp', {}, { show: true, increment: 1 }))).toEqual([
      'tp-ui-wheel-hours',
      'tp-ui-wheel-separator',
      'tp-ui-wheel-minutes',
      'tp-ui-wheel-separator',
      'tp-ui-wheel-seconds',
      'tp-ui-wheel-highlight',
    ]);
  });

  it('steps the seconds column by incrementSeconds and labels it', () => {
    const host = render(
      getWheelTemplate('24h', 1, false, 'tp', { second: 'Sekunda' }, { show: true, increment: 15 }),
    );
    const column = host.querySelector('.tp-ui-wheel-seconds');
    expect(secondValues(host)).toEqual(['00', '15', '30', '45']);
    expect(column?.getAttribute('role')).toBe('listbox');
    expect(column?.getAttribute('aria-label')).toBe('Sekunda');
  });

  it('lists every second by default with item ids distinct from the other columns', () => {
    const host = render(getWheelTemplate('12h', 1, true, 'tp', {}, { show: true, increment: 1 }));
    const values = secondValues(host);
    expect(values).toHaveLength(60);
    expect(values[0]).toBe('00');
    expect(values[59]).toBe('59');
    const ids = [...host.querySelectorAll('.tp-ui-wheel-item')].map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('labels the seconds column and its items with the merged labels.second the plugin passes', () => {
    const { labels } = mergeOptions();
    const host = render(getWheelTemplate('24h', 1, false, 'tp', labels, { show: true, increment: 30 }));
    expect(labels.second).toBe('Second');
    expect(host.querySelector('.tp-ui-wheel-seconds')?.getAttribute('aria-label')).toBe(labels.second);
    expect(
      host.querySelector('.tp-ui-wheel-seconds .tp-ui-wheel-item')?.getAttribute('aria-label'),
    ).toBe(`${labels.second} 00`);
  });

  it('renders the seconds label as text, never as markup', () => {
    const host = render(
      getWheelTemplate('24h', 1, false, 'xss', { second: PAYLOAD }, { show: true, increment: 30 }),
    );
    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('.tp-ui-wheel-seconds')?.getAttribute('aria-label')).toBe(PAYLOAD);
  });

  it('is unchanged without seconds', () => {
    expect(getWheelTemplate('24h', 5, false, 'tp', {})).toBe(
      getWheelTemplate('24h', 5, false, 'tp', {}, { show: false, increment: 1 }),
    );
    expect(getWheelTemplate('12h', 5, true, 'tp', {})).toBe(
      getWheelTemplate('12h', 5, true, 'tp', { second: 'Sekunda' }, { show: false, increment: 15 }),
    );
  });
});
