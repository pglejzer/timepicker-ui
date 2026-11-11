import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { accessibleName } from './range-test-helpers';

type Part = 'from' | 'to';

const LABELS: Record<Part, string> = { from: 'Od', to: 'Do' };
const PLACEHOLDER = '--:--';

const tab = (part: Part): HTMLElement =>
  document.querySelector(`.tp-ui-modal .tp-ui-range-tab.tp-ui-range-${part}`) as HTMLElement;
const timeOf = (part: Part): HTMLElement =>
  document.querySelector(`.tp-ui-modal .tp-ui-range-${part}-time`) as HTMLElement;

const openRange = (value: string): { picker: TimepickerUI; input: HTMLInputElement } => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h' },
    ui: { animation: false },
    range: { enabled: true, fromLabel: LABELS.from, toLabel: LABELS.to },
  });
  picker.create();
  picker.open();
  return { picker, input };
};

describe('range tabs expose the from/to label, not the --:-- placeholder', () => {
  beforeAll(() => PluginRegistry.register(RangePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it.each<Part>(['from', 'to'])('should aria-hide the placeholder of an empty %s tab', (part) => {
    openRange('');

    expect(timeOf(part).textContent).toBe(PLACEHOLDER);
    expect(timeOf(part)).toHaveAttribute('aria-hidden', 'true');
  });

  it.each<Part>(['from', 'to'])('should name an empty %s tab with its label only', (part) => {
    openRange('');

    const name = accessibleName(tab(part));

    expect(name).toBe(LABELS[part]);
    expect(name).not.toContain(PLACEHOLDER);
  });

  it.each<[Part, string]>([
    ['from', '09:00'],
    ['to', '17:00'],
  ])('should expose the %s value once it is set', (part, value) => {
    openRange('09:00 - 17:00');

    expect(timeOf(part).textContent).toBe(value);
    expect(timeOf(part)).not.toHaveAttribute('aria-hidden', 'true');

    const name = accessibleName(tab(part));
    expect(name).toContain(LABELS[part]);
    expect(name).toContain(value);
  });

  it('should write only From to the input with the placeholder for To and hide the To tab placeholder', () => {
    const { picker, input } = openRange('08:00 - 10:00');

    picker.setRange({ from: '09:00', to: null });

    expect(input.value).toBe('09:00 - --:--');
    expect(timeOf('from').textContent).toBe('09:00');
    expect(timeOf('to').textContent).toBe(PLACEHOLDER);
    expect(timeOf('to')).toHaveAttribute('aria-hidden', 'true');
    expect(accessibleName(tab('to'))).toBe(LABELS.to);
  });

  it.each<[string, string | null, string]>([
    ['only To', '17:00', '--:-- - 17:00'],
    ['no end', null, ''],
  ])('should write the input for %s', (_label, to, expected) => {
    const { picker, input } = openRange('08:00 - 10:00');

    picker.setRange({ from: null, to });

    expect(input.value).toBe(expected);
    expect(picker.getRange()).toEqual({ from: null, to: to ? { hour: '17', minutes: '00' } : null });
  });
});
