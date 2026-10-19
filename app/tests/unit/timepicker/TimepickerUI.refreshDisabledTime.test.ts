import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimeOfDay } from '@/types/options';

const SETTLE_MS = 1000;

const makeInput = (value: string): HTMLInputElement => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);
  return input;
};

const modal = (): HTMLElement | null => document.querySelector('.tp-ui-modal');

const disabledTips = (): number[] =>
  [...document.querySelectorAll<HTMLElement>('.tp-ui-modal .tp-ui-value-tips, .tp-ui-modal .tp-ui-value-tips-24h')]
    .filter((tip) => tip.classList.contains('tp-ui-tips-disabled'))
    .map((tip) => Number(tip.textContent))
    .sort((a, b) => a - b);

const withoutDisabledMarks = (root: HTMLElement): string => {
  const clone = root.cloneNode(true) as HTMLElement;
  [clone, ...clone.querySelectorAll<HTMLElement>('*')].forEach((element) => {
    element.classList.remove('tp-ui-tips-disabled', 'disabled', 'is-disabled');
    element.removeAttribute('aria-disabled');
    if (element.getAttribute('class') === '') element.removeAttribute('class');
  });
  return clone.outerHTML;
};

const createPicker = (
  input: HTMLInputElement,
  isTimeDisabled: (time: TimeOfDay) => boolean,
): TimepickerUI => {
  const picker = new TimepickerUI(input, {
    clock: { type: '24h', isTimeDisabled },
    ui: { animation: false },
  });
  picker.create();
  return picker;
};

describe('TimepickerUI.refreshDisabledTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('while open', () => {
    it('re-applies the marks in place: same modal node, only disabled classes and aria-disabled differ', () => {
      let blockedHour = 20;
      const picker = createPicker(makeInput('09:30'), ({ hour }) => hour === blockedHour);
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);
      const modalBefore = modal() as HTMLElement;
      const htmlBefore = modalBefore.outerHTML;
      const plainBefore = withoutDisabledMarks(modalBefore);
      expect(disabledTips()).toContain(20);

      blockedHour = 9;
      picker.refreshDisabledTime();

      const modalAfter = modal() as HTMLElement;
      expect(modalAfter).toBe(modalBefore);
      expect(modalAfter.outerHTML).not.toBe(htmlBefore);
      expect(withoutDisabledMarks(modalAfter)).toBe(plainBefore);
      expect(disabledTips()).toContain(9);
      expect(disabledTips()).not.toContain(20);
    });

    it('emits no update, confirm or other lifecycle event and leaves the input and value alone', () => {
      let blockedHour = 20;
      const input = makeInput('09:30');
      const picker = createPicker(input, ({ hour }) => hour === blockedHour);
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);
      const valueBefore = picker.getValue();
      const handlers = {
        update: jest.fn(),
        confirm: jest.fn(),
        cancel: jest.fn(),
        open: jest.fn(),
        clear: jest.fn(),
        error: jest.fn(),
      };
      (Object.keys(handlers) as Array<keyof typeof handlers>).forEach((name) =>
        picker.on(name, handlers[name]),
      );

      blockedHour = 9;
      picker.refreshDisabledTime();
      jest.advanceTimersByTime(SETTLE_MS);

      Object.values(handlers).forEach((handler) => expect(handler).not.toHaveBeenCalled());
      expect(input.value).toBe('09:30');
      expect(picker.getValue()).toEqual(valueBefore);
    });

    it('clears the cache so the function is asked again', () => {
      const isTimeDisabled = jest.fn(({ hour }: TimeOfDay) => hour === 20);
      const picker = createPicker(makeInput('09:30'), isTimeDisabled);
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);
      isTimeDisabled.mockClear();

      picker.refreshDisabledTime();

      expect(isTimeDisabled).toHaveBeenCalled();
    });

    it('updates the OK button', () => {
      let blocked = true;
      const picker = createPicker(makeInput('09:30'), () => blocked);
      picker.open();
      const ok = document.querySelector('.tp-ui-modal .tp-ui-ok-btn') as HTMLElement;
      expect(ok.getAttribute('aria-disabled')).toBe('true');

      blocked = false;
      picker.refreshDisabledTime();

      expect(ok.getAttribute('aria-disabled')).toBe('false');
    });
  });

  describe('while closed', () => {
    it('does not throw before the first open and the first open uses fresh results', () => {
      let blockedHour = 20;
      const picker = createPicker(makeInput('09:30'), ({ hour }) => hour === blockedHour);

      blockedHour = 7;
      expect(() => picker.refreshDisabledTime()).not.toThrow();
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(disabledTips()).toContain(7);
      expect(disabledTips()).not.toContain(20);
    });

    it('clears the cache so the next open uses fresh results', () => {
      let blockedHour = 20;
      const picker = createPicker(makeInput('09:30'), ({ hour }) => hour === blockedHour);
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);
      picker.close();
      jest.advanceTimersByTime(SETTLE_MS);
      expect(modal()).toBeNull();

      blockedHour = 7;
      picker.refreshDisabledTime();
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(disabledTips()).toContain(7);
      expect(disabledTips()).not.toContain(20);
    });

    it('creates no modal and emits nothing', () => {
      const input = makeInput('09:30');
      const picker = createPicker(input, ({ hour }) => hour === 20);
      const onUpdate = jest.fn();
      const onOpen = jest.fn();
      picker.on('update', onUpdate);
      picker.on('open', onOpen);

      picker.refreshDisabledTime();

      expect(modal()).toBeNull();
      expect(onUpdate).not.toHaveBeenCalled();
      expect(onOpen).not.toHaveBeenCalled();
      expect(input.value).toBe('09:30');
    });
  });

  describe('after destroy', () => {
    it('is a no-op and never calls the user function again', () => {
      const isTimeDisabled = jest.fn(({ hour }: TimeOfDay) => hour === 20);
      const picker = createPicker(makeInput('09:30'), isTimeDisabled);
      picker.open();
      jest.advanceTimersByTime(SETTLE_MS);
      picker.destroy();
      isTimeDisabled.mockClear();

      expect(() => picker.refreshDisabledTime()).not.toThrow();

      expect(isTimeDisabled).not.toHaveBeenCalled();
    });

    it('is a no-op on an instance that was never created', () => {
      const picker = new TimepickerUI(makeInput('09:30'), { clock: { type: '24h' } });
      picker.destroy();

      expect(() => picker.refreshDisabledTime()).not.toThrow();
    });
  });
});
