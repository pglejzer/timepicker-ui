import type TimepickerUIClass from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';

type TimepickerUIConstructor = typeof TimepickerUIClass;
type Internals = { emitter: { emit: (event: string, data: unknown) => void } };

const SETTLE_MS = 2000;
const INSTANCE_ID = 'tp-range-api';
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

const loadTimepicker = (registerRange: boolean): TimepickerUIConstructor => {
  let ctor: TimepickerUIConstructor | undefined;
  jest.isolateModules(() => {
    ctor = require('@/timepicker/TimepickerUI').default;
    if (registerRange) {
      const { PluginRegistry } = require('@/core/PluginRegistry');
      const { RangePlugin } = require('@/plugins/range');
      PluginRegistry.register(RangePlugin);
    }
  });
  if (!ctor) throw new Error('TimepickerUI failed to load');
  return ctor;
};

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const errorsOf = (messages: jest.Mock): string[] =>
  messages.mock.calls.map(([payload]) => String((payload as { error: unknown }).error));

interface Mounted<T extends TimepickerUIClass = TimepickerUIClass> {
  readonly picker: T;
  readonly input: HTMLInputElement;
  readonly onError: jest.Mock;
}

const mountPicker = (Ctor: TimepickerUIConstructor, options: TimepickerOptions, open = true): Mounted => {
  const input = document.createElement('input');
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
  const onError = jest.fn();
  picker.on('error', onError);
  return { picker, input, onError };
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

describe('TimepickerUI range API without RangePlugin', () => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  beforeEach(() => {
    Ctor = loadTimepicker(false);
  });

  it('should emit error from setRange and leave the input untouched', () => {
    const { picker, input, onError } = mountPicker(Ctor as TimepickerUIConstructor, {});

    picker.setRange({ from: '09:00', to: '17:00' });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(errorsOf(onError)[0]).toContain('RangePlugin');
    expect(input.value).toBe('');
  });

  it('should return null from getRange and emit error', () => {
    const { picker, onError } = mountPicker(Ctor as TimepickerUIConstructor, {});

    expect(picker.getRange()).toBeNull();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(errorsOf(onError)[0]).toContain('RangePlugin');
  });

  it('should return false from setActivePart and emit error', () => {
    const { picker, onError } = mountPicker(Ctor as TimepickerUIConstructor, {});

    expect(picker.setActivePart('to')).toBe(false);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(errorsOf(onError)[0]).toContain('RangePlugin');
  });

  it('should not emit range:switch from setActivePart', () => {
    const { picker } = mountPicker(Ctor as TimepickerUIConstructor, {});
    const onSwitch = jest.fn();
    picker.on('range:switch', onSwitch);

    picker.setActivePart('from');

    expect(onSwitch).not.toHaveBeenCalled();
  });
});

describe('TimepickerUI range API with RangePlugin but range disabled', () => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  beforeEach(() => {
    Ctor = loadTimepicker(true);
  });

  it.each([
    ['unset', {}],
    ['explicitly false', { range: { enabled: false } }],
  ] as const)('should refuse every method when range.enabled is %s', (_label, options) => {
    const { picker, input, onError } = mountPicker(Ctor as TimepickerUIConstructor, options);

    picker.setRange({ from: '09:00', to: '17:00' });
    expect(picker.getRange()).toBeNull();
    expect(picker.setActivePart('to')).toBe(false);

    expect(onError).toHaveBeenCalledTimes(3);
    errorsOf(onError).forEach((message) => expect(message).toContain('range.enabled'));
    expect(input.value).toBe('');
  });
});

