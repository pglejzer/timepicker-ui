import type TimepickerUIClass from '@/timepicker/TimepickerUI';
import type { RangeTimeState, TimepickerOptions } from '@/types/options';
import type { TimepickerEventName } from '@/utils/EventEmitter';
import { mockWheelItemHeight, selectedWheelValue } from '../managers/plugins/wheel/wheel-test-helpers';

type TimepickerUIConstructor = typeof TimepickerUIClass;

const SETTLE_MS = 2000;
const INSTANCE_ID = 'tp-range-wheel';
const INLINE_ID = 'tp-range-wheel-inline';
const TO_TAB = '.tp-ui-range-tab.tp-ui-range-to';

const loadTimepicker = (withTimezone = false): TimepickerUIConstructor => {
  let ctor: TimepickerUIConstructor | undefined;
  jest.isolateModules(() => {
    ctor = require('@/timepicker/TimepickerUI').default;
    const { PluginRegistry } = require('@/core/PluginRegistry');
    PluginRegistry.register(require('@/plugins/range').RangePlugin);
    PluginRegistry.register(require('@/plugins/wheel').WheelPlugin);
    if (withTimezone) {
      PluginRegistry.register(require('@/plugins/timezone').TimezonePlugin);
    }
  });
  if (!ctor) throw new Error('TimepickerUI failed to load');
  return ctor;
};

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

interface Mounted {
  readonly picker: TimepickerUIClass;
  readonly input: HTMLInputElement;
}

interface MountConfig {
  readonly open?: boolean;
  readonly value?: string;
}

const mountPicker = (
  Ctor: TimepickerUIConstructor,
  options: TimepickerOptions,
  { open = true, value = '' }: MountConfig = {},
): Mounted => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new Ctor(input, {
    ...options,
    behavior: { ...options.behavior, id: INSTANCE_ID },
    ui: { ...options.ui, animation: false },
  });
  picker.create();
  if (open) {
    picker.open();
    settle();
  }
  return { picker, input };
};

