import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import { ClockSystem } from '@/managers/clock/ClockSystem';
import type { TimepickerOptions } from '@/types/options';

const SETTLE_MS = 1000;
const FRAME_MS = 16;
const FACE_SIZE = 200;
const RADIUS = FACE_SIZE / 2;
const SCROLLBAR_GAP_PROPERTY = '--tp-scrollbar-gap';
const MAX_UPDATES_FROM_ON_ERROR = 3;
const LIFECYCLE_EVENTS = ['open', 'show', 'cancel', 'confirm'] as const;
const POPOVER_OPTIONS: TimepickerOptions = { ui: { mode: 'compact-wheel' }, wheel: { placement: 'bottom' } };

type LifecycleEvent = (typeof LIFECYCLE_EVENTS)[number];
type Point = Readonly<{ clientX: number; clientY: number }>;
type Internals = { managers: { clock: { destroyClockSystem: () => void } } };

interface Mounted {
  readonly picker: TimepickerUI;
  readonly input: HTMLInputElement;
  readonly events: Readonly<Record<LifecycleEvent, jest.Mock>>;
}

const modals = (): NodeListOf<HTMLElement> => document.querySelectorAll<HTMLElement>('.tp-ui-modal');

const part = <T extends HTMLElement = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const press = (target: EventTarget, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const pointAt = (degrees: number): Point => ({
  clientX: RADIUS + RADIUS * Math.sin((degrees * Math.PI) / 180),
  clientY: RADIUS - RADIUS * Math.cos((degrees * Math.PI) / 180),
});

const mouse = (type: string, at?: Point): MouseEvent =>
  new MouseEvent(type, { ...at, bubbles: true, cancelable: true });

const readyFace = (): HTMLElement => {
  const face = part('.tp-ui-clock-face');
  Object.defineProperty(face, 'offsetWidth', { value: FACE_SIZE, configurable: true });
  Object.defineProperty(face, 'offsetHeight', { value: FACE_SIZE, configurable: true });
  return face;
};

const pointerDownOutside = (): void => {
  const outside = document.createElement('button');
  document.body.appendChild(outside);
  outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));
};

const relabel = (picker: TimepickerUI, ok = 'X'): void => {
  picker.update({ options: { labels: { ok } } });
};

const callCounts = (events: Mounted['events']): Record<string, number> =>
  Object.fromEntries(Object.entries(events).map(([name, listener]) => [name, listener.mock.calls.length]));

const createPicker = (value: string, options: TimepickerOptions = {}): Mounted => {
  const input = document.createElement('input');
  input.value = value;
  document.body.appendChild(input);

  const picker = new TimepickerUI(input, {
    ...options,
    clock: { type: '24h', ...options.clock },
    ui: { animation: true, ...options.ui },
  });
  const events = { open: jest.fn(), show: jest.fn(), cancel: jest.fn(), confirm: jest.fn() };
  LIFECYCLE_EVENTS.forEach((name) => picker.on(name, events[name]));

  picker.create();
  return { picker, input, events };
};

const openPicker = (value: string, options?: TimepickerOptions): Mounted => {
  const mounted = createPicker(value, options);
  mounted.picker.open();
  settle();
  expect(modals()).toHaveLength(1);
  return mounted;
};

