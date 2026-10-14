import { getModalTemplate } from '@/utils/template';
import { mergeOptions } from '@/utils/options/defaults';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import type { TimepickerOptions } from '@/types/options';

PluginRegistry.register(WheelPlugin);

const PAYLOAD = '<img src=x onerror="window.__xss=1">';

const render = (options: TimepickerOptions): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = getModalTemplate(mergeOptions(options), 'sec');
  return host.firstElementChild as HTMLElement;
};

const secondsField = (modal: HTMLElement): HTMLInputElement | null =>
  modal.querySelector<HTMLInputElement>('input.tp-ui-seconds');

const wheelColumns = (modal: HTMLElement): string[] =>
  [...modal.querySelectorAll('.tp-ui-wheel-column')].map((column) => column.classList[1]);

describe('modal header with seconds', () => {
  it.each(['12h', '24h'] as const)('adds a seconds spinbutton after the minutes (%s)', (type) => {
    const modal = render({ clock: { type, showSeconds: true }, labels: { second: 'Sekunda' } });
    const seconds = secondsField(modal);
    expect(seconds).not.toBeNull();
    expect(seconds?.name).toBe('seconds');
    expect(seconds?.getAttribute('role')).toBe('spinbutton');
    expect(seconds?.getAttribute('aria-label')).toBe('Sekunda');
    expect(seconds?.getAttribute('aria-valuemin')).toBe('0');
    expect(seconds?.getAttribute('aria-valuemax')).toBe('59');
    expect(seconds?.getAttribute('aria-valuenow')).toBe('0');
    expect(seconds?.getAttribute('aria-valuetext')).toBe('00');
    expect(modal.querySelectorAll('.tp-ui-wrapper-time .tp-ui-dots')).toHaveLength(2);
    const fields = modal.querySelectorAll<HTMLInputElement>('.tp-ui-wrapper-time input');
    expect([...fields].map((field) => field.name)).toEqual(['hour', 'minutes', 'seconds']);
  });

  it('keeps the tab order hour, minute, second, period (12h)', () => {
    const modal = render({ clock: { showSeconds: true } });
    const controls = modal.querySelectorAll<HTMLElement>('.tp-ui-header input, .tp-ui-header [data-type]');
    const order = [...controls].map((el) => (el as HTMLInputElement).name || el.dataset.type);
    expect(order).toEqual(['hour', 'minutes', 'seconds', 'AM', 'PM']);
  });

  it('wraps the seconds field in a ripple host like the hour and minute fields', () => {
    const modal = render({ clock: { showSeconds: true } });
    const rippleWrapper = secondsField(modal)?.closest('.tp-ui-input-ripple-wrapper');
    expect(rippleWrapper?.hasAttribute('data-md3-ripple')).toBe(true);
    const fieldWrapper = rippleWrapper?.closest('.tp-ui-input-wrapper');
    expect(fieldWrapper?.querySelector('.tp-ui-second-text')).toBeInstanceOf(HTMLElement);
    expect(modal.querySelectorAll('.tp-ui-input-ripple-wrapper[data-md3-ripple]')).toHaveLength(3);
  });

  it('is read-only like the other fields unless editable or mobile', () => {
    const readonlyOf = (options: TimepickerOptions): boolean | undefined =>
      secondsField(render(options))?.hasAttribute('readonly');
    expect(readonlyOf({ clock: { showSeconds: true } })).toBe(true);
    expect(readonlyOf({ clock: { showSeconds: true }, ui: { editable: true } })).toBe(false);
    expect(readonlyOf({ clock: { showSeconds: true }, ui: { mobile: true } })).toBe(false);
  });

  it('marks the modal with tp-ui-has-seconds only when seconds are on', () => {
    expect(render({ clock: { showSeconds: true } }).classList.contains('tp-ui-has-seconds')).toBe(true);
    expect(render({}).classList.contains('tp-ui-has-seconds')).toBe(false);
    expect(render({ clock: { showSeconds: false } }).classList.contains('tp-ui-has-seconds')).toBe(false);
  });

  it.each([
    ['clock', false],
    ['mobile', true],
  ])('uses labels.second for the caption and the field name in the %s view', (_view, mobile) => {
    const modal = render({
      clock: { showSeconds: true },
      ui: { mobile },
      labels: { second: 'Sek.' },
    });
    expect(modal.querySelector('.tp-ui-second-text')?.textContent).toBe('Sek.');
    expect(secondsField(modal)?.getAttribute('aria-label')).toBe('Sek.');
  });

  it('renders the seconds labels as text, never as markup', () => {
    const modal = render({
      clock: { showSeconds: true },
      labels: { second: PAYLOAD },
    });
    expect(modal.querySelector('img')).toBeNull();
    expect(secondsField(modal)?.getAttribute('aria-label')).toBe(PAYLOAD);
    expect(modal.querySelector('.tp-ui-second-text')?.textContent).toBe(PAYLOAD);
  });

  it.each<[string, TimepickerOptions]>([
    ['clock 12h', {}],
    ['clock 24h mobile', { clock: { type: '24h' }, ui: { mobile: true } }],
    ['wheel 24h', { clock: { type: '24h' }, ui: { mode: 'wheel' } }],
    ['compact-wheel 12h', { ui: { mode: 'compact-wheel' } }],
  ])('leaves the markup unchanged while showSeconds is off (%s)', (_name, options) => {
    const withInertSecondsOptions = mergeOptions({
      ...options,
      clock: { ...options.clock, showSeconds: false, incrementSeconds: 15, autoSwitchToSeconds: false },
      labels: { second: 'Sekunda' },
    });
    expect(getModalTemplate(withInertSecondsOptions, 'x')).toBe(getModalTemplate(mergeOptions(options), 'x'));
  });
});

describe('wheel modes with seconds', () => {
  it('renders the seconds header field and a stepped seconds column in wheel mode', () => {
    const modal = render({
      clock: { type: '24h', showSeconds: true, incrementSeconds: 15 },
      ui: { mode: 'wheel' },
      labels: { second: 'Sekunda' },
    });
    expect(modal.classList.contains('tp-ui-has-seconds')).toBe(true);
    expect(secondsField(modal)).not.toBeNull();
    expect(wheelColumns(modal)).toEqual(['tp-ui-wheel-hours', 'tp-ui-wheel-minutes', 'tp-ui-wheel-seconds']);
    const values = [...modal.querySelectorAll('.tp-ui-wheel-seconds .tp-ui-wheel-item')].map((item) =>
      item.getAttribute('data-value'),
    );
    expect(values).toEqual(['00', '15', '30', '45']);
    expect(modal.querySelector('.tp-ui-wheel-seconds')?.getAttribute('aria-label')).toBe('Sekunda');
  });

  it('orders the compact-wheel columns hours, minutes, seconds, period (12h)', () => {
    const modal = render({ clock: { showSeconds: true }, ui: { mode: 'compact-wheel' } });
    expect(modal.classList.contains('tp-ui-has-seconds')).toBe(true);
    expect(wheelColumns(modal)).toEqual([
      'tp-ui-wheel-hours',
      'tp-ui-wheel-minutes',
      'tp-ui-wheel-seconds',
      'tp-ui-wheel-ampm',
    ]);
  });
});
