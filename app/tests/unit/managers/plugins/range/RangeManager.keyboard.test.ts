import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import type RangeManager from '@/managers/plugins/range/RangeManager';
import type { TimepickerOptions } from '@/types/options';

type Part = 'from' | 'to';
type TimeField = 'hour' | 'minutes' | 'seconds';
type Internals = {
  emitter: { emit: (event: string, data: unknown) => void };
  managers: { getPlugin: (name: string) => RangeManager | undefined };
};

interface RangeHarness {
  readonly picker: TimepickerUI;
  readonly input: HTMLInputElement;
  readonly range: RangeManager;
  readonly emit: (event: string, data: unknown) => void;
}

const OPEN_MS = 500;
const MAX_SPIN_STEPS = 60;

const inModal = <T extends HTMLElement = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const field = (name: TimeField): HTMLInputElement => inModal<HTMLInputElement>(`.tp-ui-${name}`);
const tab = (part: Part): HTMLElement => inModal(`.tp-ui-range-tab.tp-ui-range-${part}`);
const timeOf = (part: Part): HTMLElement => inModal(`.tp-ui-range-${part}-time`);
const okButton = (): HTMLElement => inModal('div.tp-ui-ok-btn[role="button"]');

const press = (element: Element, key: string): void => {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const chooseByKeyboard = (name: TimeField, target: string): void => {
  const input = field(name);
  input.focus();
  if (input.value === target) press(input, 'ArrowUp');
  const key = Number(target) > Number(input.value) ? 'ArrowUp' : 'ArrowDown';
  for (let step = 0; step < MAX_SPIN_STEPS && input.value !== target; step++) {
    press(input, key);
  }
  expect(input.value).toBe(target);
};

const tabOutTo = (target: HTMLElement): void => {
  const current = document.activeElement;
  if (current) press(current, 'Tab');
  target.focus();
};

const commitFromByKeyboard = (hour: string, minutes: string): void => {
  chooseByKeyboard('hour', hour);
  chooseByKeyboard('minutes', minutes);
  tabOutTo(tab('from'));
  press(tab('from'), 'ArrowRight');
  press(tab('to'), 'Enter');
};

const openRange = (options: TimepickerOptions = {}): RangeHarness => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, {
    ...options,
    clock: { type: '24h', ...options.clock },
    ui: { animation: false, ...options.ui },
    range: { enabled: true, ...options.range },
  });
  picker.create();
  picker.open();
  jest.advanceTimersByTime(OPEN_MS);

  const internals = picker as unknown as Internals;
  const range = internals.managers.getPlugin('range');
  if (!range) throw new Error('range plugin is not registered');

  return { picker, input, range, emit: (event, data) => internals.emitter.emit(event, data) };
};