describe('update() on an open picker re-renders it with the new options', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.documentElement.removeAttribute('style');
    document.body.innerHTML = '';
  });

  it('should swap in one shown modal with the new label and emit no lifecycle event', () => {
    const onOpen = jest.fn();
    const { picker, events } = openPicker('10:30', { callbacks: { onOpen } });
    const firstModal = modals()[0];

    relabel(picker);

    expect(modals()).toHaveLength(1);
    const modal = modals()[0];
    expect(modal).not.toBe(firstModal);
    expect(part('.tp-ui-ok-btn').textContent).toBe('X');
    expect(modal).not.toHaveClass('opacity');
    expect(modal).toHaveClass('show');

    settle();

    expect(callCounts(events)).toEqual({ open: 1, show: 0, cancel: 0, confirm: 0 });
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('should switch an open picker from 24h to 12h and commit the period picked afterwards', () => {
    const { picker, input } = openPicker('10:30');

    picker.update({ options: { clock: { type: '12h' } } });

    expect(input.value).toBe('10:30 AM');
    expect(part('.tp-ui-am')).toHaveAttribute('aria-pressed', 'true');
    expect(picker.getValue().type).toBe('AM');

    const setAmPm = jest.spyOn(ClockSystem.prototype, 'setAmPm');
    part('.tp-ui-pm').click();

    expect(setAmPm).toHaveBeenCalledWith('PM');

    part('.tp-ui-ok-btn').click();

    expect(input.value).toBe('10:30 PM');
  });

  it('should reset a selection that was not confirmed to the input value', () => {
    const { picker } = openPicker('10:30');
    press(part('.tp-ui-hour'), 'ArrowUp');
    expect(part<HTMLInputElement>('.tp-ui-hour').value).toBe('11');

    relabel(picker);

    expect(part<HTMLInputElement>('.tp-ui-hour').value).toBe('10');
  });

  it('should show the new modal without forcing a style flush, so the fade does not replay', () => {
    const { picker } = openPicker('10:30');
    const offsetHeight = jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get');

    relabel(picker);

    const modal = modals()[0];
    const modalReads = offsetHeight.mock.contexts.filter(
      (element) => element instanceof HTMLElement && element.classList.contains('tp-ui-modal'),
    );
    expect(modal).toHaveClass('show');
    expect(modalReads).toHaveLength(0);
  });

  it('should show the new clock face at once instead of after two animation frames', () => {
    const { picker } = createPicker('10:30');
    picker.open();
    const firstFace = part('.tp-ui-clock-face');
    expect(firstFace).not.toHaveClass('scale-in');

    relabel(picker);

    const face = part('.tp-ui-clock-face');
    expect(face).not.toBe(firstFace);
    expect(face).toHaveClass('scale-in');
  });

  describe('focus', () => {
    it.each(['.tp-ui-minutes', '.tp-ui-ok-btn'])(
      'should move focus from %s to the same control in the new modal',
      (selector) => {
        const { picker } = openPicker('10:30');
        const focused = part(selector);
        focused.focus();

        relabel(picker);

        const control = part(selector);
        expect(control).not.toBe(focused);
        expect(control.isConnected).toBe(true);
        expect(document.activeElement).toBe(control);
      },
    );

    it('should move focus to the new wrapper when the focused control is gone after the update', () => {
      const { picker } = openPicker('10:30 AM', { clock: { type: '12h' } });
      part('.tp-ui-am').focus();

      picker.update({ options: { clock: { type: '24h' } } });

      expect(document.querySelector('.tp-ui-modal .tp-ui-am')).toBeNull();
      expect(document.activeElement).toBe(part('.tp-ui-wrapper'));
    });

    it('should leave focus on the page when it was outside the picker', () => {
      const { picker } = openPicker('10:30');
      const pageButton = document.createElement('button');
      document.body.appendChild(pageButton);
      pageButton.focus();

      relabel(picker);
      jest.runAllTimers();

      expect(document.activeElement).toBe(pageButton);
    });
  });

  it('should restore the page scroll after two updates and a close', () => {
    const root = document.documentElement;
    const { picker } = openPicker('10:30');
    expect(root.style.overflowY).toBe('hidden');

    relabel(picker, 'X');
    relabel(picker, 'Y');
    picker.close();
    jest.runAllTimers();

    expect(modals()).toHaveLength(0);
    expect(root.style.overflowY).toBe('');
    expect(root.style.getPropertyValue(SCROLLBAR_GAP_PROPERTY)).toBe('');
  });

  it('should unlock the page scroll at once when ui.enableScrollbar is turned on while open', () => {
    const root = document.documentElement;
    const { picker } = openPicker('10:30');
    expect(root.style.overflowY).toBe('hidden');

    picker.update({ options: { ui: { enableScrollbar: true } } });

    expect(modals()).toHaveLength(1);
    expect(root.style.overflowY).toBe('');
    expect(root.style.getPropertyValue(SCROLLBAR_GAP_PROPERTY)).toBe('');

    picker.close();
    jest.runAllTimers();

    expect(root.style.overflowY).toBe('');
  });

  it('should render the new modal without a backdrop once ui.backdrop is turned off', () => {
    const { picker } = openPicker('10:30');
    expect(modals()[0]).not.toHaveClass('removed');

    picker.update({ options: { ui: { backdrop: false } } });

    expect(modals()).toHaveLength(1);
    expect(modals()[0]).toHaveClass('removed');
  });

  it('should not render the modal again while the picker is closing', () => {
    const { picker } = openPicker('10:30');
    picker.close();

    relabel(picker);

    expect(modals()).toHaveLength(1);
    expect(part('.tp-ui-ok-btn').textContent).toBe('OK');

    jest.runAllTimers();

    expect(modals()).toHaveLength(0);
  });

  it('should not render a modal for a closed picker', () => {
    const { picker } = createPicker('10:30');

    relabel(picker);
    settle();

    expect(modals()).toHaveLength(0);
  });

  describe('a clock drag held across the update', () => {
    it('should tear the clock of the old modal down', () => {
      const { picker } = openPicker('10:00 AM', { clock: { type: '12h' } });
      const destroyClockSystem = jest.spyOn(
        (picker as unknown as Internals).managers.clock,
        'destroyClockSystem',
      );

      relabel(picker);

      expect(destroyClockSystem).toHaveBeenCalledTimes(1);
    });

    it('should ignore the rest of a drag that started on the old clock face', () => {
      const { picker } = openPicker('10:00 AM', { clock: { type: '12h' } });
      readyFace().dispatchEvent(mouse('mousedown', pointAt(90)));
      expect(part<HTMLInputElement>('.tp-ui-hour').value).toBe('03');

      relabel(picker);
      const onUpdate = jest.fn();
      picker.on('update', onUpdate);
      document.dispatchEvent(mouse('mousemove', pointAt(180)));
      jest.advanceTimersByTime(FRAME_MS);
      document.dispatchEvent(mouse('mouseup'));

      expect(onUpdate).not.toHaveBeenCalled();
      expect(part<HTMLInputElement>('.tp-ui-hour').value).toBe('10');
    });
  });

  it('should finish the opening render first when onOpen updates the picker', () => {
    let picker: TimepickerUI | undefined;
    const onOpen = jest.fn(() => {
      if (picker) relabel(picker);
    });
    const mounted = createPicker('10:30', { callbacks: { onOpen } });
    picker = mounted.picker;

    picker.open();
    settle();

    expect(modals()).toHaveLength(1);
    expect(part('.tp-ui-ok-btn').textContent).toBe('X');
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(mounted.events.open).toHaveBeenCalledTimes(1);

    part('.tp-ui-ok-btn').click();

    expect(mounted.events.confirm).toHaveBeenCalledTimes(1);
  });

  it('should not loop when onError updates the picker on every render of an invalid input', () => {
    let picker: TimepickerUI | undefined;
    let updates = 0;
    const onError = jest.fn(() => {
      updates += 1;
      if (picker) relabel(picker, `OK ${updates}`);
    });
    const mounted = createPicker('abc', { callbacks: { onError } });
    picker = mounted.picker;

    picker.open();
    settle();

    expect(updates).toBeGreaterThan(0);
    expect(updates).toBeLessThanOrEqual(MAX_UPDATES_FROM_ON_ERROR);
    expect(modals()).toHaveLength(1);
  });

  describe('a compact-wheel popover', () => {
    beforeAll(() => PluginRegistry.register(WheelPlugin));

    it('should anchor the new modal as a popover that cancels once on an outside pointerdown', () => {
      const { picker, events } = openPicker('10:30', POPOVER_OPTIONS);

      relabel(picker);

      expect(modals()).toHaveLength(1);
      expect(modals()[0]).toHaveClass('tp-ui-popover');
      expect(modals()[0]).toHaveAttribute('data-popover-request', 'bottom');

      pointerDownOutside();

      expect(events.cancel).toHaveBeenCalledTimes(1);
    });

    it('should stop cancelling on an outside pointerdown after switching to the clock', () => {
      const { picker, events } = openPicker('10:30', POPOVER_OPTIONS);

      picker.update({ options: { ui: { mode: 'clock' } } });

      expect(modals()).toHaveLength(1);
      expect(modals()[0]).not.toHaveClass('tp-ui-popover');

      pointerDownOutside();

      expect(events.cancel).not.toHaveBeenCalled();
    });
  });
});
