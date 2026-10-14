import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { WHEEL_ITEM_HEIGHT_PX } from './wheel-test-helpers';

type Column = 'hours' | 'minutes' | 'ampm';

const ITEM_RECT = {
  height: WHEEL_ITEM_HEIGHT_PX,
  width: 80,
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: WHEEL_ITEM_HEIGHT_PX,
  right: 80,
  toJSON: () => ({}),
} as DOMRect;

const openCompactWheel = (value: string, type: '12h' | '24h', interval: string): HTMLElement => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type, disabledTime: { interval } },
    ui: { mode: 'compact-wheel', animation: false },
  });
  picker.create();
  picker.open();
  const modal = document.querySelector<HTMLElement>('.tp-ui-modal.tp-ui-compact-wheel-mode');
  if (!modal) throw new Error('compact-wheel modal did not open');
  return modal;
};

const column = (modal: HTMLElement, type: Column): HTMLElement =>
  modal.querySelector<HTMLElement>(`.tp-ui-wheel-${type}`) as HTMLElement;

const selectedValue = (modal: HTMLElement, type: Column): string | null =>
  column(modal, type).querySelector('.tp-ui-wheel-item.is-center')?.getAttribute('data-value') ?? null;

const isDisabled = (modal: HTMLElement, type: Column, value: string): boolean => {
  const item = column(modal, type).querySelector(`.tp-ui-wheel-item[data-value="${value}"]`);
  if (!item) throw new Error(`no ${type} item ${value}`);
  return item.classList.contains('is-disabled');
};

const pressKey = (modal: HTMLElement, type: Column, key: string): void => {
  column(modal, type).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

describe('compact-wheel interval-disabled items follow the wheel selection', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));

  beforeEach(() => {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(ITEM_RECT);
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('24h, interval 14:00 - 14:30', () => {
    const INTERVAL = '14:00 - 14:30';

    it('disables minutes 00-30 when the picker opens with the hour column on 14', () => {
      const modal = openCompactWheel('14:45', '24h', INTERVAL);
      expect(selectedValue(modal, 'hours')).toBe('14');

      expect(isDisabled(modal, 'minutes', '00')).toBe(true);
      expect(isDisabled(modal, 'minutes', '15')).toBe(true);
      expect(isDisabled(modal, 'minutes', '30')).toBe(true);
      expect(isDisabled(modal, 'minutes', '31')).toBe(false);
    });

    it('disables minutes 00-30 after the hour column moves from 15 to 14', () => {
      const modal = openCompactWheel('15:10', '24h', INTERVAL);
      expect(selectedValue(modal, 'hours')).toBe('15');

      pressKey(modal, 'hours', 'ArrowUp');
      expect(selectedValue(modal, 'hours')).toBe('14');

      expect(isDisabled(modal, 'minutes', '00')).toBe(true);
      expect(isDisabled(modal, 'minutes', '15')).toBe(true);
      expect(isDisabled(modal, 'minutes', '30')).toBe(true);
      expect(isDisabled(modal, 'minutes', '31')).toBe(false);
    });

    it('enables minute 15 again after the hour column moves from 14 to 15', () => {
      const modal = openCompactWheel('14:45', '24h', INTERVAL);

      pressKey(modal, 'hours', 'ArrowDown');
      expect(selectedValue(modal, 'hours')).toBe('15');

      expect(isDisabled(modal, 'minutes', '00')).toBe(false);
      expect(isDisabled(modal, 'minutes', '15')).toBe(false);
    });
  });

  describe('12h, interval 02:00 PM - 02:30 PM', () => {
    const INTERVAL = '02:00 PM - 02:30 PM';

    it('keeps minute 15 enabled while the period column is on AM', () => {
      const modal = openCompactWheel('02:45 AM', '12h', INTERVAL);
      expect(selectedValue(modal, 'hours')).toBe('02');
      expect(selectedValue(modal, 'ampm')).toBe('AM');

      expect(isDisabled(modal, 'minutes', '00')).toBe(false);
      expect(isDisabled(modal, 'minutes', '15')).toBe(false);
    });

    it('disables minutes 00-30 after the period column moves to PM', () => {
      const modal = openCompactWheel('02:45 AM', '12h', INTERVAL);

      pressKey(modal, 'ampm', 'ArrowDown');
      expect(selectedValue(modal, 'ampm')).toBe('PM');
      expect(selectedValue(modal, 'hours')).toBe('02');

      expect(isDisabled(modal, 'minutes', '00')).toBe(true);
      expect(isDisabled(modal, 'minutes', '15')).toBe(true);
      expect(isDisabled(modal, 'minutes', '30')).toBe(true);
      expect(isDisabled(modal, 'minutes', '31')).toBe(false);
    });

    it('keeps an hour fully covered in PM enabled while the period column is on AM', () => {
      const modal = openCompactWheel('03:15 AM', '12h', '02:00 PM - 02:59 PM');
      expect(selectedValue(modal, 'ampm')).toBe('AM');

      expect(isDisabled(modal, 'hours', '02')).toBe(false);
    });
  });
});
