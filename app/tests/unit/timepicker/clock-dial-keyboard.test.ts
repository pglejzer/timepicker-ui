import TimepickerUI from '@/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

type Field = 'hour' | 'minutes' | 'seconds';

const FACE_SIZE = 200;
const RADIUS = FACE_SIZE / 2;
const SETTLE_MS = 1000;

const openPicker = (value: string, options: TimepickerOptions = {}): TimepickerUI => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  const picker = new TimepickerUI(input, { ...options, ui: { animation: false, ...options.ui } });
  picker.create();
  picker.open();
  return picker;
};

const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;
const dial = (): HTMLElement => modal().querySelector('.tp-ui-clock-face') as HTMLElement;
const field = (name: Field): HTMLInputElement => modal().querySelector(`.tp-ui-${name}`) as HTMLInputElement;
const announcer = (): HTMLElement => modal().querySelector('.timepicker-announcer') as HTMLElement;
const activeFields = (): string[] =>
  [...modal().querySelectorAll<HTMLInputElement>('input.active')].map((input) => input.classList[0]);
const tipNodes = (): Element[] => [...modal().querySelectorAll('.tp-ui-value-tips, .tp-ui-value-tips-24h')];

const dialState = (): Record<string, string | null> => ({
  label: dial().getAttribute('aria-label'),
  min: dial().getAttribute('aria-valuemin'),
  max: dial().getAttribute('aria-valuemax'),
  now: dial().getAttribute('aria-valuenow'),
  text: dial().getAttribute('aria-valuetext'),
});

const handAngle = (picker: TimepickerUI): number => {
  const match = /rotateZ\((-?[\d.]+)deg\)/.exec(picker.clockHand?.style.transform ?? '');
  return ((Number(match?.[1]) % 360) + 360) % 360;
};

const press = (target: HTMLElement, key: string): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const pointAt = (degrees: number): { clientX: number; clientY: number } => ({
  clientX: RADIUS + RADIUS * Math.sin((degrees * Math.PI) / 180),
  clientY: RADIUS - RADIUS * Math.cos((degrees * Math.PI) / 180),
});

const recordMutations = (root: Node, act: () => void): MutationRecord[] => {
  const observer = new MutationObserver(() => {});
  observer.observe(root, { attributes: true, childList: true, subtree: true, attributeOldValue: true });
  act();
  const records = observer.takeRecords();
  observer.disconnect();
  return records;
};

