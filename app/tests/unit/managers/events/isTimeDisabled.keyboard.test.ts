import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimeOfDay, TimepickerOptions } from '@/types/options';

type Field = 'hour' | 'minutes';

const openPicker = (
  value: string,
  isTimeDisabled: (time: TimeOfDay) => boolean,
  ui: TimepickerOptions['ui'] = {},
): TimepickerUI => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    clock: { type: '24h', isTimeDisabled },
    ui: { animation: false, ...ui },
  });
  picker.create();
  picker.open();
  return picker;
};

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;
const field = (name: Field): HTMLInputElement => modal().querySelector(`.tp-ui-${name}`) as HTMLInputElement;
const okButton = (): HTMLElement => modal().querySelector('.tp-ui-ok-btn') as HTMLElement;

const press = (target: HTMLElement, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

describe('clock.isTimeDisabled on the keyboard and OK path', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('arrow keys', () => {
    it('ArrowUp on the hour skips a predicate-disabled hour', () => {
      openPicker('10:30', ({ hour }) => hour === 11);

      press(field('hour'), 'ArrowUp');

      expect(field('hour').value).toBe('12');
    });

    it('ArrowDown on the hour skips a predicate-disabled hour', () => {
      openPicker('10:30', ({ hour }) => hour === 9);

      press(field('hour'), 'ArrowDown');

      expect(field('hour').value).toBe('08');
    });

    it('ArrowUp on the minutes skips a predicate-disabled minute', () => {
      openPicker('10:30', ({ minutes }) => minutes === 31);

      press(field('minutes'), 'ArrowUp');

      expect(field('minutes').value).toBe('32');
    });

    it('still steps normally when the predicate disables nothing nearby', () => {
      openPicker('10:30', ({ hour }) => hour === 20);

      press(field('hour'), 'ArrowUp');

      expect(field('hour').value).toBe('11');
    });
  });

  describe('typed value', () => {
    it('moves a typed disabled hour to the nearest enabled one on blur', () => {
      openPicker('10:30', ({ hour }) => hour === 15, { editable: true });
      const hour = field('hour');

      hour.value = '15';
      hour.dispatchEvent(new Event('blur'));

      expect(hour.value).toBe('16');
    });

    it('leaves a typed enabled hour alone', () => {
      openPicker('10:30', ({ hour }) => hour === 15, { editable: true });
      const hour = field('hour');

      hour.value = '14';
      hour.dispatchEvent(new Event('blur'));

      expect(hour.value).toBe('14');
    });
  });

  describe('OK button', () => {
    it('is disabled when the opened time is predicate-disabled', () => {
      openPicker('09:30', ({ hour }) => hour === 9);

      expect(okButton().getAttribute('aria-disabled')).toBe('true');
      expect(okButton()).toHaveClass('disabled');
    });

    it('is enabled when the opened time is allowed', () => {
      openPicker('10:30', ({ hour }) => hour === 9);

      expect(okButton().getAttribute('aria-disabled')).not.toBe('true');
    });

    it('does not confirm while disabled', () => {
      const picker = openPicker('09:30', ({ hour }) => hour === 9);
      const onConfirm = jest.fn();
      picker.on('confirm', onConfirm);

      okButton().click();

      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('follows the selection: moving to an allowed hour enables it', () => {
      openPicker('09:30', ({ hour }) => hour === 9);

      press(field('hour'), 'ArrowUp');

      expect(field('hour').value).toBe('10');
      expect(okButton().getAttribute('aria-disabled')).toBe('false');
    });

    it('is re-synced by refreshDisabledTime when the data behind the function changes', () => {
      let blocked = true;
      const picker = openPicker('09:30', () => blocked);
      expect(okButton().getAttribute('aria-disabled')).toBe('true');

      blocked = false;
      picker.refreshDisabledTime();

      expect(okButton().getAttribute('aria-disabled')).toBe('false');
      expect(okButton()).not.toHaveClass('disabled');
    });

    it('is disabled by a refresh that starts blocking the current time', () => {
      let blockedHour = 3;
      const picker = openPicker('09:30', ({ hour }) => hour === blockedHour);
      expect(okButton().getAttribute('aria-disabled')).not.toBe('true');

      blockedHour = 9;
      picker.refreshDisabledTime();

      expect(okButton().getAttribute('aria-disabled')).toBe('true');
    });
  });
});
