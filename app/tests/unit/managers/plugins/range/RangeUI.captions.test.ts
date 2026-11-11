import type TimepickerUIClass from '@/timepicker/TimepickerUI';
import type { Plugin } from '@/core/PluginRegistry';
import type { TimepickerOptions } from '@/types/options';
import { accessibleName } from './range-test-helpers';

type TimepickerUIConstructor = typeof TimepickerUIClass;
type Part = 'from' | 'to';

interface Mounted {
  readonly picker: TimepickerUIClass;
  readonly onError: jest.Mock;
}

const SETTLE_MS = 2000;
const CAPTION = '.tp-ui-range-tab-caption';
const LABELS: Record<Part, string> = { from: 'Start', to: 'End' };
const DATE_FROM = 'Wed Oct 21';
const DATE_TO = 'Thu Oct 22';

const loadTimepicker = (registerRange: boolean): TimepickerUIConstructor => {
  let ctor: TimepickerUIConstructor | undefined;
  jest.isolateModules(() => {
    ctor = (require('@/timepicker/TimepickerUI') as { default: TimepickerUIConstructor }).default;
    if (registerRange) {
      const { PluginRegistry } = require('@/core/PluginRegistry') as {
        PluginRegistry: { register: (plugin: Plugin) => void };
      };
      const { RangePlugin } = require('@/plugins/range') as { RangePlugin: Plugin };
      PluginRegistry.register(RangePlugin);
    }
  });
  if (!ctor) throw new Error('TimepickerUI failed to load');
  return ctor;
};

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const tab = (part: Part): HTMLElement => {
  const element = document.querySelector<HTMLElement>(`.tp-ui-modal .tp-ui-range-tab.tp-ui-range-${part}`);
  if (!element) throw new Error(`the ${part} tab is not rendered`);
  return element;
};

const captionOf = (part: Part): string | null => tab(part).querySelector(CAPTION)?.textContent ?? null;

const childRoles = (part: Part): string[] =>
  Array.from(
    tab(part).children,
    (child) => Array.from(child.classList).find((name) => name.startsWith('tp-ui-range-tab-')) ?? '',
  );

const timeOf = (part: Part): Element | null => tab(part).querySelector(`.tp-ui-range-${part}-time`);

const mountPicker = (
  Ctor: TimepickerUIConstructor,
  options: TimepickerOptions = {},
  open = true,
): Mounted => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const picker = new Ctor(input, {
    ...options,
    clock: { type: '24h', ...options.clock },
    ui: { ...options.ui, animation: false },
    range: { enabled: true, fromLabel: LABELS.from, toLabel: LABELS.to, ...options.range },
  });
  picker.create();
  if (open) {
    picker.open();
    settle();
  }
  const onError = jest.fn();
  picker.on('error', onError);
  return { picker, onError };
};

const useFakeTimersAndCleanUp = (getCtor: () => TimepickerUIConstructor | null): void => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    getCtor()?.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

