import type TimepickerUIClass from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';
import { TIMINGS } from '@/constants/timings';

type TimepickerUIConstructor = typeof TimepickerUIClass;

const SETTLE_MS = 2000;
const INSTANCE_ID = 'tp-clear';

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

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;
const part = (selector: string): HTMLElement => modal().querySelector(selector) as HTMLElement;

describe('TimepickerUI.clear()', () => {
  let Ctor: TimepickerUIConstructor;

  const mount = (
    options: TimepickerOptions = {},
    { value = '', open = true, create = true, range = false } = {},
  ): { picker: TimepickerUIClass; input: HTMLInputElement; recorded: string[]; payloads: unknown[][] } => {
    Ctor = loadTimepicker(range);
    const input = document.createElement('input');
    input.value = value;
    document.body.appendChild(input);
    const picker = new Ctor(input, {
      ...options,
      behavior: { ...options.behavior, id: INSTANCE_ID },
      ui: { animation: false, ...options.ui },
    });
    const recorded: string[] = [];
    const payloads: unknown[][] = [];
    (['select:hour', 'clear', 'update'] as const).forEach((name) => {
      picker.on(name, (payload: unknown) => {
        recorded.push(name);
        payloads.push([name, payload]);
      });
    });
    if (create) picker.create();
    if (open) {
      picker.open();
      settle();
    }
    return { picker, input, recorded, payloads };
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    Ctor?.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe.each([
    ['with the Clear button', true],
    ['without ui.clearButton', false],
  ])('open, %s', (_name, clearButton) => {
    it('empties the input, disables OK, emits select:hour, clear then one empty update and announces nothing', () => {
      const { picker, input, recorded, payloads } = mount({ ui: { clearButton } }, { value: '10:15 AM' });
      const cancel = part('.tp-ui-cancel-btn');
      cancel.focus();
      recorded.length = 0;
      payloads.length = 0;

      picker.clear();

      expect(input.value).toBe('');
      expect(part('.tp-ui-ok-btn').classList.contains('disabled')).toBe(true);
      expect(recorded).toEqual(['select:hour', 'clear', 'update']);
      expect(payloads[0]).toEqual(['select:hour', { hour: '12' }]);
      expect(payloads[1]).toEqual(['clear', { previousValue: '10:15 AM' }]);
      expect(payloads[2]).toEqual(['update', { hour: undefined, minutes: undefined, type: undefined }]);
      const updates = payloads.filter(([name]) => name === 'update');
      expect(updates).toHaveLength(1);
      expect(updates.some(([, payload]) => (payload as { hour?: string }).hour === '12')).toBe(false);
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
      expect(part('.timepicker-announcer').textContent).toBe('');
      expect(document.activeElement).toBe(cancel);
    });
  });

  it('closed: empties the input, emits clear and update, and the next open shows the neutral time', () => {
    const { picker, input, recorded } = mount({ clock: { type: '12h' } }, { value: '10:15 AM', open: false });

    picker.clear();

    expect(input.value).toBe('');
    expect(recorded).toEqual(['clear', 'update']);

    picker.open();
    settle();

    expect((part('.tp-ui-hour') as HTMLInputElement).value).toBe('12');
    expect((part('.tp-ui-minutes') as HTMLInputElement).value).toBe('00');
  });

  it('closed range picker: empties both ends and shows --:-- on both tabs at the next open', () => {
    const { picker } = mount(
      { clock: { type: '24h' }, range: { enabled: true } },
      { open: false, range: true },
    );
    picker.setRange({ from: '09:00', to: '17:00' });
    expect(picker.getRange()).toEqual({
      from: { hour: '09', minutes: '00' },
      to: { hour: '17', minutes: '00' },
    });

    picker.clear();

    expect(picker.getRange()).toEqual({ from: null, to: null });

    picker.open();
    settle();

    expect(part('.tp-ui-range-from-time').textContent).toBe('--:--');
    expect(part('.tp-ui-range-to-time').textContent).toBe('--:--');
  });

  it('keeps the input text with ui.clearButton { clearInput: false }', () => {
    const { picker, input, recorded } = mount(
      { ui: { clearButton: { clearInput: false } } },
      { value: '10:15 AM', open: false },
    );

    picker.clear();

    expect(input.value).toBe('10:15 AM');
    expect(recorded).toEqual(['clear', 'update']);
  });

  it('without the Clear button, a keyboard pick enables OK again', () => {
    const { picker } = mount({ ui: { clearButton: false } }, { value: '10:15 AM' });
    picker.clear();
    expect(part('.tp-ui-ok-btn').classList.contains('disabled')).toBe(true);

    part('.tp-ui-hour').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
    );

    expect(part('.tp-ui-ok-btn').classList.contains('disabled')).toBe(false);
  });

  it('creates a picker that is not created yet and clears its input', () => {
    const { picker, input } = mount({}, { value: '10:15 AM', open: false, create: false });
    expect(picker.isInitialized).toBe(false);

    picker.clear();

    expect(picker.isInitialized).toBe(true);
    expect(input.value).toBe('');
  });

  it('a click on the Clear button still announces labels.announceCleared', () => {
    mount({ ui: { clearButton: true } }, { value: '10:15 AM' });

    part('.tp-ui-clear-btn').click();
    jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);

    expect(part('.timepicker-announcer').textContent).toBe('Time cleared');
  });

  it('does nothing after destroy', () => {
    const { picker, input } = mount({}, { value: '10:15 AM', open: false });
    picker.destroy();

    expect(() => picker.clear()).not.toThrow();
    expect(input.value).toBe('10:15 AM');
  });
});