describe('TimepickerUI range API with range enabled', () => {
  let Ctor: TimepickerUIConstructor | null = null;
  useFakeTimersAndCleanUp(() => Ctor);

  const options24h: TimepickerOptions = { clock: { type: '24h' }, range: { enabled: true } };

  beforeEach(() => {
    Ctor = loadTimepicker(true);
  });

  const mount = (options: TimepickerOptions = options24h, open = true): Mounted =>
    mountPicker(Ctor as TimepickerUIConstructor, options, open);

  it('should return empty ends before a range is set', () => {
    const { picker, onError } = mount();

    expect(picker.getRange()).toEqual({ from: null, to: null });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should set the range, write the input and read it back', () => {
    const { picker, input, onError } = mount();

    picker.setRange({ from: '09:00', to: '17:30' });

    expect(input.value).toBe('09:00 - 17:30');
    expect(picker.getRange()).toEqual({
      from: { hour: '09', minutes: '00' },
      to: { hour: '17', minutes: '30' },
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should round-trip 12h times', () => {
    const { picker, input } = mount({ range: { enabled: true } });

    picker.setRange({ from: '9:15 AM', to: '2:30 PM' });

    expect(input.value).toBe('09:15 AM - 02:30 PM');
    expect(picker.getRange()).toEqual({
      from: { hour: '09', minutes: '15', type: 'AM' },
      to: { hour: '02', minutes: '30', type: 'PM' },
    });
  });

  it('should round-trip times with seconds', () => {
    const { picker, input } = mount({
      clock: { type: '24h', showSeconds: true },
      range: { enabled: true },
    });

    picker.setRange({ from: '09:00:10', to: '17:30:20' });

    expect(input.value).toBe('09:00:10 - 17:30:20');
    expect(picker.getRange()).toEqual({
      from: { hour: '09', minutes: '00', seconds: '10' },
      to: { hour: '17', minutes: '30', seconds: '20' },
    });
  });

  it('should leave the input as is with updateInput false', () => {
    const { picker, input } = mount();
    input.value = '08:00 - 10:00';

    picker.setRange({ from: '09:00', to: '17:30' }, false);

    expect(input.value).toBe('08:00 - 10:00');
    expect(picker.getRange()?.from).toEqual({ hour: '09', minutes: '00' });
  });

  it('should not emit confirm or range:confirm', () => {
    const { picker } = mount();
    const onConfirm = jest.fn();
    const onRangeConfirm = jest.fn();
    picker.on('confirm', onConfirm);
    picker.on('range:confirm', onRangeConfirm);

    picker.setRange({ from: '09:00', to: '17:30' });

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onRangeConfirm).not.toHaveBeenCalled();
  });

  it('should emit error and keep the range when a time is unparsable', () => {
    const { picker, input, onError } = mount();
    picker.setRange({ from: '09:00', to: '17:30' });
    const before = picker.getRange();

    picker.setRange({ from: 'nonsense', to: '18:00' });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(errorsOf(onError)[0]).toContain('nonsense');
    expect(picker.getRange()).toEqual(before);
    expect(input.value).toBe('09:00 - 17:30');
  });

  it('should show the range after set while closed and then opened', () => {
    const { picker, input } = mount(options24h, false);

    picker.setRange({ from: '09:15', to: '17:45' });
    expect(input.value).toBe('09:15 - 17:45');
    picker.open();
    settle();

    expect(document.querySelector<HTMLInputElement>('.tp-ui-modal .tp-ui-hour')?.value).toBe('09');
    expect(document.querySelector<HTMLInputElement>('.tp-ui-modal .tp-ui-minutes')?.value).toBe('15');
    expect(picker.getRange()).toEqual({
      from: { hour: '09', minutes: '15' },
      to: { hour: '17', minutes: '45' },
    });
  });

  describe('setActivePart', () => {
    it('should switch to "to", emit range:switch and leave focus and clicks alone', () => {
      const { picker } = mount();
      picker.setRange({ from: '09:00', to: '17:30' });
      const onSwitch = jest.fn();
      picker.on('range:switch', onSwitch);
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();
      const hour = document.querySelector<HTMLInputElement>('.tp-ui-modal .tp-ui-hour') as HTMLInputElement;
      const onHourClick = jest.fn();
      hour.addEventListener('click', onHourClick);

      expect(picker.setActivePart('to')).toBe(true);

      expect(onSwitch).toHaveBeenCalledWith(expect.objectContaining({ active: 'to' }));
      expect(document.activeElement).toBe(outside);
      expect(onHourClick).not.toHaveBeenCalled();
      expect(hour.value).toBe('17');
      expect(
        document.querySelector('.tp-ui-modal .tp-ui-range-to')?.getAttribute('aria-selected'),
      ).toBe('true');
    });

    it('should refuse "to" until From is complete when linked', () => {
      const { picker } = mount();
      const onSwitch = jest.fn();
      picker.on('range:switch', onSwitch);

      expect(picker.setActivePart('to')).toBe(false);

      expect(onSwitch).not.toHaveBeenCalled();
    });

    it('should allow "to" with linked: false', () => {
      const { picker } = mount({ clock: { type: '24h' }, range: { enabled: true, linked: false } });

      expect(picker.setActivePart('to')).toBe(true);
    });
  });

  describe('linked: false overnight range', () => {
    it('should accept 22:00 - 01:00 with minDuration', () => {
      const { picker, input, onError } = mount({
        clock: { type: '24h' },
        range: { enabled: true, linked: false, minDuration: 30 },
      });

      picker.setRange({ from: '22:00', to: '01:00' });

      expect(input.value).toBe('22:00 - 01:00');
      expect(picker.getRange()).toEqual({
        from: { hour: '22', minutes: '00' },
        to: { hour: '01', minutes: '00' },
      });
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('explicit linked: true', () => {
    const runScript = (options: TimepickerOptions): { events: unknown[]; markup: string; value: unknown } => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      const picker = new (Ctor as TimepickerUIConstructor)(input, {
        ...options,
        behavior: { id: INSTANCE_ID },
        ui: { animation: false },
      });
      const events: unknown[] = [];
      (['range:switch', 'range:validation', 'range:confirm', 'confirm', 'error'] as const).forEach((event) => {
        picker.on(event, (payload: unknown) => {
          events.push({ event, payload: typeof payload === 'object' ? { ...payload } : payload });
        });
      });

      picker.create();
      picker.open();
      settle();
      const emitter = (picker as unknown as Internals).emitter;
      emitter.emit('range:minute:commit', { hour: '09', minutes: '00' });
      settle();
      picker.setActivePart('from');
      picker.setActivePart('to');
      emitter.emit('range:minute:commit', { hour: '09', minutes: '45' });
      settle();
      const markup = (document.querySelector('.tp-ui-modal') as HTMLElement).outerHTML.replace(
        UUID_PATTERN,
        '<uuid>',
      );
      (document.querySelector('.tp-ui-modal .tp-ui-ok-btn') as HTMLElement).click();
      settle();
      const value = { range: picker.getRange(), input: input.value };

      picker.destroy();
      document.body.innerHTML = '';
      return { events, markup, value };
    };

    it('should match an unset linked option for events, payloads, markup and values', () => {
      const unset = runScript({ clock: { type: '24h' }, range: { enabled: true, minDuration: 30 } });
      const explicit = runScript({
        clock: { type: '24h' },
        range: { enabled: true, minDuration: 30, linked: true },
      });

      expect(unset.events.length).toBeGreaterThan(0);
      expect(explicit.events).toEqual(unset.events);
      expect(explicit.markup).toBe(unset.markup);
      expect(explicit.value).toEqual(unset.value);
    });
  });
});