const useFakeTimersAndCleanUp = (getCtor: () => TimepickerUIConstructor | null): void => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
  });

  afterEach(() => {
    getCtor()?.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

const press = (el: Element | null, key: string): void => {
  el?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const modal = (): HTMLElement | null => document.querySelector<HTMLElement>('.tp-ui-modal');

const inModal = (selector: string): HTMLElement | null =>
  modal()?.querySelector<HTMLElement>(selector) ?? null;

const fullRange = (from: string, to: string): Record<'from' | 'to', { hour: string; minutes: string }> => ({
  from: { hour: from, minutes: '00' },
  to: { hour: to, minutes: '00' },
});

const hours = (): HTMLElement | null => inModal('.tp-ui-wheel-hours');

const addInlineContainer = (): string => {
  const container = document.createElement('div');
  container.id = INLINE_ID;
  document.body.appendChild(container);
  return `#${INLINE_ID}`;
};

const pickFromThenTo = (): void => {
  press(hours(), 'ArrowDown');
  inModal(TO_TAB)?.click();
  press(hours(), 'ArrowDown');
};

const listen = (picker: TimepickerUIClass, events: readonly TimepickerEventName[]): string[] => {
  const heard: string[] = [];
  events.forEach((event) => {
    picker.on(event, () => {
      heard.push(event);
    });
  });
  return heard;
};

describe.each(['wheel', 'compact-wheel'] as const)('range in %s mode, end to end', (mode) => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  beforeEach(() => {
    Ctor = loadTimepicker();
  });

  const ctor = (): TimepickerUIConstructor => {
    if (!Ctor) throw new Error('TimepickerUI is not loaded');
    return Ctor;
  };

  const rangeOptions: TimepickerOptions = {
    clock: { type: '24h' },
    ui: { mode },
    range: { enabled: true, linked: false },
  };

  it('22: arrow keys, the To tab and OK write from - to, emit range:confirm and close the modal', () => {
    const { picker, input } = mountPicker(ctor(), rangeOptions);
    const confirmed = jest.fn();
    picker.on('range:confirm', confirmed);

    pickFromThenTo();
    expect(picker.getRange()).toEqual(fullRange('13', '14'));
    inModal('.tp-ui-ok-btn')?.click();
    settle();

    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(confirmed).toHaveBeenCalledWith({ from: '13:00', to: '14:00', duration: 60 });
    expect(input.value).toBe('13:00 - 14:00');
    expect(modal()).toBeNull();
  });

  it('22: inline, OK writes from - to and the picker stays on screen', () => {
    const container = addInlineContainer();
    const { picker, input } = mountPicker(
      ctor(),
      { ...rangeOptions, ui: { mode, inline: { enabled: true, container, showButtons: true } } },
      { open: false },
    );
    settle();
    const confirmed = jest.fn();
    picker.on('range:confirm', confirmed);

    pickFromThenTo();
    inModal('.tp-ui-ok-btn')?.click();
    settle();

    expect(confirmed).toHaveBeenCalledWith({ from: '13:00', to: '14:00', duration: 60 });
    expect(input.value).toBe('13:00 - 14:00');
    expect(document.querySelector(`#${INLINE_ID} .tp-ui-modal`)).not.toBeNull();
  });

  it('6: setActivePart while closed switches right after open', () => {
    const { picker } = mountPicker(
      ctor(),
      { ui: { mode }, range: { enabled: true, linked: false } },
      { open: false },
    );
    expect(picker.setActivePart('to')).toBe(true);
    const order: string[] = [];
    picker.on('open', () => {
      order.push('open');
    });
    picker.on('range:switch', ({ active }) => {
      order.push(`switch:${active}`);
    });

    picker.open();
    settle();

    expect(order).toEqual(['open', 'switch:to']);
    expect(inModal(TO_TAB)?.getAttribute('aria-selected')).toBe('true');
  });

  it('21: commitOnScroll commits the range with autoCommit and keeps the picker open', () => {
    const { picker, input } = mountPicker(
      ctor(),
      { ...rangeOptions, wheel: { commitOnScroll: true, hideFooter: true } },
      { value: '09:00 - 17:00' },
    );
    const confirmed = jest.fn();
    picker.on('range:confirm', confirmed);

    press(hours(), 'ArrowDown');
    settle();

    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(confirmed).toHaveBeenCalledWith({ from: '10:00', to: '17:00', duration: 420, autoCommit: true });
    expect(input.value).toBe('10:00 - 17:00');
    expect(modal()).not.toBeNull();
  });

  it('21: commitOnScroll does nothing while canConfirm is false', () => {
    const { picker, input } = mountPicker(ctor(), {
      ...rangeOptions,
      wheel: { commitOnScroll: true, hideFooter: true },
    });
    const confirmed = jest.fn();
    const autoCommitted = jest.fn();
    picker.on('range:confirm', confirmed);
    picker.on('confirm', autoCommitted);

    press(hours(), 'ArrowDown');
    settle();

    expect(autoCommitted).toHaveBeenCalledWith(expect.objectContaining({ autoCommit: true }));
    expect(confirmed).not.toHaveBeenCalled();
    expect(input.value).toBe('');
    expect(modal()).not.toBeNull();
  });

  it('N2: an update listener added after create() already reads the new value from getRange()', () => {
    const { picker } = mountPicker(ctor(), rangeOptions, { open: false });
    const reads: Array<RangeTimeState | null> = [];
    picker.on('update', () => {
      reads.push(picker.getRange());
    });
    picker.open();
    settle();
    reads.length = 0;

    press(hours(), 'ArrowDown');

    expect(reads).toEqual([{ from: { hour: '13', minutes: '00' }, to: null }]);
  });

  it('N2: the range still follows the wheel after off("update") and a close and reopen', () => {
    const { picker } = mountPicker(ctor(), rangeOptions);
    picker.off('update');
    picker.close();
    settle();
    expect(modal()).toBeNull();

    picker.open();
    settle();
    press(hours(), 'ArrowDown');

    expect(picker.getRange()).toEqual({ from: { hour: '13', minutes: '00' }, to: null });
  });
});

describe.each(['wheel', 'compact-wheel'] as const)(
  'range in an embedded inline %s with the timezone plugin (Group A)',
  (mode) => {
    let Ctor: TimepickerUIConstructor | null = null;
    useFakeTimersAndCleanUp(() => Ctor);

    beforeEach(() => {
      Ctor = loadTimepicker(true);
    });

    const mountEmbedded = (): Mounted => {
      if (!Ctor) throw new Error('TimepickerUI is not loaded');
      const container = addInlineContainer();
      const mounted = mountPicker(
        Ctor,
        {
          clock: { type: '24h' },
          ui: { mode, inline: { enabled: true, container, embedded: true, showButtons: false } },
          range: { enabled: true, linked: false },
          timezone: { enabled: true },
        },
        { open: false },
      );
      settle();
      expect(inModal('.tp-ui-timezone')).not.toBeNull();
      return mounted;
    };

    it('setActivePart("to") emits exactly one range:switch and no update', () => {
      const { picker } = mountEmbedded();
      const heard = listen(picker, ['range:switch', 'update']);

      expect(picker.setActivePart('to')).toBe(true);

      expect(heard).toEqual(['range:switch']);
      expect(inModal(TO_TAB)?.getAttribute('aria-selected')).toBe('true');
    });

    it('a click on the To tab emits range:switch', () => {
      const { picker } = mountEmbedded();
      const onSwitch = jest.fn();
      picker.on('range:switch', onSwitch);

      inModal(TO_TAB)?.click();

      expect(onSwitch).toHaveBeenCalledTimes(1);
      expect(onSwitch).toHaveBeenCalledWith(expect.objectContaining({ active: 'to' }));
    });

    it('ArrowDown on the hours column changes getRange() for the active end', () => {
      const { picker } = mountEmbedded();

      press(hours(), 'ArrowDown');
      expect(picker.getRange()).toEqual({ from: { hour: '13', minutes: '00' }, to: null });

      picker.setActivePart('to');
      press(hours(), 'ArrowDown');
      expect(picker.getRange()).toEqual(fullRange('13', '14'));
    });

    it('setRange() on the open picker moves the wheel with no update and no select:*', () => {
      const { picker } = mountEmbedded();
      const heard = listen(picker, ['update', 'select:hour', 'select:minute', 'select:am', 'select:pm']);

      picker.setRange({ from: '09:00', to: '17:00' });

      expect(heard).toEqual([]);
      expect(selectedWheelValue('hours')).toBe('09');
      expect(selectedWheelValue('minutes')).toBe('00');
      expect(picker.getRange()).toEqual(fullRange('09', '17'));
    });
  },
);

describe('range in an embedded inline compact-wheel with the timezone plugin', () => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  beforeEach(() => {
    Ctor = loadTimepicker(true);
  });

  it('23: the tabs stay live and getRange follows keyboard steps', () => {
    if (!Ctor) throw new Error('TimepickerUI is not loaded');
    const container = addInlineContainer();
    const { picker } = mountPicker(
      Ctor,
      {
        clock: { type: '24h' },
        ui: { mode: 'compact-wheel', inline: { enabled: true, container, embedded: true } },
        range: { enabled: true, linked: false },
        timezone: { enabled: true },
      },
      { open: false },
    );
    settle();
    expect(inModal('.tp-ui-timezone')).not.toBeNull();

    press(hours(), 'ArrowDown');
    expect(picker.getRange()).toEqual({ from: { hour: '13', minutes: '00' }, to: null });

    inModal(TO_TAB)?.click();
    expect(inModal(TO_TAB)?.getAttribute('aria-selected')).toBe('true');
    expect(picker.getRange()?.to).toEqual({ hour: '13', minutes: '00' });

    press(hours(), 'ArrowDown');
    expect(picker.getRange()).toEqual(fullRange('13', '14'));
  });
});