describe('clock dial keyboard through TimepickerUI', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('after open', () => {
    it('is a focusable slider inside the named clock group that mirrors the 12h hour field', () => {
      openPicker('10:30 AM', { clock: { type: '12h' } });

      const group = modal().querySelector('.tp-ui-body') as HTMLElement;
      expect(group).toHaveAttribute('role', 'group');
      expect(group).toHaveAttribute('aria-label', 'Clock');
      expect(dial()).toHaveAttribute('role', 'slider');
      expect(dial().tabIndex).toBe(0);
      expect(activeFields()).toEqual(['tp-ui-hour']);
      expect(dialState()).toEqual({ label: 'Hour', min: '1', max: '12', now: '10', text: '10' });
    });

    it('mirrors the 24h hour range and value', () => {
      openPicker('07:05', { clock: { type: '24h' } });

      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '7', text: '07' });
    });

    it('takes its name from a custom hourLabel at runtime while the group keeps clockLabel', () => {
      openPicker('10:30', { clock: { type: '24h' }, labels: { hourLabel: 'Godzina', clockLabel: 'Tarcza' } });

      expect(dial()).toHaveAttribute('aria-label', 'Godzina');
      expect(modal().querySelector('.tp-ui-body')).toHaveAttribute('aria-label', 'Tarcza');
    });

    it('steps once per key and mirrors the hour again after close and reopen', () => {
      const picker = openPicker('10:00', { clock: { type: '24h' } });
      press(dial(), 'Enter');
      picker.close();
      settle();
      picker.open();
      const selectHour = jest.fn();
      picker.on('select:hour', selectHour);

      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '10', text: '10' });

      press(dial(), 'ArrowRight');

      expect(field('hour').value).toBe('11');
      expect(selectHour).toHaveBeenCalledTimes(1);
      expect(dialState().now).toBe('11');
    });
  });

  describe('holding an arrow key on the hour face', () => {
    it('moves the 12h hand in place on every step: no tip rebuild, no face animation', () => {
      const picker = openPicker('10:00 AM', { clock: { type: '12h' } });
      settle();
      const animationClock = jest.fn();
      const animationStart = jest.fn();
      picker.on('animation:clock', animationClock);
      picker.on('animation:start', animationStart);
      const tipsBefore = tipNodes();
      expect(tipsBefore.length).toBeGreaterThan(0);

      for (let step = 0; step < 10; step++) {
        press(dial(), 'ArrowRight');

        const hour = Number(field('hour').value);
        expect(handAngle(picker)).toBe((hour % 12) * 30);
        expect(picker.clockHand?.classList.contains('tp-ui-tips-animation')).toBe(false);
        expect(tipNodes()).toHaveLength(tipsBefore.length);
        tipNodes().forEach((tip, index) => expect(tip).toBe(tipsBefore[index]));
      }

      expect(field('hour').value).toBe('08');
      expect(animationClock).not.toHaveBeenCalled();
      expect(animationStart).not.toHaveBeenCalled();
    });

    it('keeps the 24h inner-ring classes right across 12, 13, 23 and 00', () => {
      const picker = openPicker('11:00', { clock: { type: '24h' } });
      settle();
      const circle = modal().querySelector('.tp-ui-circle-hand') as HTMLElement;

      const steps: Array<[string, string, boolean]> = [
        ['ArrowRight', '12', false],
        ['ArrowRight', '13', true],
        ['End', '23', true],
        ['ArrowRight', '00', true],
        ['ArrowRight', '01', false],
        ['ArrowLeft', '00', true],
        ['ArrowLeft', '23', true],
      ];

      steps.forEach(([key, hour, inner]) => {
        press(dial(), key);

        expect(field('hour').value).toBe(hour);
        expect(picker.clockHand?.classList.contains('tp-ui-clock-hand-24h')).toBe(inner);
        expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(inner);
        expect(handAngle(picker)).toBe((Number(hour) % 12) * 30);
      });
    });
  });

  describe('DOM writes of an arrow step on the focused dial', () => {
    it('writes no field class and only aria-valuenow/aria-valuetext on the dial', () => {
      openPicker('10:00:00', { clock: { type: '24h', showSeconds: true } });
      settle();
      dial().focus();
      expect(activeFields()).toEqual(['tp-ui-hour']);

      const records = recordMutations(modal(), () => press(dial(), 'ArrowUp'));

      expect(field('hour').value).toBe('11');
      (['hour', 'minutes', 'seconds'] as const).forEach((name) => {
        const classWrites = records.filter(
          (record) => record.target === field(name) && record.attributeName === 'class',
        );
        expect(classWrites).toHaveLength(0);
      });
      const dialWrites = records
        .filter((record) => record.target === dial())
        .map((record) => record.attributeName)
        .sort();
      expect(dialWrites).toEqual(['aria-valuenow', 'aria-valuetext']);
      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '11', text: '11' });
    });

    it('moves the active tip and the hand in place, without rebuilding the tips', () => {
      const picker = openPicker('10:00 AM', { clock: { type: '12h' } });
      settle();
      dial().focus();
      const tipsWrapper = modal().querySelector('.tp-ui-tips-wrapper') as HTMLElement;
      const hand = picker.clockHand as HTMLElement;
      const circle = modal().querySelector('.tp-ui-circle-hand') as HTMLElement;
      const tipFor = (value: string): Element =>
        tipNodes().find((tip) => tip.textContent === value) as Element;
      const oldTip = tipFor('10');
      const newTip = tipFor('11');
      expect(oldTip.classList.contains('active')).toBe(true);

      const records = recordMutations(modal(), () => press(dial(), 'ArrowUp'));

      const tipWrites = records.filter((record) => tipsWrapper.contains(record.target));
      expect(tipWrites.filter((record) => record.type === 'childList')).toHaveLength(0);
      expect(tipWrites.every((record) => record.attributeName === 'class')).toBe(true);
      const changedTips = new Set(tipWrites.map((record) => record.target));
      expect(changedTips.size).toBe(2);
      expect(changedTips.has(oldTip)).toBe(true);
      expect(changedTips.has(newTip)).toBe(true);
      expect(oldTip.classList.contains('active')).toBe(false);
      expect(newTip.classList.contains('active')).toBe(true);
      const handWrites = records.filter((record) => record.target === hand);
      expect(handWrites.map((record) => record.attributeName)).toEqual(['style']);
      expect(records.filter((record) => record.target === circle)).toHaveLength(0);
      expect(handAngle(picker)).toBe(330);
    });
  });

  describe('a field step while another face is shown', () => {
    it('ArrowUp on the minutes field switches to the minutes face once and points the dial at minutes', () => {
      const picker = openPicker('10:30', { clock: { type: '24h' } });
      settle();
      const animationClock = jest.fn();
      picker.on('animation:clock', animationClock);

      press(field('minutes'), 'ArrowUp');

      expect(animationClock).toHaveBeenCalledTimes(1);
      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '31', text: '31' });
      expect(modal().querySelectorAll('.tp-ui-minutes-time')).toHaveLength(12);
      expect(modal().querySelectorAll('.tp-ui-hour-time-12')).toHaveLength(0);
      expect(handAngle(picker)).toBe(31 * 6);

      settle();
      press(field('minutes'), 'ArrowUp');

      expect(animationClock).toHaveBeenCalledTimes(1);
      expect(field('minutes').value).toBe('32');
      expect(dialState().now).toBe('32');
      expect(handAngle(picker)).toBe(32 * 6);
    });
  });

  describe('Enter on the dial', () => {
    it('goes from hour to minutes, then to seconds with showSeconds, keeping focus on the dial', () => {
      openPicker('10:30:15', { clock: { type: '24h', showSeconds: true } });
      dial().focus();

      press(dial(), 'Enter');

      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '30', text: '30' });
      expect(modal().querySelectorAll('.tp-ui-minutes-time')).toHaveLength(12);
      expect(document.activeElement).toBe(dial());
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
      expect(announcer().textContent).toBe('Minutes: 30');

      settle();
      press(dial(), 'Enter');

      expect(activeFields()).toEqual(['tp-ui-seconds']);
      expect(dialState()).toEqual({ label: 'Second', min: '0', max: '59', now: '15', text: '15' });
      expect(document.activeElement).toBe(dial());
      jest.advanceTimersByTime(TIMINGS.ANNOUNCE_DELAY);
      expect(announcer().textContent).toBe('Second: 15');
    });

    it('stays on minutes without showSeconds', () => {
      openPicker('10:30', { clock: { type: '24h' } });
      dial().focus();

      press(dial(), 'Enter');
      settle();
      press(dial(), 'Enter');

      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(dialState().label).toBe('Minute');
      expect(document.activeElement).toBe(dial());
    });
  });

  describe('a pointer pick on the hour face', () => {
    it('hands off to minutes so minutes is active and the dial mirrors minutes', () => {
      openPicker('10:00 AM', { clock: { type: '12h' } });
      const face = dial();
      Object.defineProperty(face, 'offsetWidth', { value: FACE_SIZE, configurable: true });
      Object.defineProperty(face, 'offsetHeight', { value: FACE_SIZE, configurable: true });
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);

      face.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, ...pointAt(90) }));
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

      expect(field('hour').value).toBe('03');
      expect(activeFields()).toEqual(['tp-ui-minutes']);
      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '0', text: '00' });
      expect(document.activeElement).toBe(field('minutes'));
    });
  });

  describe('mobile keyboard view', () => {
    beforeEach(() => {
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
    });

    const clickSwitch = (): void => {
      (modal().querySelector('button.tp-ui-keyboard-icon') as HTMLButtonElement).click();
      settle();
    };

    it('keeps the dial out of the tab order until the clock view is shown, and again after switching back', () => {
      openPicker('10:30', { clock: { type: '24h' }, ui: { mobile: true, enableSwitchIcon: true } });

      expect(dial().tabIndex).toBe(-1);
      expect(dial()).toHaveAttribute('aria-hidden', 'true');

      clickSwitch();

      expect(dial().tabIndex).toBe(0);
      expect(dial()).not.toHaveAttribute('aria-hidden');

      clickSwitch();

      expect(dial().tabIndex).toBe(-1);
      expect(dial()).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('value changes from the API and Clear', () => {
    it('setValue updates the dial value of the active field', () => {
      const picker = openPicker('10:30', { clock: { type: '24h' } });

      picker.setValue('14:45');

      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '14', text: '14' });

      field('minutes').click();
      picker.setValue('15:50');

      expect(dialState()).toEqual({ label: 'Minute', min: '0', max: '59', now: '50', text: '50' });
    });

    it('Clear points the dial back at the neutral hour', () => {
      openPicker('10:30', { clock: { type: '24h' }, ui: { clearButton: true } });
      field('minutes').click();

      (modal().querySelector('.tp-ui-clear-btn') as HTMLElement).click();

      expect(activeFields()).toEqual(['tp-ui-hour']);
      expect(dialState()).toEqual({ label: 'Hour', min: '0', max: '23', now: '12', text: '12' });
    });
  });
});
