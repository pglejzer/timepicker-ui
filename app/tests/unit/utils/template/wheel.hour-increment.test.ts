import { getWheelTemplate } from '@/utils/template/wheel';

const render = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host;
};

const columnItems = (host: HTMLElement, column: 'hours' | 'minutes' | 'ampm'): HTMLElement[] => [
  ...host.querySelectorAll<HTMLElement>(`.tp-ui-wheel-${column} .tp-ui-wheel-item`),
];

const hourValues = (html: string): Array<string | null> =>
  columnItems(render(html), 'hours').map((item) => item.getAttribute('data-value'));

const pad = (value: number): string => String(value).padStart(2, '0');

describe('wheel template hours column follows incrementHours', () => {
  it.each([
    ['12h', 2, ['02', '04', '06', '08', '10', '12']],
    ['24h', 3, ['00', '03', '06', '09', '12', '15', '18', '21']],
    ['12h', 5, ['05', '10', '12']],
  ] as const)('%s with incrementHours %i lists only the grid hours', (clockType, incrementHours, expected) => {
    expect(hourValues(getWheelTemplate(clockType, 1, false, 'tp', {}, undefined, incrementHours))).toEqual(
      expected,
    );
  });

  it.each([
    ['12h', Array.from({ length: 12 }, (_, i) => pad(i + 1))],
    ['24h', Array.from({ length: 24 }, (_, i) => pad(i))],
  ] as const)('%s without incrementHours lists every hour', (clockType, expected) => {
    expect(hourValues(getWheelTemplate(clockType, 1))).toEqual(expected);
  });

  it('renders the same markup for incrementHours 1 as without it', () => {
    expect(getWheelTemplate('24h', 5, false, 'tp', {}, { show: true, increment: 15 }, 1)).toBe(
      getWheelTemplate('24h', 5, false, 'tp', {}, { show: true, increment: 15 }),
    );
  });

  it('keeps the item id and aria-label format of the remaining hours', () => {
    const host = render(getWheelTemplate('12h', 1, false, 'tp', { hourLabel: 'Hour' }, undefined, 2));

    expect(columnItems(host, 'hours').map((item) => [item.id, item.getAttribute('aria-label')])).toEqual([
      ['tp-wh-02', 'Hour 02'],
      ['tp-wh-04', 'Hour 04'],
      ['tp-wh-06', 'Hour 06'],
      ['tp-wh-08', 'Hour 08'],
      ['tp-wh-10', 'Hour 10'],
      ['tp-wh-12', 'Hour 12'],
    ]);
  });

  it('leaves the minutes and AM/PM columns alone', () => {
    const host = render(getWheelTemplate('12h', 15, true, 'tp', {}, undefined, 3));

    expect(columnItems(host, 'hours').map((item) => item.dataset.value)).toEqual(['03', '06', '09', '12']);
    expect(columnItems(host, 'minutes').map((item) => item.dataset.value)).toEqual(['00', '15', '30', '45']);
    expect(columnItems(host, 'ampm').map((item) => item.dataset.value)).toEqual(['AM', 'PM']);
  });
});