describe('range tab captions (setRangeCaptions)', () => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  beforeEach(() => {
    Ctor = loadTimepicker(true);
  });

  const mount = (options: TimepickerOptions = {}, open = true): Mounted => {
    if (!Ctor) throw new Error('TimepickerUI is not loaded');
    return mountPicker(Ctor, options, open);
  };

  it('should render a From caption between the label and the time and none on To', () => {
    const { picker, onError } = mount();

    picker.setRangeCaptions({ from: DATE_FROM });

    const caption = tab('from').querySelector(CAPTION);
    expect(caption?.textContent).toBe(DATE_FROM);
    expect(caption?.previousElementSibling).toHaveClass('tp-ui-range-tab-label');
    expect(caption?.nextElementSibling).toHaveClass('tp-ui-range-tab-value');
    expect(tab('to').querySelector(CAPTION)).toBeNull();
    expect(onError).not.toHaveBeenCalled();
  });

  it('should change and remove a caption per tab and keep the tab that is left out', () => {
    const { picker } = mount();
    picker.setRangeCaptions({ from: DATE_FROM, to: DATE_TO });

    picker.setRangeCaptions({ from: 'Fri Oct 23' });
    expect(captionOf('from')).toBe('Fri Oct 23');
    expect(captionOf('to')).toBe(DATE_TO);
    expect(tab('from').querySelectorAll(CAPTION)).toHaveLength(1);

    picker.setRangeCaptions({ from: null });
    expect(captionOf('from')).toBeNull();
    expect(captionOf('to')).toBe(DATE_TO);

    picker.setRangeCaptions({ from: DATE_FROM });
    picker.setRangeCaptions({ from: '', to: '' });
    expect(document.querySelectorAll(CAPTION)).toHaveLength(0);
  });

  it('should keep HTML in a caption as plain text', () => {
    const { picker } = mount();

    picker.setRangeCaptions({ from: '<b>x</b>' });

    const caption = tab('from').querySelector(CAPTION);
    expect(caption?.textContent).toBe('<b>x</b>');
    expect(caption?.querySelector('b')).toBeNull();
  });

  it('should show a caption set while closed and keep it over setOptions, the Clear button and close / open', () => {
    const { picker } = mount({ ui: { clearButton: true } }, false);
    picker.setRangeCaptions({ from: DATE_FROM, to: DATE_TO });

    picker.open();
    settle();
    expect([captionOf('from'), captionOf('to')]).toEqual([DATE_FROM, DATE_TO]);

    picker.setOptions({ labels: { ok: 'Done' } });
    settle();
    expect(document.querySelector('.tp-ui-modal .tp-ui-ok-btn')?.textContent).toBe('Done');
    expect([captionOf('from'), captionOf('to')]).toEqual([DATE_FROM, DATE_TO]);

    picker.setRange({ from: '09:00', to: '17:00' });
    const clear = document.querySelector<HTMLElement>('.tp-ui-modal .tp-ui-clear-btn');
    expect(clear).toHaveAttribute('aria-disabled', 'false');
    clear?.click();
    settle();
    expect(picker.getRange()).toEqual({ from: null, to: null });
    expect([captionOf('from'), captionOf('to')]).toEqual([DATE_FROM, DATE_TO]);

    picker.close();
    settle();
    expect(document.querySelector('.tp-ui-modal')).toBeNull();
    picker.open();
    settle();
    expect([captionOf('from'), captionOf('to')]).toEqual([DATE_FROM, DATE_TO]);
  });

  it('should make the tab read label, caption and then the time once it is set', () => {
    const { picker } = mount();
    picker.setRangeCaptions({ from: DATE_FROM });

    expect(childRoles('from')).toEqual([
      'tp-ui-range-tab-label',
      'tp-ui-range-tab-caption',
      'tp-ui-range-tab-value',
    ]);
    expect(timeOf('from')).toHaveClass('tp-ui-range-tab-value');
    expect(accessibleName(tab('from'))).toBe(`${LABELS.from} ${DATE_FROM}`);

    picker.setRange({ from: '09:00' });

    expect(accessibleName(tab('from'))).toBe(`${LABELS.from} ${DATE_FROM} 09:00`);
    expect(accessibleName(tab('to'))).toBe(LABELS.to);
  });

  it('should render no caption element while no caption was ever set', () => {
    const { picker } = mount();
    picker.setRange({ from: '09:00', to: '17:00' });

    expect(document.querySelectorAll(CAPTION)).toHaveLength(0);
    expect(childRoles('from')).toEqual(['tp-ui-range-tab-label', 'tp-ui-range-tab-value']);
    expect(childRoles('to')).toEqual(['tp-ui-range-tab-label', 'tp-ui-range-tab-value']);
    expect(timeOf('from')).toHaveClass('tp-ui-range-tab-value');
    expect(timeOf('to')).toHaveClass('tp-ui-range-tab-value');
  });

  it('should emit one error and render nothing with range.enabled false', () => {
    const { picker, onError } = mount({ range: { enabled: false } });

    picker.setRangeCaptions({ from: DATE_FROM });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(String((onError.mock.calls[0][0] as { error: unknown }).error)).toContain('range.enabled');
    expect(document.querySelector(CAPTION)).toBeNull();
    expect(document.querySelector('.tp-ui-modal')?.textContent).not.toContain(DATE_FROM);
  });
});

describe('range tab captions without RangePlugin', () => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  beforeEach(() => {
    Ctor = loadTimepicker(false);
  });

  it('should emit one error and render nothing', () => {
    if (!Ctor) throw new Error('TimepickerUI is not loaded');
    const { picker, onError } = mountPicker(Ctor);

    picker.setRangeCaptions({ from: DATE_FROM });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(String((onError.mock.calls[0][0] as { error: unknown }).error)).toContain('RangePlugin');
    expect(document.querySelector(CAPTION)).toBeNull();
    expect(document.querySelector('.tp-ui-modal')?.textContent).not.toContain(DATE_FROM);
  });
});
