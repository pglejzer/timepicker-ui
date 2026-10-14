import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import type { TimepickerOptions } from '@/types/options';

type ClockType = '12h' | '24h';
type PickerWithInput = { picker: TimepickerUI; input: HTMLInputElement };

const INLINE_HOST_ID = 'update-format-host';
const SETTLE_MS = 1000;

const buildPicker = (value: string, options: TimepickerOptions): PickerWithInput => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { ...options, ui: { animation: false, ...options.ui } });
  return { picker, input };
};

const createPicker = (value: string, options: TimepickerOptions): PickerWithInput => {
  const built = buildPicker(value, options);
  built.picker.create();
  return built;
};

describe('update() and the time format of the input', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('when clock.type or clock.showSeconds changes', () => {
    it('should turn 14:30:45 into 02:30:45 PM when a 24h picker with seconds switches to 12h', () => {
      const { picker, input } = createPicker('14:30:45', { clock: { type: '24h', showSeconds: true } });

      picker.update({ options: { clock: { type: '12h' } } });

      expect(input.value).toBe('02:30:45 PM');
      expect(picker.getValue()).toEqual(
        expect.objectContaining({ hour: '02', minutes: '30', seconds: '45', type: 'PM', time: '02:30:45 PM' }),
      );
    });

    it('should drop the seconds and then switch to 24h over two updates', () => {
      const { picker, input } = createPicker('02:30:15 PM', { clock: { type: '12h', showSeconds: true } });

      picker.update({ options: { clock: { showSeconds: false } } });

      expect(input.value).toBe('02:30 PM');

      picker.update({ options: { clock: { type: '24h' } } });

      expect(input.value).toBe('14:30');
      expect(picker.getValue().hour).toBe('14');
    });

    it('should switch to 24h and add seconds in a single update', () => {
      const { picker, input } = createPicker('03:45 PM', { clock: { type: '12h' } });

      picker.update({ options: { clock: { type: '24h', showSeconds: true } } });

      expect(input.value).toBe('15:45:00');
    });

    it.each<[string, ClockType, ClockType, string]>([
      ['12:15 AM', '12h', '24h', '00:15'],
      ['12:15 PM', '12h', '24h', '12:15'],
      ['00:15', '24h', '12h', '12:15 AM'],
      ['12:00', '24h', '12h', '12:00 PM'],
    ])('should rewrite %p as the clock changes from %s to %s into %p', (value, from, to, expected) => {
      const { picker, input } = createPicker(value, { clock: { type: from } });

      picker.update({ options: { clock: { type: to } } });

      expect(input.value).toBe(expected);
    });

    it('should append :00 when seconds are turned on', () => {
      const { picker, input } = createPicker('14:30', { clock: { type: '24h' } });

      picker.update({ options: { clock: { showSeconds: true } } });

      expect(input.value).toBe('14:30:00');
    });

    it.each(['', '99:99', 'abc'])('should leave %p unchanged when the clock type changes', (value) => {
      const { picker, input } = createPicker(value, { clock: { type: '24h' } });

      picker.update({ options: { clock: { type: '12h' } } });

      expect(input.value).toBe(value);
    });

    it('should convert on the create: true path', () => {
      const { picker, input } = createPicker('14:30', { clock: { type: '24h' } });

      picker.update({ options: { clock: { type: '12h' } }, create: true });

      expect(input.value).toBe('02:30 PM');
    });

    it('should convert on a picker that was built but never created', () => {
      const { picker, input } = buildPicker('03:45 PM', { clock: { type: '12h' } });

      picker.update({ options: { clock: { type: '24h' } } });

      expect(input.value).toBe('15:45');
    });

    it('should convert without emitting update, confirm or error', () => {
      const onUpdate = jest.fn();
      const onConfirm = jest.fn();
      const { picker, input } = createPicker('03:45 PM', {
        clock: { type: '12h' },
        callbacks: { onUpdate, onConfirm },
      });
      const updateListener = jest.fn();
      const confirmListener = jest.fn();
      const errorListener = jest.fn();
      picker.on('update', updateListener);
      picker.on('confirm', confirmListener);
      picker.on('error', errorListener);

      picker.update({ options: { clock: { type: '24h' } } });
      jest.advanceTimersByTime(SETTLE_MS);

      expect(input.value).toBe('15:45');
      expect(updateListener).not.toHaveBeenCalled();
      expect(confirmListener).not.toHaveBeenCalled();
      expect(errorListener).not.toHaveBeenCalled();
      expect(onUpdate).not.toHaveBeenCalled();
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('should reject an invalid disabledTime.interval sent with the clock change and keep the input', () => {
      const onError = jest.fn();
      const { picker, input } = createPicker('03:45 PM', { clock: { type: '12h' }, callbacks: { onError } });
      const errorListener = jest.fn();
      picker.on('error', errorListener);
      const clockBefore = { ...picker.options.clock };

      picker.update({ options: { clock: { type: '24h', disabledTime: { interval: '10:00' } } } });

      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('Invalid 24h format: "10:00"') }),
      );
      expect(onError).toHaveBeenCalledTimes(1);
      expect(picker.options.clock).toEqual(clockBefore);
      expect(input.value).toBe('03:45 PM');
    });
  });

  describe('when the time format stays the same', () => {
    it.each<[string, TimepickerOptions]>([
      ['a label', { labels: { ok: 'X' } }],
      ['the same clock type', { clock: { type: '12h' } }],
      ['the minute increment', { clock: { incrementMinutes: 5 } }],
    ])('should keep 3:45 PM exactly as typed after updating %s', (_label, options) => {
      const { picker, input } = createPicker('3:45 PM', { clock: { type: '12h' } });

      picker.update({ options });

      expect(input.value).toBe('3:45 PM');
    });
  });

  describe('on an inline picker with autoUpdate', () => {
    it('should rewrite the input and re-render the header in the 12h format', () => {
      const container = document.createElement('div');
      container.id = INLINE_HOST_ID;
      document.body.appendChild(container);
      const { picker, input } = createPicker('14:30:45', {
        clock: { type: '24h', showSeconds: true },
        ui: { inline: { enabled: true, containerId: INLINE_HOST_ID, autoUpdate: true } },
      });

      picker.update({ options: { clock: { type: '12h' } } });
      jest.advanceTimersByTime(SETTLE_MS);

      const pm = container.querySelector<HTMLElement>('.tp-ui-pm');
      expect(input.value).toBe('02:30:45 PM');
      expect(container.querySelector<HTMLInputElement>('.tp-ui-hour')?.value).toBe('02');
      expect(pm?.classList.contains('active')).toBe(true);
      expect(pm?.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('on a range picker', () => {
    beforeAll(() => PluginRegistry.register(RangePlugin));

    const createRangePicker = (): PickerWithInput =>
      createPicker('10:00 - 14:00', { clock: { type: '24h' }, range: { enabled: true } });

    it('should convert both times of a from - to value when the clock type changes', () => {
      const { picker, input } = createRangePicker();

      picker.update({ options: { clock: { type: '12h' } } });

      expect(input.value).toBe('10:00 AM - 02:00 PM');
    });

    it('should show both converted times in the range tabs after opening', () => {
      const { picker } = createRangePicker();

      picker.update({ options: { clock: { type: '12h' } } });
      picker.open();

      expect(document.querySelector('.tp-ui-range-from-time')?.textContent).toBe('10:00 AM');
      expect(document.querySelector('.tp-ui-range-to-time')?.textContent).toBe('02:00 PM');
    });
  });
});