describe('range From and To can be chosen with the keyboard only', () => {
  beforeAll(() => PluginRegistry.register(RangePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('From', () => {
    it('should commit From from hour and minute keydowns and move to To through the tab keyboard', () => {
      const { picker, range } = openRange();
      const onSwitch = jest.fn();
      picker.on('range:switch', onSwitch);

      chooseByKeyboard('hour', '09');
      chooseByKeyboard('minutes', '15');
      tabOutTo(tab('from'));
      press(tab('from'), 'ArrowRight');
      expect(document.activeElement).toBe(tab('to'));
      press(tab('to'), 'Enter');

      expect(range.getFromValue()).toEqual({ hour: '09', minutes: '15' });
      expect(range.getActivePart()).toBe('to');
      expect(tab('to')).toHaveAttribute('aria-selected', 'true');
      expect(onSwitch).toHaveBeenLastCalledWith(expect.objectContaining({ active: 'to' }));
      expect(timeOf('from').textContent).toBe('09:15');
      expect(document.activeElement).toBe(field('hour'));
    });

    it('should keep To disabled when only the hour was chosen by keyboard', () => {
      const { range } = openRange();

      chooseByKeyboard('hour', '09');
      tabOutTo(tab('from'));
      expect(tab('to')).toHaveAttribute('aria-disabled', 'true');

      press(tab('to'), 'Enter');
      tab('to').click();

      expect(range.getActivePart()).toBe('from');
      expect(range.getFromValue()).toBeNull();
      expect(tab('to')).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not count minutes as chosen from an update, a set value or a blur without a keydown', () => {
      const { range, emit } = openRange();
      field('hour').value = '09';
      field('minutes').value = '15';

      emit('update', { hour: '09', minutes: '15' });
      field('minutes').focus();
      field('minutes').blur();

      expect(tab('to')).toHaveAttribute('aria-disabled', 'true');
      expect(timeOf('from').textContent).toBe('09:--');
      expect(range.getFromValue()).toBeNull();
    });

    it('should need a seconds keydown before To opens when seconds are shown, then commit From with them', () => {
      const { range } = openRange({ clock: { showSeconds: true } });

      chooseByKeyboard('hour', '09');
      chooseByKeyboard('minutes', '15');
      expect(tab('to')).toHaveAttribute('aria-disabled', 'true');

      chooseByKeyboard('seconds', '05');
      expect(tab('to')).toHaveAttribute('aria-disabled', 'false');

      press(tab('to'), 'Enter');

      expect(range.getFromValue()).toEqual({ hour: '09', minutes: '15', seconds: '05' });
      expect(range.getActivePart()).toBe('to');
    });

    it('should wait for AM/PM before To opens in 12h mode', () => {
      const { range } = openRange({ clock: { type: '12h' } });

      chooseByKeyboard('hour', '09');
      chooseByKeyboard('minutes', '15');
      expect(tab('to')).toHaveAttribute('aria-disabled', 'true');

      press(inModal('.tp-ui-am'), 'Enter');
      expect(tab('to')).toHaveAttribute('aria-disabled', 'false');

      press(tab('to'), 'Enter');

      expect(range.getFromValue()).toEqual({ hour: '09', minutes: '15', type: 'AM' });
    });

    it('should accept 00 for an untouched minutes field the user tabs through', () => {
      const { range } = openRange();

      chooseByKeyboard('hour', '09');
      field('minutes').focus();
      tabOutTo(tab('from'));
      expect(tab('to')).toHaveAttribute('aria-disabled', 'false');

      press(tab('to'), 'Enter');

      expect(range.getFromValue()).toEqual({ hour: '09', minutes: '00' });
    });

    it('should disable To again and focus the hour field after Clear', () => {
      const { range } = openRange({ ui: { clearButton: true } });
      chooseByKeyboard('hour', '09');
      chooseByKeyboard('minutes', '15');
      expect(tab('to')).toHaveAttribute('aria-disabled', 'false');

      const clear = inModal('.tp-ui-clear-btn');
      expect(clear).toHaveAttribute('aria-disabled', 'false');
      press(clear, 'Enter');

      expect(tab('to')).toHaveAttribute('aria-disabled', 'true');
      expect(range.getFromValue()).toBeNull();
      expect(timeOf('from').textContent).toBe('--:--');
      expect(document.activeElement).toBe(field('hour'));
    });
  });

  describe('To and OK', () => {
    it('should confirm a keyboard-chosen To once through Enter on OK', () => {
      const { picker, input } = openRange();
      const onConfirm = jest.fn();
      picker.on('range:confirm', onConfirm);
      commitFromByKeyboard('09', '15');

      chooseByKeyboard('hour', '13');
      chooseByKeyboard('minutes', '30');
      expect(okButton()).toHaveAttribute('aria-disabled', 'false');

      press(okButton(), 'Enter');

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onConfirm).toHaveBeenCalledWith({ from: '09:15', to: '13:30', duration: 255 });
      expect(input.value).toBe('09:15 - 13:30');
    });

    it('should keep OK disabled while To has only an hour and ignore Enter on it', () => {
      const { picker, input } = openRange();
      const onConfirm = jest.fn();
      picker.on('range:confirm', onConfirm);
      commitFromByKeyboard('09', '15');

      chooseByKeyboard('hour', '13');
      expect(okButton()).toHaveAttribute('aria-disabled', 'true');

      press(okButton(), 'Enter');

      expect(onConfirm).not.toHaveBeenCalled();
      expect(input.value).toBe('');
    });

    it('should keep OK disabled for a To preview over maxDuration and enable it once To is back in range', () => {
      openRange({ range: { maxDuration: 60 } });
      commitFromByKeyboard('09', '15');

      chooseByKeyboard('hour', '11');
      chooseByKeyboard('minutes', '00');
      expect(okButton()).toHaveAttribute('aria-disabled', 'true');

      chooseByKeyboard('hour', '10');
      expect(okButton()).toHaveAttribute('aria-disabled', 'false');
    });
  });
});
