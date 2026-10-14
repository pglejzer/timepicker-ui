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

const openRange = (value: string): void => {
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
});
